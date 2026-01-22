<template>
  <el-input v-model="newValue" v-bind="$attrs"></el-input>
</template>

<script setup>
let emit = defineEmits(["update:modelValue"])

import { computed, useAttrs } from "vue"
// 校验规则
const rules = [
  {
    required: true,
    message: "自定义组件的提醒消息"
  }
]
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
defineExpose({
  rules
})
</script>
<script>
export default {
  // 校验规则
  rules: [
    {
      required: true,
      message: "自定义组件的提醒消息"
    }
  ]
}
</script>
