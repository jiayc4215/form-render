---
map:
  path: /api/
---

# API 文档

## 组件 Props

### el-form-renderer

`el-form-renderer` 组件支持所有 [el-form 的属性](https://element-plus.org/zh-CN/component/form.html#form-attributes)，并扩展了以下属性：

| 属性名             | 说明                                           | 类型        | 默认值  |
| ------------------ | ---------------------------------------------- | ----------- | ------- |
| content            | 表单项的配置数组，每个表单项代表一个原子表单项 | `Content[]` | -       |
| disabled           | 禁用所有表单项                                 | `boolean`   | `false` |
| FormData (v-model) | 表单数据对象                                   | `object`    | -       |

## Content 配置项

每个表单项的配置对象，支持以下属性：

### 基础属性

| 属性名  | 说明                                                 | 类型     | 是否必填 | 默认值 |
| ------- | ---------------------------------------------------- | -------- | -------- | ------ |
| id      | 表单项的唯一标识，用于存储该表单项的值               | `string` | 是       | -      |
| type    | 表单组件类型，如 `input`、`select`、`date-picker` 等 | `string` | 是       | -      |
| label   | 表单项标签文本                                       | `string` | 否       | -      |
| default | 默认值                                               | `any`    | 否       | -      |

### 组件配置

| 属性名    | 说明                                                   | 类型            | 默认值 |
| --------- | ------------------------------------------------------ | --------------- | ------ |
| el        | 定义具体表单组件的属性，如 `el-input` 的 `placeholder` | `object`        | -      |
| attrs     | HTML 原生属性                                          | `object`        | -      |
| component | 自定义组件，用于渲染局部注册组件                       | `Vue Component` | -      |

### 选项配置

| 属性名  | 说明                   | 类型                                  | 默认值 |
| ------- | ---------------------- | ------------------------------------- | ------ |
| options | 选择类组件的可选项配置 | `Array<{label: string, value?: any}>` | -      |
| remote  | 远程数据配置           | `RemoteConfig`                        | -      |

### 显示控制

| 属性名   | 说明                     | 类型                                            | 默认值  |
| -------- | ------------------------ | ----------------------------------------------- | ------- |
| hidden   | 控制表单项是否隐藏的函数 | `(formValue: Object, item: Content) => boolean` | -       |
| readonly | 只读模式                 | `boolean`                                       | `false` |
| disabled | 禁用状态                 | `boolean`                                       | `false` |

### 数据处理

| 属性名       | 说明                                       | 类型                | 默认值 |
| ------------ | ------------------------------------------ | ------------------- | ------ |
| inputFormat  | 处理输入值的函数，用于格式化传入的数据     | `(obj: any) => any` | -      |
| outputFormat | 处理输出值的函数，用于格式化组件返回的数据 | `(val: any) => any` | -      |
| trim         | 是否在 change 事件时自动去除首尾空格       | `boolean`           | `true` |

### 校验规则

| 属性名        | 说明                                   | 类型              | 默认值  |
| ------------- | -------------------------------------- | ----------------- | ------- |
| rules         | 表单验证规则，同 el-form-item 的 rules | `object \| array` | -       |
| overrideRules | 是否覆盖自定义组件内置的校验规则       | `boolean`         | `false` |

### 事件监听

| 属性名 | 说明                     | 类型                                                                   |
| ------ | ------------------------ | ---------------------------------------------------------------------- |
| on     | 监听表单项组件发出的事件 | `{ [eventName: string]: (args: any[], updateForm: function) => void }` |

### 分组配置

| 属性名 | 说明                                   | 类型        |
| ------ | -------------------------------------- | ----------- |
| items  | 当 `type="group"` 时使用，定义子表单项 | `Content[]` |

## Remote 配置

远程数据配置对象，用于动态加载表单项的数据：

| 属性名     | 说明                                                                      | 类型                     | 默认值                                               |
| ---------- | ------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------- |
| url        | 远程接口地址                                                              | `string`                 | -                                                    |
| prop       | 要注入的属性名称                                                          | `string`                 | `'options'`                                          |
| request    | 自定义请求方法                                                            | `() => Promise`          | `() => this.$axios.get(url).then(resp => resp.data)` |
| dataPath   | 数据在响应体中的路径                                                      | `string`                 | `''`                                                 |
| onResponse | 处理响应数据的函数                                                        | `(resp: any) => any`     | -                                                    |
| onError    | 处理请求错误的函数                                                        | `(error: Error) => void` | `error => console.error(error.message)`              |
| label      | 远程数据中用作 label 的键名（仅用于 select、radio-group、checkbox-group） | `string`                 | `'label'`                                            |
| value      | 远程数据中用作 value 的键名（仅用于 select、radio-group、checkbox-group） | `string`                 | `'value'`                                            |

## 组件方法

`el-form-renderer` 支持所有 [el-form 的方法](https://element-plus.org/zh-CN/component/form.html#form-methods)：

| 方法名        | 说明                   | 参数                                                                                                    |
| ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| validate      | 对整个表单进行校验     | `(callback?: (valid: boolean, fields?: object) => void) => Promise<boolean>`                            |
| validateField | 对部分表单字段进行校验 | `(props: string \| string[], callback?: (valid: boolean, fields?: object) => void) => Promise<boolean>` |
| resetFields   | 重置表单项             | `(props?: string \| string[]) => void`                                                                  |
| scrollToField | 滚动到指定表单字段     | `(prop: string) => void`                                                                                |
| clearValidate | 清除校验结果           | `(props?: string \| string[]) => void`                                                                  |

### 扩展方法

| 方法名           | 说明                       | 参数                                   |
| ---------------- | -------------------------- | -------------------------------------- |
| updateForm       | 批量更新表单数据           | `(data: object) => void`               |
| setOptions       | 动态设置选择类组件的选项   | `(id: string, options: Array) => void` |
| getFormValue     | 获取表单数据               | `() => object`                         |
| getComponentById | 根据 id 获取表单项组件实例 | `(id: string) => ComponentInstance`    |

## 组件插槽

| 插槽名  | 说明                                |
| ------- | ----------------------------------- |
| default | 插入到表单底部的内容                |
| id:xxx  | 插入到 id 为 xxx 的表单项之前的内容 |

## 类型定义

### Content 接口

```typescript
interface Content {
  // 必填属性
  id: string
  type: string

  // 可选基础属性
  label?: string
  default?: any
  readonly?: boolean
  disabled?: boolean

  // 分组相关
  items?: Content[]

  // 选项配置
  options?: Array<{ label: string; value?: any }>
  remote?: RemoteConfig

  // 显示控制
  hidden?: (formValue: Object, item: Content) => boolean

  // HTML 和组件属性
  attrs?: object
  el?: object
  component?: Vue

  // 数据处理
  inputFormat?: (obj: any) => any
  outputFormat?: (val: any) => any
  trim?: boolean

  // 校验
  rules?: object | array
  overrideRules?: boolean

  // 事件
  on?: {
    [eventName: string]: (args: any[], updateForm: function) => void
  }

  // 已废弃
  enableWhen?: object | string
  atChange?: (id: string, value: any) => void
}
```

### RemoteConfig 接口

```typescript
interface RemoteConfig {
  url: string
  prop?: string
  request?: () => Promise<any>
  dataPath?: string
  onResponse?: (resp: any) => any
  onError?: (error: Error) => void
  label?: string
  value?: string
}
```

## 支持的表单组件类型

以下是常用的 `type` 值：

- `input` - 输入框
- `textarea` - 文本域
- `select` - 选择器
- `radio-group` - 单选框组
- `radio-button` - 单选按钮组
- `checkbox-group` - 多选框组
- `checkbox-button` - 多选按钮组
- `switch` - 开关
- `date-picker` - 日期选择器
- `time-picker` - 时间选择器
- `time-select` - 时间选择
- `cascader` - 级联选择器
- `input-number` - 计数器
- `rate` - 评分
- `color-picker` - 颜色选择器
- `slider` - 滑块
- `group` - 分组（用于创建嵌套对象）

## 示例

### 基础用法

```vue
<template>
  <el-form-renderer :content="content" v-model:FormData="formData" label-width="100px" />
</template>

<script setup>
import { reactive } from "vue"

const formData = reactive({
  name: "",
  age: 0
})

const content = [
  {
    type: "input",
    id: "name",
    label: "姓名",
    rules: [{ required: true, message: "请输入姓名" }]
  },
  {
    type: "input-number",
    id: "age",
    label: "年龄",
    el: { min: 0, max: 150 }
  }
]
</script>
```

### 使用方法

```vue
<template>
  <el-form-renderer ref="formRef" :content="content" v-model:FormData="formData">
    <el-button @click="handleSubmit">提交</el-button>
    <el-button @click="handleReset">重置</el-button>
  </el-form-renderer>
</template>

<script setup>
import { ref, reactive } from "vue"

const formRef = ref()
const formData = reactive({ name: "" })
const content = [
  {
    type: "input",
    id: "name",
    label: "姓名",
    rules: [{ required: true, message: "请输入姓名" }]
  }
]

const handleSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    console.log("表单数据:", formData)
  }
}

const handleReset = () => {
  formRef.value.resetFields()
}
</script>
```
