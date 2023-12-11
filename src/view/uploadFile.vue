<template>
  <el-form-renderer ref="formRender" :content="content" />
</template>
<script setup>
import { reactive, markRaw, ref } from "vue";
import elFormRenderer from "../components/femessage/el-form-renderer.vue";

import ManualUpload from "./components/ManualUpload.vue";

const formRender = ref("");
const content = reactive([
  {
    label: "上传文件",
    component: ManualUpload,
    el: {
      limit: 1,
      action: "/admin-api/control/data/import-merchant",
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
const getValue = () => {
  const value = formRender.value.getFormValue();

  console.log(value);
};

const setValue = () => {
  formRender.value.updateForm({
    identityBack:
      "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100,https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
  });
};
</script>
<style scoped>
.box {
  margin: 20px 0;
  font-size: 20px;
}
</style>
