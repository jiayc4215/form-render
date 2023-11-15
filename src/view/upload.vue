<template>
  <el-form-renderer ref="formRender" :content="content" />
  <el-button @click="getValue">父组件获取</el-button>
</template>
<script setup>
import { reactive, markRaw, ref } from "vue";
import elFormRenderer from "../components/femessage/el-form-renderer.vue";

import ImageUpload from "./components/ImageUpload.vue";

const formRender = ref("");
const content = reactive([
  {
    label: "图片上传",
    component: markRaw(ImageUpload),
    el: { isShowTip: false, limit: 1 },
    id: "identityBack",
    rules: [{ required: true, message: "请选择门头照", trigger: "blur" }],
  },
]);
const getValue = () => {
  const value = formRender.value.getFormValue();

  console.log(value);
};
</script>
<style scoped>
.box {
  margin: 20px 0;
  font-size: 20px;
}
</style>
