<template>
  <el-form-renderer label-width="140px" ref="form" :content="content" :disabled="disabledAll">
    <el-checkbox v-model="disabledAll">禁用全部</el-checkbox>
    <el-checkbox v-model="disabledArea">禁用 area</el-checkbox>
  </el-form-renderer>
  <div style="margin-top: 16px">
    <el-button type="primary" @click="submit">提交，在控制台查看表单数据</el-button>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from "vue"
import elFormRenderer from "el-form-renderer-vue3"
let disabledAll = ref(false)
let disabledArea = ref(false)
let form = ref()
const content = reactive([
  {
    type: "input",
    id: "name",
    label: "name",
    attrs: { "data-name": "form1" },
    el: {
      size: "default",
      placeholder: "test placeholder"
    },
    rules: [
      { required: true, message: "require name", trigger: "blur" },
      { min: 3, max: 5, message: "length between 3 to 5", trigger: "blur" }
    ]
  },
  {
    type: "select",
    id: "region",
    label: "area",
    disabled: false,
    options: [
      {
        label: "area1",
        value: "shanghai"
      },
      {
        label: "area2",
        value: "beijing"
      }
    ],
    rules: [{ required: true, message: "require area", trigger: "change" }]
  },
  {
    type: "switch",
    id: "delivery",
    label: "禁用开关",
    default: true
  },
  {
    type: "checkbox-group",
    id: "type",
    label: "根据开关值禁用",
    disabled: form => form.delivery,
    options: [
      {
        label: "typeA"
      },
      {
        label: "typeB"
      },
      {
        label: "typeC"
      }
    ],
    rules: [
      {
        type: "array",
        required: true,
        message: "require type",
        trigger: "change"
      }
    ]
  },
  {
    type: "input",
    id: "desc",
    label: "desc",
    default: "使用el禁用",
    el: {
      disabled: true,
      type: "textarea"
    },
    rules: [{ required: true, message: "require desc", trigger: "blur" }]
  }
])
watch(disabledArea, val => {
  content[1].disabled = val
})
const submit = () => {
  form.value.validate(valid => {
    if (valid) console.log(form.value.getFormValue())
  })
}
</script>
