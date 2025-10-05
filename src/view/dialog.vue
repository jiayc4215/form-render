<template>
  <el-button type="primary" @click="openDialog">打开弹窗</el-button>
</template>
<script setup>
import { renderDialog } from "./test_demo/Dialog";

import form from "./test_demo/form.vue";
const openDialog = () => {
  renderDialog(form, { msg: "晚上好，请登录 👋" }, { title: "登录" });
};
</script>
