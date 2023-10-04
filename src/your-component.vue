<template>
  <el-input :modelValue="value" @input='onInput' v-bind="$attrs"></el-input>
  {{ value }}
</template>

<script setup>
let emit = defineEmits(["customEvent", 'update:modelValue']);
import { watch } from 'vue';
let props = defineProps({
  value: String,
  title: String
})
watch(() => props.value, () => {
  console.log('触发');
  emit('customEvent', value,)
})
const onInput = (val) => {

  emit('update:modelValue', val)
}
</script>
