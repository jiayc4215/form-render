---
url: /form-render/en/form/customFormRoules.md
---

# Custom Validation Rules

### Why set validation rules in custom components?

A complex form item configuration often requires defining some rules (`rules`) to limit user input, and the rules may also contain custom validators (`validator`). When there are many such form items, it will cause **the configuration items of the page file to become very long.**

Now `el-form-renderer` provides an interface for custom components. Custom components can set some rules internally to achieve encapsulation and hiding. Users no longer need to care about form validation rules.

**Just import a component, and it does it all for you!**

### Example Code




```vue
<template>
  <el-input v-model="newValue" v-bind="$attrs"></el-input>
</template>

<script setup>
let emit = defineEmits(["update:modelValue"])

import { computed, useAttrs } from "vue"

let props = defineProps({
  modelValue: String
})
const attrs = useAttrs()
console.log(attrs)

const newValue = computed({
  get: () => {
    return props.modelValue
  },
  set: value => {
    return emit("update:modelValue", value)
  }
})
defineOptions({
  rules: [
    {
      min: 3,
      max: 5,
      message: "length between 3 to 5",
      trigger: "blur"
    }
  ]
})
</script>

```

`rules` can also be a function, the parameter is the current form item configuration, and it needs to return an array.

```js
rules(item) {
  return [
    {
      required: true,
      message: `${item.id} cannot be empty`
    }
  ]
}
```

You can use `overrideRules: true` to override the built-in validation rules of custom components.

```vue
<template>
  <el-form-renderer :content="content" />
</template>
<script setup>
import { reactive, markRaw } from "vue"
import elFormRenderer from "el-form-renderer-vue3"

import MyInput from "./rules.vue"
const content = reactive([
  {
    component: markRaw(MyInput),
    id: "myInput",
    label: "Custom Validation",
    // Pass component props
    el: {
      placeholder: "Please input content",
      title: "This is a component with custom validation set"
    },
    overrideRules: true,
    rules: [
      {
        required: true,
        trigger: "blur",
        message: "Cannot be empty!"
      }
    ]
  }
])
</script>
```

### Notes

* The `rules` inside the custom component can be an array or a function that returns an array (receiving the current form item configuration as a parameter).
* You can fully override the built-in validation rules of custom components through `overrideRules: true`.
