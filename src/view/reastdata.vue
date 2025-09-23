<template>
  <div>
    <h1>reastdata</h1>
    <p>a: {{ state.a }}</p>
    <p>b: {{ state.b }}</p>
    <p>c: {{ state.c }}</p>
    <p>d: {{ state.d }}</p>
    <button @click="state.a++">a++</button>
    <button @click="state.b++">b++</button>
    <button @click="state.c.push(state.c.length + 1)">c.push</button>
    <button @click="state.d = 'd'">添加属性</button>
    <button @click="reset">reset</button>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import _clonedeep from "lodash.clonedeep";
// const state = reactive({
//   a: 1,
//   b: 1,
//   c: [1, 2, 3],
// });

// const reset = () => {
//   state.a = 1;
//   state.b = 1;
//   state.c = [1, 2, 3];
//   delete state.d;
// };

const cloneDeep = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
};
const useReactive = (data, clone = cloneDeep) => {
  // 使用深拷贝确保 state 是原始数据的副本
  const state = reactive(clone(data));
  // 重置 state 数据为原始数据
  const reset = () => {
    // 删除现有的属性
    Object.keys(state).forEach((key) => delete state[key]);
    // 重新赋值为原始数据
    Object.assign(state, clone(data));
  };

  return Object.assign([state, reset], { state, reset });
};
const useRef = (data, clone = cloneDeep) => {
  const initVal = clone(data);
  const state = ref(data);
  const reset = () => {
    state.value = clone(initVal);
  };
  return Object.assign([state, reset], { state, reset });
};
const { state, reset } = useRef(
  {
    a: 1,
    b: 1,
    c: [1, 2, 3],
  },
  _clonedeep
);
</script>
