<template>
  <el-form>
    <el-form-item v-for="item in content" :key="item.id" :label="item.label">
      <component
        :is="`el-${item.type}`"
        v-model="FormData[item.id]"
        v-bind="item.el"
      />
    </el-form-item>
  </el-form>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  content: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: () => {},
  },
});
const FormData = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});
</script>
