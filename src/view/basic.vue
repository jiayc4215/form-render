<template>
  <el-form-renderer
    ref="formRef"
    :content="content"
    v-model="FormData"
    :disabled="false"
  >
  </el-form-renderer>
  <el-button type="primary" @click="submit">提交</el-button>
  <button @click="checkOption">更新Options</button>
</template>

<!-- 
:modelValue="FormData"
@update:modelValue="FormData = $event"
 -->
<!-- 基本组件  modelValue(FormData) => formRenderer (component:is) modelValue(FormData[item.id]) => 自定义组件(变化了)-->
<!--  自定义组件 emit("update:modelValue", val) => formRenderer emit("update:modelValue", val) => 页面收集到了FormData  -->
<script setup>
import { ref } from "vue";
import elFormRenderer from "./test_demo/el-form-renderer.vue";
const formRef = ref(null);
const FormData = ref({
  username: "",
  age: 0,
  customInput: "999",
});
const content = [
  {
    id: "username",
    type: "input",
    label: "用户名",
    el: {
      placeholder: "请输入用户名",
    },
    disabled: false,

    rules: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  },

  {
    id: "age",
    type: "input-number",
    label: "年龄",
    el: {
      placeholder: "请输入年龄",
    },
    hidden: (prop) => prop.username === "admin",
    rules: [{ required: true, message: "请输入年龄", trigger: "blur" }],
  },
  {
    id: "address",
    type: "select",
    label: "地址",
    el: {
      placeholder: "请输入地址",
    },
    options: [
      {
        label: "上海",
        value: "上海",
      },
      {
        label: "北京",
        value: "北京",
      },
    ],
    rules: [{ required: true, message: "请输入地址", trigger: "blur" }],
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
const checkOption = () => {
  formRef.value.setOptions("address", [{ label: "广州", value: "广州" }]);
};
</script>
