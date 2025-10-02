<template>
  <el-form-renderer
    ref="formRef"
    :content="content"
    v-model="FormData"
    :disabled="false"
  >
  </el-form-renderer>
  <el-button type="primary" @click="submit">提交</el-button>
</template>

<!-- 
:modelValue="FormData"
@update:modelValue="FormData = $event"
 -->
<!-- 基本组件  modelValue(FormData) => formRenderer (component:is) modelValue(FormData[item.id]) => 自定义组件(变化了)-->
<!-- <!-- 自定义组件 emit("update:modelValue", val) => formRenderer emit("update:modelValue", val) => 页面收集到了FormData  -->
<script setup>
import { ref, h, resolveComponent } from "vue";
import elFormRenderer from "./test_demo/el-form-renderer.vue";
import myInput from "./test_demo/myinput.vue";
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
    id: "customInput",
    type: myInput,
    label: h("div", null, [
      h("span", null, "编辑"),
      h(
        resolveComponent("el-icon"),
        { class: "el-icon--right", size: 20 },
        () => [h(resolveComponent("Edit"))]
      ),
    ]),
    el: {
      placeholder: "请输入自定义内容",
    },
    on: {
      focus: (e) => {
        console.log(e, "focus");
      },
      input: (e) => {
        console.log(e, "input");
      },
    },
    rules: [{ required: true, message: "请输入自定义内容", trigger: "blur" }],
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
