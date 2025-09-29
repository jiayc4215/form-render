<template>
  <el-form-renderer ref="formRef" :content="content" v-model="FormData">
  </el-form-renderer>
  <el-button type="primary" @click="submit">提交</el-button>
</template>

<script setup>
import { ref } from "vue";
import elFormRenderer from "./test_demo/el-form-renderer.vue";
const formRef = ref(null);
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
    rules: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  },
  {
    id: "age",
    type: "input-number",
    label: "年龄",
    el: {
      placeholder: "请输入年龄",
    },
    rules: [{ required: true, message: "请输入年龄", trigger: "blur" }],
  },
];
const submit = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log(FormData.value);
    })
    .catch(() => {
      console.log("校验失败");
    });
};
</script>
