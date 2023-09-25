<template>
  <div>
    <el-form ref="elForm" v-bind="$attrs" :model="value" class="el-form-renderer">
      <template v-for="item in innerContent" :key="item.id">
        <slot :name="`id:${item.id}`" />
        <slot :name="`$id:${item.id}`" />

        <component
          :is="item.type === GROUP ? RenderFormGroup : RenderFormItem"
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

<script setup>
import RenderFormGroup from "./components/render-form-group.vue";
import RenderFormItem from "./components/render-form-item.vue";
import { reactive, computed, ref, watch } from "vue";
import transformContent from "./util/transform-content";
const GROUP = "group";
const value = reactive({});
const options = ref({});

const props = defineProps({
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
const formRef = ref(props.form);
const innerContent = computed(() => transformContent(props.content));

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
  async (newContent) => {
    if (!newContent) return;
    // 如果 content 没有变动 remote 的部分，这里需要保留之前 remote 注入的 options
    // form.value.options = { ...form.value.options, ...collect(newContent, "options") };
    setValueFromModel();
  },
  { immediate: true }
);

// watch(value, (newValue, oldValue) => {
//   if (!newValue || newValue === oldValue) return;
//   emit("update:value", transformOutputValue(newValue, innerContent.value));
// });

const setValueFromModel = () => {
  if (!this.innerContent.length) return;
  /**
   * 没使用 v-model 时才从 default 采集数据
   * default 值没法考虑 inputFormat
   * 参考 value-format.md 的案例。那种情况下，default 该传什么？
   */
  const newValue = this.form
    ? transformInputValue(this.form, this.innerContent)
    : collect(this.innerContent, "default");
  correctValue(newValue, this.innerContent);
  if (!_isequal(this.value, newValue)) this.value = newValue;
};

const updateValue = ({ id, value }) => {
  console.log(value);
  value[id] = value;
};
</script>
