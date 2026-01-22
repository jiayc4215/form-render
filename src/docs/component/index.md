---
map:
  path: /en/form/component/
---

# component

To meet the needs of locally registered components and using custom components, we have extended the `component` property of the atomic form on top of the original components, which is used to use locally registered and custom components. Note: `component` is suitable for rendering locally registered components and custom components, while `type` is suitable for global components with the `el-` prefix.

<demo src="./component.vue"
title="content"
desc="Custom Component">
</demo>

::: details Semver Input Component: Auto-padding on blur
<<< ../../../src/docs/component/el-semver-input.vue
:::

### Attributes

| Parameter Name         | Description                                                            | Type    | Optional Values | Default Value                                       |
| :--------------------- | :--------------------------------------------------------------------- | :------ | :-------------- | :-------------------------------------------------- |
| modelValue / v-model   | Binding value                                                          | string  | —               | —                                                   |
| preventIllegal         | Whether to prevent illegal character input                             | boolean | —               | true                                                |
| autoPadding            | Whether to automatically complete the version number when losing focus | boolean | —               | true                                                |
| prefix                 | Whether to force adding 'v' prefix                                     | boolean | —               | true                                                |
| validRegular           | Version number validation regex                                        | RegExp  | —               | `/^v?([1-9]\d*\|0)\.([1-9]\d*\|0)\.([1-9]\d*\|0)$/` |
| autoPaddingRegularList | Auto-completion rule list                                              | Array   | —               | Default Rules                                       |

### Events

| Event Name  | Description                              | Callback Parameters |
| :---------- | :--------------------------------------- | :------------------ |
| validChange | Triggered when validation status changes | (isValid: boolean)  |
| input       | Triggered when input value changes       | (value: string)     |
