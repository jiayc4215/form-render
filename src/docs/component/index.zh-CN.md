---
map:
  path: /form/component/
---

# component

为了满足局部注册组件和使用自定义组件的需求，我们在原有组件的基础上拓展了原子表单的component属性，用于使用局部注册和自定义的组件。 注意： component适用于渲染局部注册组件和自定义组件，而type适用于带el-前缀的全局组件

<demo src="./component.vue"
title="content"
desc="自定义组件">
</demo>

::: details 语义版本输入组件：失去焦点时自动填充
<<< ../../../src/docs/component/el-semver-input.vue
:::

### Attributes

| 参数名                 | 说明                         | 类型    | 可选值 | 默认值                                              |
| :--------------------- | :--------------------------- | :------ | :----- | :-------------------------------------------------- |
| modelValue / v-model   | 绑定值                       | string  | —      | —                                                   |
| preventIllegal         | 是否阻止非法字符输入         | boolean | —      | true                                                |
| autoPadding            | 失去焦点时是否自动补全版本号 | boolean | —      | true                                                |
| prefix                 | 是否强制添加 'v' 前缀        | boolean | —      | true                                                |
| validRegular           | 版本号校验正则               | RegExp  | —      | `/^v?([1-9]\d*\|0)\.([1-9]\d*\|0)\.([1-9]\d*\|0)$/` |
| autoPaddingRegularList | 自动补全规则列表             | Array   | —      | Default Rules                                       |

### Events

| 事件名      | 说明               | 回调参数           |
| :---------- | :----------------- | :----------------- |
| validChange | 校验状态变化时触发 | (isValid: boolean) |
| input       | 输入框值变化时触发 | (value: string)    |
