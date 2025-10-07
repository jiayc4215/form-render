<template>
  <my-button type="info" @click="onClick"> qqq </my-button>
</template>

<script setup>
import myButton from "./test_demo/mybutton.vue";
let reqData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: "success",
      });
    }, 2000);
  });
};
const onClick = async () => {
  console.log("click");
  await reqData();
};
</script>
