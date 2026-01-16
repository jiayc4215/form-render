<template>
  <div>
    <h1>watch监听对象问题</h1>
    <button @click="FormData.delivery = !FormData.delivery">change delivery</button>
    <button @click="changeRef">改变引用地址</button>
    <button @click="state.count++">改变state.count {{ state.count }}</button>
  </div>
</template>

<script setup>
import _clonedeep from "lodash.clonedeep"
import { ref, watch, reactive, toValue } from "vue"
const FormData = ref({
  delivery: false,
  type: [],
  resource: "A",
  desc: ""
})

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
    console.log("newVal", newVal)
    console.log("oldVal", oldVal)
    console.log("FormData change", newVal === oldVal)
    console.log("FormData change", newVal.type === oldVal.type)
  },
  { deep: true }
)
const changeRef = () => {
  FormData.value = {
    ...FormData.value
  }
}
const cloneDeep = obj => {
  return JSON.parse(JSON.stringify(obj))
}
const watchOldValue = (source, cb, options) => {
  const { clone = cloneDeep } = options || {}
  let val = toValue(source)
  if (typeof val !== "object" || val === null) {
    return watch(source, cb, options)
  }
  let oldVal = clone(val)
  return watch(
    source,
    (newVal, _, onCleanup) => {
      cb(newVal, oldVal, onCleanup)
      oldVal = clone(newVal)
    },
    options
  )
}
const state = reactive({
  count: 1,
  age: undefined
})
watchOldValue(
  () => state,
  (newVal, oldVal) => {
    console.log("newVal", newVal)
    console.log("oldVal", oldVal)
    console.log("state change", newVal === oldVal)
  },
  { deep: true, clone: _clonedeep }
)
</script>
