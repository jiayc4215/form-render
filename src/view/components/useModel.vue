<!-- Child.vue -->
<script setup>
import { useModel } from "../test_utils/useModel.js";

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);

// 用 useModel 把 props + emit 封装成 ref
const text = useModel(props, "modelValue");
</script>

<template>
  <div style="border: 1px solid #aaa; padding: 8px; margin: 8px">
    <p>子组件输入框 (双向绑定)：</p>
    <input v-model="text" />
    <p>当前值：{{ text }}</p>
  </div>
</template>
