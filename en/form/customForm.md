---
url: /form-render/en/form/customForm.md
---

# Custom Component

### Preface

`el-form-renderer` has limited `type`s and defaults to rendering ordinary form items. If you want to render an upload component, `type` is not enough. What should you do? This is where the `component` option comes in handy.

This article will introduce how to develop custom components that meet the `el-form-renderer` access standards and achieve rendering of custom components.

### Access Standards

The key to accessing custom components is to implement `v-model` inside the component.

It is recommended to bind `$attrs` on custom components.

`el-form-renderer`'s requirements for `v-model` are:

* Have a prop named `modelValue`
* Trigger `update:modelValue` event externally

```vue
<template>
  <el-input v-model="newValue" v-bind="$attrs"></el-input>
</template>

<script setup>
import { watch, computed, useAttrs } from "vue"
let emit = defineEmits(["customEvent", "update:modelValue"])

let props = defineProps({
  modelValue: String,
  title: String
})
const attrs = useAttrs()
console.log(attrs)
watch(
  () => props.modelValue,
  () => {
    emit("customEvent", newValue.value)
  }
)

const newValue = computed({
  get: () => {
    return props.modelValue
  },
  set: value => {
    emit("update:modelValue", value)
    return value
  }
})
</script>

```

Then you can use the `component` property to let `el-form-renderer` render this custom component.

### Example Code




* Note that in the function definition in `on`, the payload of the component's emitted event will be called back to the first parameter as an "array".
* The second parameter is the `updateForm` method.
