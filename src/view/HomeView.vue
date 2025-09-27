<template>
  <el-form-renderer :content="content" v-model="FormData"> </el-form-renderer>
  <el-button type="primary" @click="submit">提交</el-button>
</template>

<script setup>
import { reactive, ref } from "vue";
import elFormRenderer from "./components/el-form-renderer.vue";
const FormData = ref({
  username: "",
  age: 0,
});
const content = [
  {
    id: "username",
    type: "input",
    label: "用户名",
    el: {
      placeholder: "请输入用户名",
    },
  },
  {
    id: "age",
    type: "input-number",
    label: "年龄",
    el: {
      placeholder: "请输入年龄",
    },
  },
];
const submit = () => {
  console.log(FormData);
};
</script>
