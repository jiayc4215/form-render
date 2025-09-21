<!-- <template>
  <div>二次封装input</div>

  <el-input v-bind="$attrs" ref="inputRef">
    <template
      v-for="(_, slots) in $slots"
      v-slot:[slots]="slostProps"
      :key="slots"
    >
      <slot :name="slots" v-bind="slostProps"></slot>
    </template>
  </el-input>
</template>

<script setup>
import { ref } from "vue";
const inputRef = ref();

const myChange = () => {
  console.log("myChange");
};
defineExpose(
  new Proxy(
    {
      myChange,
    },
    {
      get(target, prop) {
        return target[prop] || inputRef?.value?.[prop];
      },
      has(target, prop) {
        return prop in target || prop in inputRef?.value;
      },
    }
  )
);
</script> -->
<template>
  <div>二次封装input</div>

  <component :is="h(ElInput, { ...$attrs, ref: changeRef }, $slots)" />
  or
  <vnode></vnode>
</template>

<script setup>
import { h, getCurrentInstance, useAttrs, useSlots } from "vue";
import { ElInput } from "element-plus";
let vm = getCurrentInstance();
const attrs = useAttrs();
const slots = useSlots();
const changeRef = (el) => {
  vm.exposeProxy = { ...el, myChange } || {};
  vm.exposed = { ...el, myChange } || {};
};
// 请确保返回的是一个函数而不是一个值！setup() 函数在每个组件中只会被调用一次，而返回的渲染函数将会被调用多次。
// 会导致ref失效
// const vnode = h(ElInput, { ...attrs, ref: changeRef }, slots);
const vnode = () => h(ElInput, { ...attrs, ref: changeRef }, slots);

const myChange = () => {
  console.log("myChange");
};
</script>
<!-- <template>
  <div>二次封装input</div>
  <component :is="ElInput" v-bind="attrs" ref="inputRef">
    <template
      v-for="(_, slots) in slots"
      v-slot:[slots]="slostProps"
      :key="slots"
    >
      <slot :name="slots" v-bind="slostProps"></slot>
    </template>
  </component>
</template>

<script setup>
import { h, useAttrs, useSlots, ref } from "vue";
import { ElInput } from "element-plus";
// 不让子组件的根节点渲染属性
defineOptions({
  inheritAttrs: false,
});
const attrs = useAttrs();
const slots = useSlots();
const inputRef = ref();
const getRef = () => inputRef.value;

const myChange = () => {
  console.log("myChange");
};
defineExpose({
  getRef,
  myChange,
});
</script> -->
