<template>
  <el-form-renderer label-width="100px" :content="content" />
</template>
<script setup>
import { reactive, h, resolveComponent } from "vue"
import elFormRenderer from "../../components/femessage/el-form-renderer.vue"
const content = reactive([
  {
    type: "input",
    id: "name",
    el: {
      size: "small"
    },
    label: h("div", null, [
      h("span", null, "编辑"),
      h(resolveComponent("el-icon"), { class: "el-icon--right", size: 20 }, () => [h(resolveComponent("Edit"))])
    ])
  }
])
</script>
