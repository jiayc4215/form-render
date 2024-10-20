<template>
  <div class="box">date-picker</div>
  <el-form-renderer ref="form" :content="content" />
  <el-button type="primary" @click="printValue">print</el-button>
  {{ data }}
</template>
<script setup>
import { reactive, ref } from "vue";
import elFormRenderer from "../components/femessage/el-form-renderer.vue";
const data = ref({});
const form = ref();
const content = reactive([
  {
    id: "date",
    type: "date-picker",
    label: "date",
    el: {
      // type: 'daterange',   // 如果 type 为 daterange，则获取到的是一个数组
      // x:为时间戳
      valueFormat: "x", // 不使用 value-format 属性，则获取到的是一个空对象，格式请参考 element-ui 组件 date-picker 的日期格式部分
    },
  },
]);
const printValue = () => {
  data.value = form.value.getFormValue();
};
</script>
<style scoped>
.box {
  margin: 20px 0;
  font-size: 20px;
}
</style>
