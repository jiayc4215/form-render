<!-- App.vue -->
<script setup>
import { ref } from "vue";
import Child from "./components/useModel.vue";

// 受控：父传了 v-model
const controlled = ref("受控初始值");

// 非受控：父根本不传值
</script>

<template>
  <h2>受控模式（父传 v-model）</h2>
  <Child v-model="controlled" />
  <p>父组件值：{{ controlled }}</p>

  <h2>非受控模式（父不传）</h2>
  <Child />
  <p>(父没值，子自己维护)</p>
</template>
