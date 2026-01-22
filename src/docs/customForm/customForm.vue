<template>
  <el-form-renderer :content="content" />
</template>
<script setup>
import { reactive, markRaw } from "vue"
import elFormRenderer from "el-form-renderer-vue3"

import MyInput from "./MyInput.vue"
const content = reactive([
  {
    component: markRaw(MyInput),
    id: "myInput",
    label: "label",
    // 传入组件属性
    el: {
      placeholder: "请输入一个 title",
      type: "input",
      title: "这是一个标题" // custom defined props
    },

    // 传入组件事件
    on: {
      focus: ([event]) => {
        console.log(event.target.value) // output: input value
      },
      customEvent: ([value, msg], updateForm) => {
        console.log(value, msg, updateForm) // output: 'message'
      }
    }
  }
])
</script>
<style scoped>
.box {
  margin: 20px 0;
  font-size: 20px;
}
</style>
