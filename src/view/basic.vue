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
    on: {
      input: (val) => {
        console.log(val);
      },
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
  {
    id: "gender",
    type: "select",
    label: "性别",
    el: {
      placeholder: "请选择性别",
      valueKey: "id",
    },
    rules: [{ required: true, message: "请选择性别", trigger: "change" }],
    on: {
      change: (val) => {
        console.log(val);
      },
    },
    options: [
      {
        label: "男",
        value: {
          id: "male",
          name: "male",
        },
      },
      {
        label: "女",
        value: {
          id: "female",
          name: "female",
        },
      },
    ],
  },
  {
    id: "hobby",
    type: "checkbox-group",
    style: "button",
    label: "爱好",
    el: {
      placeholder: "请选择爱好",
    },

    options: [
      {
        label: "篮球",
        value: "basketball",
      },
      {
        label: "足球",
        value: "football",
      },
      {
        label: "跑步",
        value: "running",
      },
    ],
  },
  {
    id: "interest",
    type: "radio-group",

    label: "兴趣",
    el: {
      placeholder: "请选择兴趣",
    },
    options: [
      {
        label: "运动",
        value: "sport",
      },
      {
        label: "阅读",
        value: "reading",
      },
      {
        label: "旅游",
        value: "travel",
      },
    ],
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
