<template>
  <el-input v-model="newValue" v-bind="$attrs"></el-input>
</template>

<script setup>
import { watch, computed, useAttrs } from "vue"
let emit = defineEmits(["customEvent", "update:modelValue"])

let props = defineProps({
  modelValue: String,
  title: String
})
const attrs = useAttrs()
console.log(attrs)
watch(
  () => props.modelValue,
  () => {
    emit("customEvent", newValue.value)
  }
)

const newValue = computed({
  get: () => {
    return props.modelValue
  },
  set: value => {
    emit("update:modelValue", value)
    return value
  }
})
</script>
