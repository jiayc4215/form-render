---
map:
  path: /form/customFormRoules/
---

# 自定义校验规则

### 为何要在自定义组件设置校验规则?

一个复杂的表单项配置, 往往需要定义一些规则(rules)来限制用户输入, 规则里面可能还会有自定义的验证器(validator), 这样的表单项多了之后, 就会导致 **页面文件的配置项变得很长很长.**

现在 el-form-renderer 为自定义组件提供了一个接口, 自定义组件可以内部设置一些规则, 从而达到封装隐藏目的, 使用者可以不用再关心表单的验证规则。

**只需引入一个组件, 它全帮你做好了!**

### 示例代码

<demo src="./customFormRules.vue" 
  title="自定义组件实现" 
  desc="your-page.vue">
</demo>

::: details 下面是一个简单的例子
<<< ../../../src/docs/customFormRoules/rules.vue
:::

rules 也可以是个函数, 参数是当前表单项配置, 需要返回一个数组.

```js
rules(item) {
  return [
    {
      required: true,
      message: `${item.id} 不能为空`
    }
  ]
}
```

可以通过 overrideRules: true 来覆盖自定义组件内置的校验规则

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
    label: "自定义校验",
    // 传入组件属性
    el: {
      placeholder: "请输入内容",
      title: "这是设置了自定义校验的组件"
    },
    overrideRules: true,
    rules: [
      {
        required: true,
        trigger: "blur",
        message: "不能为空！"
      }
    ]
  }
])
</script>
```

### 注意事项

- 自定义组件内部的 `rules` 可以是一个数组，也可以是一个返回数组的函数（接收当前表单项配置作为参数）。
- 可以通过 `overrideRules: true` 来完全覆盖自定义组件内置的校验规则。
