<template>
  <el-form-renderer :content="content" inline />
</template>

<script setup>
import ElSemverInput from "./el-semver-input.vue"
import elFormRenderer from "el-form-renderer-vue3"
import { reactive, markRaw } from "vue"

const content = reactive([
  {
    id: "id",
    component: markRaw(ElSemverInput), // 也可以局部 import 组件后，直接传入引用
    on: {
      "update:modelValue": value => {
        console.log(value)
      }
    }
  }
])
</script>
