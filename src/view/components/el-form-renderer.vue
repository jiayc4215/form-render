<template>
  <el-form ref="formRef" :model="FormData">
    <el-form-item
      v-for="item in content"
      :key="item.id"
      :label="item.label"
      :prop="item.id"
      :rules="item.rules"
    >
      <component
        :is="`el-${item.type}`"
        v-model="FormData[item.id]"
        v-bind="item.el"
      />
    </el-form-item>
  </el-form>
</template>
<script setup>
import { useVModle } from "./utils";
import { ref } from "vue";
const formRef = ref(null);
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
});
const FormData = useVModle(props, "modelValue", emit);
defineExpose({
  validate: (...args) => formRef.value.validate(...args),
});
</script>
