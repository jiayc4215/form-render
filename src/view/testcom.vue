<template>
  <div>
    演示如何二次封装
    <button @click="focus">聚焦</button>
    <button @click="myChange">自己的事件</button>
    <myComf ref="mycomRef" placeholder="请输入">
      <template #append>
        <div>append</div>
      </template>
      <template #suffix>
        <div>suffix</div>
      </template>
    </myComf>
  </div>
</template>
<script setup>
import { ref } from "vue";
import myComf from "../conponents.vue";
const mycomRef = ref(null);
const focus = () => {
  mycomRef.value?.focus();
};
const myChange = () => {
  mycomRef.value?.myChange();
};
</script>
<style scoped></style>
