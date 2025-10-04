<template>
  <el-form ref="formRef" :model="FormData" :disabled="disabled">
    <template v-for="item in content" :key="item.id">
      <el-form-item
        v-if="
          typeof item.hidden === 'function'
            ? !item.hidden(FormData, item)
            : !item.hidden
        "
        :label="typeof item.label === 'string' ? item.label : ''"
        :prop="item.id"
        :rules="item.rules"
      >
        <!-- 
      :modelValue="FormData[item.id]"
      @update:modelValue="FormData[item.id] = $event"
 -->
        <!-- is 自定义的input组件 -->
        <template #label v-if="!(typeof item.label === 'string')">
          <vnode :content="item.label"></vnode
        ></template>
        <component
          :is="typeof item.type !== 'string' ? item.type : `el-${item.type}`"
          v-model="FormData[item.id]"
          v-bind="item.el"
          v-on="item?.on || {}"
          :disabled="
            disabled || typeof item.disabled === 'function'
              ? item.disabled(FormData, item)
              : item.disabled
          "
        >
          <template v-for="(option, index) in options[item.id]">
            <el-option
              v-if="item.type === 'select'"
              v-bind="option"
              :key="getOptionKey(item, option) || index"
            >
            </el-option>
            <el-checkbox-button
              v-if="item.type === 'checkbox-group' && item.style === 'button'"
              :key="option.value"
              v-bind="option"
              :label="'value' in option ? option.value : option.label"
            >
              {{ option.label }}
            </el-checkbox-button>
            <template
              v-else-if="
                item.type === 'checkbox-group' && item.style !== 'button'
              "
            >
              <el-checkbox
                :key="option.value"
                v-bind="option"
                :label="'value' in option ? option.value : option.label"
              >
                {{ option.label }}
              </el-checkbox>
            </template>

            <el-radio-button
              v-else-if="item.type === 'radio-group' && item.style === 'button'"
              :key="option.label"
              v-bind="option"
              :label="'value' in option ? option.value : option.label"
              >{{ option.label }}</el-radio-button
            >
            <template
              v-else-if="item.type === 'radio-group' && item.style !== 'button'"
            >
              <el-radio
                :key="option.label"
                v-bind="option"
                :label="'value' in option ? option.value : option.label"
                >{{ option.label }}</el-radio
              >
            </template>
          </template>
        </component>
      </el-form-item>
    </template>
  </el-form>
</template>
<script setup>
import { useVModle } from "./utils";
import { ref, watch, reactive } from "vue";
const formRef = ref(null);
const options = reactive({});
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  content: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: () => {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
// {
//   address: [{ label: "广州", value: "广州" }],
// }
// const arr = [
//   ["0", "a"],
//   ["1", "b"],
//   ["2", "c"],
// ];
// const obj = Object.fromEntries(arr);
// console.log(obj); // { 0: "a", 1: "b", 2: "c" }
const collect = (content, key) => {
  let result = content.reduce((prev, cur) => {
    if (cur[key]) {
      prev.push([cur.id, cur[key]]);
    }
    return prev;
  }, []);
  return Object.fromEntries(result);
};

watch(
  () => props.content,
  (newContent) => {
    try {
      if (!newContent) return;
      Object.assign(options, collect(newContent, "options"));
      console.log(options);
    } catch (error) {
      console.log(error);
    }
  },
  { immediate: true }
);
const setOptions = (id, opt) => {
  Object.assign(options, { [id]: opt });
};
const getOptionKey = (item, option) => {
  if (option.value instanceof Object) {
    if (!item?.el || !item?.el?.valueKey) return;
    return option.value[item?.el?.valueKey];
  } else {
    return option.value;
  }
};

const vnode = (props) => props.content;
const FormData = useVModle(props, "modelValue", emit);
defineExpose(
  new Proxy(
    {
      setOptions,
    },
    {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        }
        return formRef.value?.[prop];
      },
      has(target, prop) {
        return prop in target || (formRef.value && prop in formRef.value);
      },
    }
  )
);
</script>
