<template>
  <el-form-renderer :content="content" />
</template>
<script setup>
import { reactive, markRaw } from "vue"
import elFormRenderer from "../../components/femessage/el-form-renderer.vue"

import MyInput from "./MyInput.vue"
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
    // 可以通过 overrideRules: true 来覆盖自定义组件内置的校验规则
    overrideRules: true,
    rules: [
      {
        required: true,
        trigger: "blur",
        message: "这是覆盖后的必填提示"
      },
      {
        validator: (rule, value, callback) => {
          if (value && value.length < 5) {
            callback(new Error("长度不能小于5"))
          } else {
            callback()
          }
        },
        trigger: "blur"
      }
    ]
  }
])
</script>
<style scoped></style>
