<template>
  <div>
    <el-form ref="elForm" v-bind="$attrs" :model="value" class="el-form-renderer">
      <template v-for="item in innerContent" :key="item.id">
        <slot :name="`id:${item.id}`" />
        <slot :name="`$id:${item.id}`" />
        <component
          :is="item.type === GROUP ? 'render-form-group' : 'render-form-item'"
          :prop="item.id"
          :ref="item.id"
          :data="item"
          :value="value"
          :item-value="value[item.id]"
          :disabled="
            disabled ||
            (typeof item.disabled === 'function' ? item.disabled(value) : item.disabled)
          "
          :readonly="readonly || item.readonly"
          :options="options[item.id]"
          @updateValue="updateValue"
        />
      </template>
      <slot />
    </el-form>
  </div>
</template>
<script>
import _set from "lodash.set";
import _isequal from "lodash.isequal";
import _clonedeep from "lodash.clonedeep";
import transformContent from "./util/transform-content";
import RenderFormGroup from "./components/render-form-group.vue";
import RenderFormItem from "./components/render-form-item.vue";
import {
  collect,
  transformOutputValue,
  transformInputValue,
  mergeValue,
  correctValue,
} from "./util/utils";
const GROUP = "group";
export default {
  name: "ElFormRenderer",
  components: {
    RenderFormItem,
    RenderFormGroup,
  },
  provide() {
    return {
      elFormRenderer: this,
    };
  },
  // 使用v-model model定义 prop属性 event方法 组件内部实现 v-model即可
  model: {
    /**
     * value 已经被内部大量使用，所以换用 form
     */
    prop: "form",
    event: "input",
  },
  // 接收的数据
  props: {
    // 表单项
    content: {
      type: Array,
      required: true,
    },
    // 禁用
    disabled: {
      type: [Boolean, Function],
      default: false,
    },
    // 只读
    readonly: {
      type: Boolean,
      default: false,
    },
    // * v-model 的值。传入后会优先使用
    form: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      GROUP,
      /**
       * inputFormat 让整个输入机制复杂了很多。value 有以下输入路径:
       * 1. 传入的 form => inputFormat 处理
       * 2. updateForm => inputFormat 处理
       * 3. 但 content 中的 default 没法经过 inputFormat 处理，因为 inputFormat 要接受整个 value 作为参数
       * 4. 组件内部更新 value，不需要走 inputFormat
       */
      value: {}, // 表单数据对象
      options: {},
      initValue: null,
    };
  },

  computed: {
    // 用于兼容数据操作
    innerContent: ({ content }) => transformContent(content),
  },
  watch: {
    form: {
      handler(v) {
        if (!v) return;
        // 初始化数据
        this.setValueFromModel();
      },
      immediate: true,
      deep: true,
    },

    innerContent: {
      handler(v) {
        // 如果 content 没有变动 remote 的部分，这里需要保留之前 remote 注入的 options
        this.options = { ...this.options, ...collect(v, "options") };
        this.setValueFromModel();
      },
      immediate: true,
    },
    value: {
      handler(v, oldV) {
        // 执行深比较来确定两者的值是否相等。（没用变化不执行更新）
        if (!v || _isequal(v, oldV)) return;
        this.$emit("input", transformOutputValue(v, this.innerContent));
      },
      // deep: true, // updateValue 是全量更新，所以不用
    },
  },
  mounted() {
    /**
     * 与 element 相同，在 mounted 阶段存储 initValue
     * @see https://github.com/ElemeFE/element/blob/6ec5f8e900ff698cf30e9479d692784af836a108/packages/form/src/form-item.vue#L304
     */
    this.initValue = _clonedeep(this.value);
    // 初始化表单方法(validate,validateField，resetFields，clearValidate，scrollToField)
    this.$nextTick(() => {
      // proxy
      // console.log(this.$refs.elForm);
      Object.keys(this.$refs.elForm).forEach((item) => {
        if (item in this) return;
        this[item] = this.$refs.elForm[item];
      });
      /**
       * 有些组件会 created 阶段更新初始值为合法值，这会触发 validate。目前已知的情况有：
       * - el-select 开启 multiple 时，会更新初始值 undefined 为 []
       * @hack
       */
      this.clearValidate();
    });
  },
  methods: {
    /**
     * 重置表单为初始值
     *
     * @public
     */
    resetFields() {
      /**
       * 之所以不用 el-form 的 resetFields 机制，有以下原因：
       * - el-form 的 resetFields 无视 el-form-renderer 的自定义组件
       * - el-form 的 resetFields 不会触发 input & change 事件，无法监听
       * - bug1: https://github.com/FEMessage/el-data-table/issues/176#issuecomment-587280825
       * - bug2:
       *   0. 建议先在监听器 watch.value 里 console.log(v.name, oldV.name)
       *   1. 打开 basic 示例
       *   2. 在 label 为 name 的输入框里输入 1，此时 log：'1' ''
       *   3. 点击 reset 按钮，此时 log 两条数据： '1' '1', '' ''
       *   4. 因为 _isequal(v, oldV)，所以没有触发 v-model 更新
       */
      this.value = _clonedeep(this.initValue);
      this.$nextTick(this.clearValidate);
    },
    // 初始化默认值
    setValueFromModel() {
      if (!this.innerContent.length) return;
      /**
       * 没使用 v-model 时才从 default 采集数据
       * default 值没法考虑 inputFormat
       * 参考 value-format.md 的案例。那种情况下，default 该传什么？
       */
      // if 是v-model（transformInputValue）：（collect）
      const newValue = this.form
        ? transformInputValue(this.form, this.innerContent)
        : collect(this.innerContent, "default");
      // 对 group checkbox-group初始化值修正默认为空数组
      correctValue(newValue, this.innerContent);
      // 更新默认值
      if (!_isequal(this.value, newValue)) this.value = newValue;
    },
    /**
     * 更新表单数据
     * @param  {String} options.id 表单ID
     * @param  {All} options.value 表单数据
     */
    updateValue({ id, value }) {
      this.value = { ...this.value, [id]: value };
    },

    /**
     * 当 strict 为 true 时，只返回设置的表单项的值, 过滤掉冗余字段, 更多请看 update-form 示例
     * @param {{strict: Boolean}} 默认 false
     * @return {object} key is item's id, value is item's value
     * @public
     */
    getFormValue({ strict = false } = {}) {
      return transformOutputValue(this.value, this.innerContent, { strict });
    },
    /**
     * update form values
     * @param {object} newValue - key is item's id, value is the new value
     * @public
     */
    updateForm(newValue) {
      //  更新数据
      newValue = transformInputValue(newValue, this.innerContent);
      // 合并数据
      mergeValue(this.value, newValue, this.innerContent);
      this.value = { ...this.value }; //重新设置响应式更新
    },
    /**
     * update select options
     * @param {string} id<br>
     * @param {array} options
     * @public
     */
    setOptions(id, options) {
      _set(this.options, id, options);
      this.options = { ...this.options }; // 设置之前不存在的 options 时需要重新设置响应式更新
    },
    /**
     * get custom component
     * @param {string} id<br>
     * @public
     */
    //最终，该函数根据给定的 id 返回相应的组件引用（或 undefined）。这段代码的目的是根据给定的ID查找并返回相应的组件，支持组件组的情况。
    getComponentById(id) {
      // 创建一个空数组 content 用于存储组件内容
      let content = [];
      // 使用 forEach 方法遍历 this.content 数组中的每个元素（this.content 是可能包含组件的数组）。
      this.content.forEach((item) => {
        // 在循环中，检查当前元素的类型是否为 GROUP，如果是 GROUP 类型的元素，则进行以下操作：
        if (item.type === GROUP) {
          // 使用 map 方法遍历 item.items 数组中的每个元素，这里假设 item.items 包含了一组表单项（formItem）
          const items = item.items.map((formItem) => {
            // 为每个 formItem 设置一个属性 groupId，其值为当前组件的 item.id，这是为了记录该表单项所属的组件组ID。
            formItem.groupId = item.id;
            return formItem;
          });
          // 将处理后的 formItem 添加到 content 数组中。
          content.push(...items);
        } else {
          // 如果当前元素不是 GROUP 类型，则直接将其添加到 content 数组中。
          content.push(item);
        }
      });
      // 使用 find 方法查找 content 数组中具有与给定 id 匹配的元素，并将结果存储在 itemContent 中。
      const itemContent = content.find((item) => item.id === id);
      // 如果找不到具有指定 id 的元素，函数将返回 undefined。
      if (!itemContent) {
        return undefined;
      }
      // 如果找到了具有指定 id 的元素，接下来会检查该元素是否具有 groupId 属性：
      if (itemContent.groupId) {
        // 如果有 groupId 属性，表示该元素属于一个组件组，通过 this.$refs 获取组件组的引用，
        const componentRef = this.$refs[itemContent.groupId][0];
        // 并从中获取指定ID的子组件的自定义组件（customComponent）引用。
        return componentRef.$refs[`formItem-${id}`][0].$refs.customComponent;
      } else {
        // 如果没有 groupId 属性，表示该元素是独立的组件，直接通过 this.$refs 获取该组件的自定义组件引用。
        const componentRef = this.$refs[id][0];
        return componentRef.$refs.customComponent;
      }
    },
  },
};
</script>
