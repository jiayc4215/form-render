<template>
  <div class="format">
    <el-form-renderer :content="content" ref="formRender">
      <el-form-item>
        <el-button @click="setValue">set value</el-button>
        <el-button type="primary" @click="getValue">log value</el-button>
      </el-form-item>
    </el-form-renderer>
    <div>{{ form }}</div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue"
const formRender = ref()
import elFormRenderer from "../../components/femessage/el-form-renderer.vue"
let form = ref()
const content = reactive([
  {
    el: {
      type: "daterange",
      valueFormat: "YYYY-MM-DD"
    },

    type: "date-picker",
    id: "date",
    label: "date",
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
  }
])
const getValue = () => {
  const value = formRender.value.getFormValue()

  form.value = JSON.stringify(value)
}
const setValue = () => {
  formRender.value.updateForm({
    startDate: "2019-01-01",
    endDate: "2019-01-02"
  })
}
</script>
