<template>
  <el-form-renderer label-width="100px" :content="content" ref="ruleForm"> </el-form-renderer>
</template>
<script setup>
import { reactive } from "vue"
import elFormRenderer from "el-form-renderer-vue3"
const content = reactive([
  {
    label: "fullName",
    type: "input",
    id: "fullName",
    on: {
      blur: ([event], updateForm) => {
        updateForm({ display: "blur: " + event })
      },
      focus: ([event], updateForm) => {
        updateForm({ display: "focus: " + event })
      },
      input: ([value], updateForm) => {
        updateForm({ display: "input: " + value })
      }
    }
  },
  {
    label: "display",
    type: "input",
    id: "display",
    el: { readonly: true }
  }
])
</script>
