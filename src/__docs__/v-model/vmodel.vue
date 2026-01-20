<template>
  <el-form-renderer label-width="100px" :content="content" v-model:FormData="FormData" ref="form">
    <el-button @click="resetForm">reset</el-button>
    <el-button @click="setValue">设置名字为小明</el-button>
    <pre>{{ FormData }}</pre>
  </el-form-renderer>
</template>

<script setup>
import { reactive, ref } from "vue"
import elFormRenderer from "el-form-renderer-vue3"
const form = ref()
let FormData = ref({
  name: "",
  type: [],
  startDate: "2019-01-01",
  endDate: "2019-01-02",
  region: [],
  date: ["2019-01-01", "2019-01-02"]
})
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
    label: "region",
    options: [
      {
        label: "shanghai",
        value: "shanghai"
      },
      {
        label: "beijing",
        value: "beijing"
      },
      {
        label: "guangzhou",
        value: "guangzhou"
      }
    ],
    el: { filterable: true, multiple: true, multipleLimit: 2 },
    rules: [{ required: true, message: "require area", trigger: "change" }]
  },
  {
    type: "date-picker",
    id: "date",
    label: "date",
    el: {
      type: "daterange",
      valueFormat: "YYYY-MM-DD"
    },
    rules: [{ required: true, message: "require date", trigger: "change" }],
    inputFormat: row => {
      if (row.startDate && row.endDate) {
        return [row.startDate, row.endDate]
      }
    },
    outputFormat: val => {
      if (!val) {
        return { startDate: "", endDate: "" }
      }
      return {
        startDate: val[0],
        endDate: val[1]
      }
    }
  },
  {
    type: "switch",
    id: "delivery",
    label: "delivery"
  },
  {
    type: "checkbox-group",
    id: "type",
    label: "type",
    default: [],
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
    type: "radio-group",
    id: "resource",
    label: "resource",
    options: [
      {
        label: "resourceA",
        value: "A"
      },
      {
        label: "resourceB",
        value: "B"
      }
    ],
    rules: [{ required: true, message: "require resource", trigger: "change" }]
  },
  {
    type: "input",
    id: "desc",
    label: "desc",
    el: {
      type: "textarea"
    },
    rules: [{ required: true, message: "require desc", trigger: "blur" }]
  }
])
const resetForm = () => {
  form.value.resetFields()
}
const setValue = () => {
  FormData.value = {
    name: "小明",
    desc: "desc",
    type: ["typeA"],
    resource: "A",
    age: 18,
    a: 1
  }
}
</script>
