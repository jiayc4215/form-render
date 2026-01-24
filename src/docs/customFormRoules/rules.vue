<template>
  <el-input v-model="newValue" v-bind="$attrs"></el-input>
</template>

<script setup>
let emit = defineEmits(["update:modelValue"])

import { computed, useAttrs } from "vue"

let props = defineProps({
  modelValue: String
})
const attrs = useAttrs()
console.log(attrs)

const newValue = computed({
  get: () => {
    return props.modelValue
  },
  set: value => {
    return emit("update:modelValue", value)
  }
})
defineOptions({
  rules: [
    {
      min: 3,
      max: 5,
      message: "length between 3 to 5",
      trigger: "blur"
    }
  ]
})
</script>
