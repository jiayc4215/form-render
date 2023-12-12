<template>
  <el-form-renderer ref="formRender" :content="content" />
  <el-button size="small" type="primary" @click="submitForm">提交</el-button>
</template>
<script setup>
import { reactive, markRaw, ref, provide } from "vue";
import elFormRenderer from "../components/femessage/el-form-renderer.vue";

import ManualUpload from "./components/ManualUpload.vue";

const formRender = ref("");

const content = reactive([
  {
    label: "上传文件",
    component: markRaw(ManualUpload),
    el: {
      limit: 1,
      action: "aa",
    },
    id: "files",
    rules: [
      {
        required: true,
        message: "请选上传文件",
        trigger: "blur",
        type: "array",
      },
    ],
  },
]);

const uploaded = (res) => {
  if (res.code !== 500) {
    console.log(res, "上传结果");
  }
};
const submitForm = () => {
  try {
    formRender.value.methods.validate((valid) => {
      if (valid) {
        console.log("OK");
        let params = formRender.value.getFormValue();
        formRender.value.getComponentById("files").submitUpload(params);

        //调用文件上传
        console.log(params);
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  } catch (error) {
    console.log(error);
  }
};
provide("uploaded", uploaded);
</script>
<style scoped>
.box {
  margin: 20px 0;
  font-size: 20px;
}
</style>
