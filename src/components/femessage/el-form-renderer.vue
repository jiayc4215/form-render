<template>
  <div>
    <el-form ref="myelForm" v-bind="$attrs" :model="value" class="el-form-renderer">
      <template v-for="item in innerContent" :key="item.id">
        <slot :name="`id:${item.id}`" />
        <slot :name="`$id:${item.id}`" />

        <component :is="item.type === GROUP ? RenderFormGroup : RenderFormItem" :ref="item.id" :data="item" :value="value"
          :item-value="value[item.id]" :disabled="disabled ||
            (typeof item.disabled === 'function' ? item.disabled(value) : item.disabled)
            " :readonly="readonly || item.readonly" :options="options[item.id]" @updateValue="updateValue" />
      </template>
      <slot />
    </el-form>
  </div>
</template>

<script setup>
import RenderFormGroup from "./components/render-form-group.vue";
import RenderFormItem from "./components/render-form-item.vue";
import { reactive, computed, ref, watch, onMounted, nextTick, provide } from "vue";
import transformContent from "./util/transform-content";
import _set from "lodash.set";
import _isequal from "lodash.isequal";
import _clonedeep from "lodash.clonedeep";
import {
  collect,
  mergeValue,
  transformOutputValue,
  transformInputValue,
  correctValue,
} from "./util/utils";
let GROUP = "group";
let value = reactive({});
let options = reactive({});
let initValue = reactive({});
let myelForm = ref();
let methods = {};

let emit = defineEmits(['update:form'])
onMounted(async () => {
  initValue = _clonedeep(value);
  await nextTick();

  console.log(myelForm.value);
  // 检查 myelForm 是否已经初始化
  if (myelForm && myelForm.value) {
    Object.keys(myelForm.value).forEach((item) => {
      // 检查属性是否存在于 methods 对象中
      if (myelForm.value[item] && !(item in methods)) {
        methods[item] = myelForm.value[item];
      }
    });
  }
  methods.clearValidate();
});

let props = defineProps({
  content: {
    type: Array,
    required: true,
  },
  disabled: {
    type: [Boolean, Function],
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   * v-model 的值。传入后会优先使用
   */
  form: {
    type: Object,
    default: undefined,
  },
});
let formRef = ref(props.form);
let innerContent = computed(() => transformContent(props.content));
// 初始化默认值
let setValueFromModel = () => {
  if (innerContent.length) return;
  /**
   * 没使用 v-model 时才从 default 采集数据
   * default 值没法考虑 inputFormat
   * 参考 value-format.md 的案例。那种情况下，default 该传什么？
   */
  let newValue = props.form
    ? transformInputValue(props.form, innerContent.value)
    : collect(innerContent.value, "default");
  correctValue(newValue, innerContent.value);
  if (!_isequal(value, newValue)) value = Object.assign(value, newValue);
};
watch(
  formRef,
  (newForm) => {
    if (!newForm) return;
    setValueFromModel();
  },
  { immediate: true, deep: true }
);

watch(
  innerContent,
  (newContent) => {
    try {
      if (!newContent) return;

      // 如果 content 没有变动 remote 的部分，这里需要保留之前 remote 注入的 options
      Object.assign(options, collect(newContent, "options"));
      setValueFromModel();
    } catch (error) {
      console.log(error);
    }
  },
  { immediate: true }
);

watch(
  value,
  (newValue, oldValue) => {
    console.log(_isequal(newValue, oldValue));
    if (!newValue) return;

    emit("update:form", transformOutputValue(newValue, innerContent));
  }
);

let updateValue = ({ id, value: v }) => {
  value[id] = v;
};
let resetFields = async () => {
  value = _clonedeep(initValue);
  await nextTick();
  methods.clearValidate;
};
let getFormValue = ({ strict = false } = {}) => {
  return transformOutputValue(value, innerContent, { strict });
};
let updateForm = (newValue) => {
  newValue = transformInputValue(newValue, innerContent);
  mergeValue(value, newValue, innerContent);
};
let setOptions = (id, O) => {
  _set(options, id, O);
  options = { ...options }; // 设置之前不存在的 options 时需要重新设置响应式更新
  console.log(options, "options");
};
// let getComponentById = (id) => {
//   let content = [];
//   this.content.forEach((item) => {
//     if (item.type === GROUP) {
//       const items = item.items.map((formItem) => {
//         formItem.groupId = item.id;
//         return formItem;
//       });
//       content.push(...items);
//     } else {
//       content.push(item);
//     }
//   });
//   const itemContent = content.find((item) => item.id === id);
//   if (!itemContent) {
//     return undefined;
//   }

//   if (itemContent.groupId) {
//     const componentRef = this.$refs[itemContent.groupId][0];
//     return componentRef.$refs[`formItem-${id}`][0].$refs.customComponent;
//   } else {
//     const componentRef = this.$refs[id][0];
//     return componentRef.$refs.customComponent;
//   }
// };
provide("methods", methods);
provide("updateForm", updateForm);
provide("setOptions", setOptions);
defineExpose({
  updateValue,
  resetFields,
  getFormValue,
  updateForm,
  setOptions,
  methods,
});
</script>
<script>
export default {
  name: "ElFormRenderer",
};
</script>
