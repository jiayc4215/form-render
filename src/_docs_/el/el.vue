<template>
  <el-form-renderer :content="content" />
</template>

<script setup>
import { reactive } from "vue"
import elFormRenderer from "el-form-renderer-vue3"

const content = reactive([
  {
    id: "document",
    type: "input",
    el: {
      type: "textarea"
    }
  }
])
</script>
