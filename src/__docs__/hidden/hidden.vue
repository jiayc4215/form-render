<template>
  <el-form-renderer ref="form" :content="content" />
</template>
<script setup>
import { reactive } from "vue"
import elFormRenderer from "../../components/femessage/el-form-renderer.vue"

const content = reactive([
  {
    type: "select",
    id: "hobby",
    label: "hobby",
    options: [
      {
        label: "football",
        value: "football"
      },
      {
        label: "basketball",
        value: "basketball"
      }
    ]
  },
  {
    label: "reason",
    type: "input",
    id: "reason",
    el: {
      placeholder: "why"
    }
  },
  {
    label: "idol",
    type: "input",
    id: "idol",
    el: {
      placeholder: "your idol?"
    },
    hidden: form => form.hobby !== "basketball"
  }
])
</script>
