<template>
  <el-button
    v-bind="omit($attrs, ['onClick'])"
    @click="handleClick"
    :loading="loading"
  >
    <slot></slot>
  </el-button>
</template>

<script setup>
import { ref, useAttrs } from "vue";
import omit from "lodash.omit";
let attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});
// const props = defineProps({
//   onClick: {
//     type: Function,
//     default: () => {},
//   },
// });
const loading = ref(false);
async function handleClick() {
  try {
    loading.value = true;
    // await props.onClick();
    await attrs.onClick();
  } finally {
    loading.value = false;
  }
}
</script>
