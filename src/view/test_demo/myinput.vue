<template>
  <el-input v-model="value" v-bind="$attrs" />
</template>

<script setup>
import { computed, useAttrs } from "vue";
let attrs = useAttrs();
console.log(attrs);

let props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

let emit = defineEmits(["update:modelValue"]);
let value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
