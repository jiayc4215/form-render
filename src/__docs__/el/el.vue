<template>
  <el-form-renderer :content="content" />
</template>

<script setup>
import { reactive } from "vue"
import elFormRenderer from "../../components/femessage/el-form-renderer.vue"

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
