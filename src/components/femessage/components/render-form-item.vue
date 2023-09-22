<template>
  <div>
    <el-form-item
      v-if="_show"
      :label="typeof data.label === 'string' ? data.label : ''"
      :rules="!readonly && Array.isArray(data.rules) ? data.rules : undefined"
      v-bind="data.attrs"
      class="render-form-item"
    >
      <!-- label -->
      <v-node v-if="typeof data.label !== 'string'" slot="label" :content="data.label" />

      <template v-if="readonly && hasReadonlyContent">
        <el-input
          v-if="data.type === 'input'"
          v-bind="componentProps"
          :value="itemValue"
          readonly
          v-on="listeners"
        />
        <div v-else-if="data.type === 'select'">
          <template>
            {{ multipleValue }}
          </template>
        </div>
      </template>
    </el-form-item>
  </div>
</template>
<script>
import { noop } from "../util/utils";
import getEnableWhenStatus from "../util/enable-when";
import _includes from "lodash.includes";
import _topairs from "lodash.topairs";
import _frompairs from "lodash.frompairs";
import _get from "lodash.get";

export default {
  components: {
    /**
     * 🐂🍺只需要有组件选项对象，就可以立刻包装成函数式组件在 template 中使用
     * FYI: https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6
     */

    VNode: {
      functional: true,
      render: (h, ctx) => ctx.props.content,
    },
  },
  props: {
    data: Object,
    prop: {
      type: String,
    },
    itemValue: {},
    value: Object,
    disabled: Boolean,
    readonly: Boolean,
    options: Array,
  },
  data() {
    return {
      propsInner: {},
    };
  },
  computed: {
    componentProps: ({ data: { el }, propsInner }) => ({ ...el, ...propsInner }),
    hasReadonlyContent: ({ data: { type } }) => _includes(["input", "select"], type),
    // hidden回调
    hiddenStatus: ({ data: { hidden = () => false }, data, value }) =>
      hidden(value, data),

    // 弃用
    enableWhenStatus: ({ data: { enableWhen }, value }) =>
      getEnableWhenStatus(enableWhen, value),
    // 是否显示
    _show() {
      return !this.hiddenStatus && this.enableWhenStatus;
    },
    listeners() {
      const {
        data: {
          id,
          //noop atChange 弃用
          atChange = noop,
          on = {},
          on: { input: originOnInput = noop, change: originOnChange = noop } = {},
          trim = true,
        },
        // 父组件 更新表单方法
        $parent: {
          $parent: { updateForm },
        },
      } = this;
      //合并方法
      return {
        //_.fromPairs([['fred', 30], ['barney', 40]]);
        // => { 'fred': 30, 'barney': 40 }
        ..._frompairs(
          //创建一个object对象自身可枚举属性的键值对数组
          _topairs(on).map(([eName, handler]) => [
            eName,
            //执行回调
            (...args) => handler(args, updateForm),
          ])
        ),
        // 手动更新表单数据
        input: (value, ...rest) => {
          // 更新表单时调用
          this.$emit("updateValue", { id, value });
          //弃用
          atChange(id, value);
          //执行回调
          originOnInput([value, ...rest], updateForm);

          // FIXME: rules 的 trigger 只写了 blur，依然会在 input 的时候触发校验！
          this.triggerValidate(id);
        },
        change: (value, ...rest) => {
          //去除空格
          if (typeof value === "string" && trim) value = value.trim();
          // 更新表单时调用
          this.$emit("updateValue", { id, value });
          //执行回调
          originOnChange([value, ...rest], updateForm);

          // FIXME: rules 的 trigger 只写了 blur，依然会在 change 的时候触发校验！
          this.triggerValidate(id);
        },
      };
    },

    multipleValue: ({ data, itemValue, options = [] }) => {
      const multipleSelectValue =
        _get(data, "el.multiple") && Array.isArray(itemValue) ? itemValue : [itemValue];
      return multipleSelectValue
        .map((val) => (options.find((op) => op.value === val) || {}).label)
        .join();
    },
  },
};
</script>
