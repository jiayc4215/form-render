---
map:
  path: /form/customForm/
---

# 自定义组件

### 前言

el-form-renderer 的 type 有限, 默认只能渲染普通的表单项, 假如现在要渲染一个上传组件, type 就不够用了, 那怎么办呢? 这时候 component 选项就派上用场了

本文将介绍如何开发符合 el-form-renderer 接入标准的自定义组件, 实现对自定义组件的渲染

### 接入标准

自定义组件接入的关键是在组件内部实现 v-model

建议在自定义组件上绑定 $attrs

el-form-renderer 对 v-model 的要求是:

- 有一个 props 为 modelValue
- 对外触发 update:modelValue 事件

下面是一个简单的例子

```
<template>
  <el-input v-model="newValue" v-bind="$attrs"></el-input>
</template>

<script setup>
let emit = defineEmits(["customEvent", "update:modelValue"]);
import { watch, computed } from "vue";
let props = defineProps({
  modelValue: String,
  title: String,
});

watch(
  () => props.modelValue,
  () => {
    console.log("触发");
    emit("customEvent", newValue.value);
  }
);
// 计算属性求和
const newValue = computed({
  get: () => {
    console.log("get");
    return props.modelValue;
  },
  set: (value) => {
    console.log("set");
    return emit("update:modelValue", value);
  },
});
</script>
<script>
```

则可以用 component 属性让 el-form-renderer 渲染此自定义组件

### 示例代码

<demo src="./MyInput.vue" 
  title="自定义组件实现" 
  desc="遵循 v-model 标准的自定义组件实现">
</demo>

<demo src="./customForm.vue" 
  title="使用自定义组件" 
  desc="在 el-form-renderer 中使用自定义组件">
</demo>

- 需要注意，on 中的 function 定义，组件 emit 事件的 payload 将以「数组」的方式，回调到第一个参数
- 第二个参数为 updateForm 方法
