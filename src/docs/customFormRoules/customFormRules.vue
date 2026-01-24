<template>
  <el-form-renderer :content="content" />
</template>
<script setup>
import { reactive, markRaw } from "vue"
import elFormRenderer from "el-form-renderer-vue3"

import MyInput from "./rules.vue"
const content = reactive([
  {
    component: markRaw(MyInput),
    id: "myInput",
    label: "自定义校验",
    // 传入组件属性
    el: {
      placeholder: "请输入内容",
      title: "这是设置了自定义校验的组件"
    },
    overrideRules: true, //来覆盖自定义组件内置的校验规则

    rules: [
      {
        required: true,
        trigger: "blur",
        message: "不能为空！"
      }
    ]
  }
])
</script>
<style scoped></style>
