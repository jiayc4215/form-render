<template>
  <el-form-renderer ref="form" :content="content">
    <el-button @click="setOptions">set</el-button>
  </el-form-renderer>
</template>
<script setup>
import { reactive, ref } from "vue"
import elFormRenderer from "el-form-renderer-vue3"
const form = ref()
const content = reactive([
  {
    id: "area",
    type: "select",
    label: "select",
    el: {
      placeholder: "select"
    },
    options: [
      {
        label: "shanghai",
        value: "shanghai"
      },
      {
        label: "beijing",
        value: "beijing"
      }
    ]
  }
])

const setOptions = () => {
  form.value.setOptions("area", [
    {
      label: "guangzhou",
      value: "guangzhou"
    },
    {
      label: "hangzhou",
      value: "hangzhou"
    }
  ])
}
</script>
