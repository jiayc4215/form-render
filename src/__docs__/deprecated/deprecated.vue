<template>
  <el-form-renderer ref="form" label-width="100px" :content="content">
    <el-button @click="getFormValue">getFormValue</el-button>
  </el-form-renderer>
</template>

<script setup>
import { reactive, ref } from "vue"
import elFormRenderer from "el-form-renderer-vue3"
import { ElMessage } from "element-plus"

const form = ref()

const content = reactive([
  {
    type: "radioGroup", // 推荐写作 radio-group
    $id: "resource", // 推荐不加 $
    label: "resource",
    options: [
      {
        label: "resourceA"
      },
      {
        label: "resourceB"
      }
    ],
    rules: [{ required: true, message: "miss resource", trigger: "change" }]
  }
])
const getFormValue = () => {
  let v = form.value.getFormValue()
  ElMessage.info(JSON.stringify(v))
}
</script>
