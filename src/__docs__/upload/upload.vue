<template>
  <el-form-renderer ref="formRender" :content="content" />
  <el-button @click="getValue">获取图片地址</el-button>
  <el-button @click="setValue">设置图片地址</el-button>
</template>
<script setup>
import { reactive, markRaw, ref } from "vue"
import elFormRenderer from "../../components/femessage/el-form-renderer.vue"

import ImageUpload from "./ImageUpload.vue"

const formRender = ref("")
const content = reactive([
  {
    label: "图片上传",
    component: markRaw(ImageUpload),
    el: {
      isShowTip: false,
      limit: 2,
      extralData: {
        type: "identityBack"
      }
    },
    id: "identityBack",
    rules: [{ required: true, message: "请选择门头照", trigger: "blur" }]
  }
])
const getValue = () => {
  const value = formRender.value.getFormValue()

  console.log(value)
}

const setValue = () => {
  formRender.value.updateForm({
    identityBack:
      "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100,https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
  })
}
</script>
<style scoped></style>
