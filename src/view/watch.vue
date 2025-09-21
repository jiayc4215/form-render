<template>
  <div>
    <h1>watch监听对象问题</h1>
    <button @click="FormData.delivery = !FormData.delivery">
      change delivery
    </button>
    <button @click="changeRef">改变引用地址</button>
  </div>
</template>

<script setup>
import _clonedeep from "lodash.clonedeep";
import { ref, watch, computed } from "vue";
const FormData = ref({
  delivery: false,
  type: [],
  resource: "A",
  desc: "",
});
const computeData = computed(() => {
  //   return Object.assign({}, FormData.value);
  //   return _clonedeep(FormData.value);
  return JSON.stringify(FormData.value);
});
// watch(
//   () => computeData.value,
//   (newVal, oldVal) => {
//     // console.log("newVal", newVal);
//     // console.log("oldVal", oldVal);
//     // console.log("FormData change", newVal === oldVal);
//     // console.log("FormData change", newVal.type === oldVal.type);
//     let newValObj = JSON.parse(newVal);
//     let oldValObj = JSON.parse(oldVal);
//     console.log("newVal", newValObj);
//     console.log("oldVal", oldValObj);
//     console.log("FormData change", newValObj === oldValObj);
//     console.log("FormData change", newValObj.type === oldValObj.type);
//   },
//   { deep: true }
// );
watch(
  () => FormData.value,
  (newVal, oldVal) => {
    console.log("newVal", newVal);
    console.log("oldVal", oldVal);
    console.log("FormData change", newVal === oldVal);
    console.log("FormData change", newVal.type === oldVal.type);
  },
  { deep: true }
);
const changeRef = () => {
  FormData.value = {
    ...FormData.value,
  };
};
</script>
