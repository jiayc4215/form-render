<template>
  <el-form>
    <el-form-item v-for="item in content" :key="item.id" :label="item.label">
      <component
        :is="`el-${item.type}`"
        v-model="FormData[item.id]"
        v-bind="item.el"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">比较</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { computed } from "vue";
import { useVModel } from "../../indexqqq";
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
const FormData = useVModel(props, "modelValue", null, {
  passive: true,
  deep: true,
  clone: true,
});
console.log(FormData.value, "FormData.value");
const submit = () => {
  console.log(FormData.value === props.modelValue, "FormData.value");
};
</script>
