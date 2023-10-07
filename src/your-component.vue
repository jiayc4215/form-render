<template>
  <el-input v-model="newValue" v-bind="$attrs"></el-input>
</template>

<script setup>
let emit = defineEmits(["customEvent", "update:modelValue"]);
import { watch, computed } from "vue";
let props = defineProps({
  modelValue: String,
  title: String,
});
const rules = [
  {
    required: true,
    message: "自定义组件的提醒消息",
  },
];
watch(
  () => props.modelValue,
  () => {
    console.log("触发");
    emit("customEvent", newValue.value);
  }
);
// 计算属性求和
const newValue = computed({
  get: () => {
    console.log("get");
    return props.modelValue;
  },
  set: (value) => {
    console.log("set");
    return emit("update:modelValue", value);
  },
});
defineExpose({ rules });
</script>
