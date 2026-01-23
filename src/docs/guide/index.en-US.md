---
map:
  path: /guide/
---

## Technical Exchange Group 711368818

<img src="/qq.jpg"  width="200" />

## Remaining Issues: To be solved

select must initialize an empty array when multiple is true (in elementplus v-model, initializing with undefined will trigger validation if updated to empty array)

## Introduction

### WHAT

form-renderer is based on element-plus, but not limited to element-plus components. On the basis of fully inheriting the form attributes of element-plus elements, expansions are made. Some non-form components or custom components, therefore, can be used by users to present a complete form using a piece of json.

### WHY

In our daily development, there are many pages with forms. Usually the form structure is similar and the logic is repeated. el form renderer has no complex logic. It only converts JSON to render form items, saving time and energy in writing business logic and reducing repeated code.

## Features

- Render form with json
- Support integration with custom components
- Support `updateForm` method to batch update form data
- Support `setOptions` method to dynamically change select options
- Content supports `inputFormat`, `outputFormat`, `trim` to handle component input and output values
- Support `v-model`

## Links

- [$attrs and $listeners (vue2&&vue3)](https://blog.csdn.net/qq_63358859/article/details/133699476?spm=1001.2014.3001.5501)
- [vue2 and vue3 functional components](https://blog.csdn.net/qq_63358859/article/details/133635120?spm=1001.2014.3001.5501)
- [Difference between vue 2 and vue3 template ref](https://blog.csdn.net/qq_63358859/article/details/133532229?spm=1001.2014.3001.5501)
- [Difference between vue2 and vue3 v-model](https://blog.csdn.net/qq_63358859/article/details/133484380?spm=1001.2014.3001.5501)
- [vue2 version](https://blog.csdn.net/qq_63358859/article/details/130442636?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169684271816800180612618%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=169684271816800180612618&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-7-130442636-null-null.nonecase&utm_term=render&spm=1018.2226.3001.4450)
- [Chinese Documentation](https://form-renderv3.netlify.app/)
- [element-plus table wrapper](https://gitee.com/childe-jia/table-vue3)

## Quick Start

```ts
pnpm i el-form-renderer-vue3
```

```ts
import elFormRenderer from "el-form-renderer-vue3"
app.use(elFormRenderer)
```

```vue
<template>
  <el-form-renderer label-width="100px" :content="content" v-model:FormData="FormData" ref="form">
    <el-button @click="resetForm">reset</el-button>
    <el-button @click="setValue">Set name to Xiao Ming</el-button>
    <pre>{{ FormData }}</pre>
  </el-form-renderer>
</template>

<script setup>
import { reactive, ref } from "vue"

const form = ref()
let FormData = reactive({
  name: "",
  type: [],
  startDate: "2019-01-01",
  endDate: "2019-01-02",
  region: [],
  date: ["2019-01-01", "2019-01-02"]
})
const content = reactive([
  {
    type: "input",
    id: "name",
    label: "name",
    attrs: { "data-name": "form1" },
    el: {
      size: "default",
      placeholder: "test placeholder"
    },
    rules: [
      { required: true, message: "miss name", trigger: "blur" },
      { min: 3, max: 5, message: "length between 3 to 5", trigger: "blur" }
    ]
  },
  {
    type: "select",
    id: "region",
    label: "region",
    options: [
      {
        label: "shanghai",
        value: "shanghai"
      },
      {
        label: "beijing",
        value: "beijing"
      },
      {
        label: "guangzhou",
        value: "guangzhou"
      }
    ],
    el: { filterable: true, multiple: true, multipleLimit: 2 },
    rules: [{ required: true, message: "miss area", trigger: "change" }]
  },
  {
    type: "date-picker",
    id: "date",
    label: "date",
    el: {
      type: "daterange",
      valueFormat: "YYYY-MM-DD"
    },
    rules: [{ required: true, message: "miss date", trigger: "change" }],
    inputFormat: row => {
      if (row.startDate && row.endDate) {
        return [row.startDate, row.endDate]
      }
    },
    outputFormat: val => {
      if (!val) {
        return { startDate: "", endDate: "" }
      }
      return {
        startDate: val[0],
        endDate: val[1]
      }
    }
  },
  {
    type: "switch",
    id: "delivery",
    label: "delivery"
  },
  {
    type: "checkbox-group",
    id: "type",
    label: "type",
    default: [],
    options: [
      {
        label: "typeA"
      },
      {
        label: "typeB"
      },
      {
        label: "typeC"
      }
    ],
    rules: [{ type: "array", required: true, message: "miss type", trigger: "change" }]
  },
  {
    type: "radio-group",
    id: "resource",
    label: "resource",
    options: [
      {
        label: "resourceA",
        value: "A"
      },
      {
        label: "resourceB",
        value: "B"
      }
    ],
    rules: [{ required: true, message: "miss resource", trigger: "change" }]
  },
  {
    type: "input",
    id: "desc",
    label: "desc",
    el: {
      type: "textarea"
    },
    rules: [{ required: true, message: "miss desc", trigger: "blur" }]
  }
])
const resetForm = () => {
  form.value.resetFields()
}
const setValue = () => {
  FormData.name = "小明"
}
</script>
```

## Props

```ts
export default {
  // ...
  props: {
    /**
     * support all el-form's props
     * @see: https://element.eleme.io/#/zh-CN/component/form#form-attributes
     */

    /**
     * 表单项的配置数组，每个表单项代表一个原子表单项
     * the form config's array, each item represents a form-item
     */
    content: {
      type: Array, // type：Content[], check Content's definition below
      required: true
    },

    /**
     * disable all form-items
     */
    disabled: {
      type: Boolean,
      default: false
    }
  }
}

/**
 * 表单项的typescript定义
 * 支持所有el-form-item's props。表单项组件本身的props定义在el上
 * definition of form-item written in typescript.
 * support all el-form-item's props. The component's props need to be set at prop el
 */
interface Content {
  // 每一个原子都存在 id，用于存储该原子的值，不能重复
  // key of form-item value in form value. Must be unique
  id: string

  /**
   * 可以是element提供的所有表单组件类型，如传入'input'，则渲染出'el-input'
   * 当type="group"时，可以创造复杂对象类型的表单数据，配合items使用。此时getFormValue()返回的是对象类型的数据，对象的每个属性对应items里的每一项
   * support all element's form component, e.g., type 'input' will render as 'el-input'.
   * you can create nested form value with type 'group' and use items to define that form value's shape. The type of this form value will be 'object'
   */
  type: string

  /**
   * 当type="group"时使用
   * items内依然遵循同一层级的id不重复的原则
   * using with type 'group'
   * the `id` in each item of items must be unique
   */
  items: Content[]

  /**
   * 默认值
   * FIXME: 别用关键字做 key
   */
  default?: any

  /**
   * 当 type === 'input' 时展示文本值
   * 当 type === 'select' 时展示对应 label
   * 对于其他组件等同于 disabled = true
   */
  readonly = false

  /**
   * @deprecated
   */
  enableWhen?: object | string

  /**
   * 传入一个方法，并返回 boolean，返回 true 时则隐藏该表单项
   * formValue 为当前 form 的值，item 为当前表单项的定义
   * hide the form-item when return true
   * formValue is same as what getFormValue returns, and item is the config of this form-item
   */
  hidden?: (formValue: Object, item: Content) => boolean

  /**
   * 具有选择功能的原子表单可用此定义可选项
   * use with type: select, radio-group, radio-button, checkbox-group, checkbox-button
   */
  options?: {label: string; value?: any}[]

  /**
   * 配置remote.url，即可远程配置组件的某个prop！
   * remote接受以下属性：
   * url: 远程接口的地址
   * prop: 要注入的 prop 的名称，默认为 options
   * request: 可选，请求方法
   * dataPath: 可选，data在响应体中的路径
   * onResponse: 可选，处理请求回来的数据
   * onError: 可选，处理请求出错的情况
   * 另外，针对 select、radio-group、checkbox-group，远程数据能自动映射成 el-option 选项！以下属性仅在此情况使用
   * label: 可选，可直接配置远程数据中用作 label 的key
   * value: 可选，可直接配置远程数据中用作 value 的key
   * @see https://zhuanlan.zhihu.com/p/97827063
   *
   * use remote to set one prop! remote accept following props:
   * url: remote api address
   * prop: prop name that data inject
   * request: optional, customize how to get your options
   * dataPath: optional, data's path in response
   * onResponse: optional, deal with your response
   * onError: optional, deal with request error
   * and, we treat select、radio-group、checkbox-group specially and the resp will be map as an el-option's group! following props only suitable for this case
   * label: optional, label key in resp
   * value: optional, value key in resp
   */
  remote?: {
    url: string
    request = () => this.$axios.get(url).then(resp => resp.data)
    prop = 'options'
    dataPath = ''
    onResponse = resp => {
      if (dataPath) resp = _get(resp, dataPath)
      switch (this.data.type) {
        case 'select':
        case 'checkbox-group':
        case 'radio-group':
        case 'radio-button':
        case 'checkbox-button':
          return resp.map(item => ({
            label: item[label],
            value: item[value]
          }))
        default:
          return resp
      }
    }
    onError = error => console.error(error.message)
    label = 'label'
    value = 'value'
  }

  attrs?: object // html attributes
  /**
   * 用于定义具体原子表单（如el-input）的属性，比如定义el-input的placeholder
   * use to define props of the actual component of this form-item, such as placeholder of el-input
   */
  el?: object

  /**
   * 使用自定义组件
   * component适用于渲染局部注册组件和自定义组件，而type适用于带el-前缀的全局组件
   * custom component
   * use it when element's form components are not enough
   */
  component?: Vue

  /**
   * 是否覆盖自定义组件内置的校验规则
   * `true` 为覆盖， 默认为 `false`
   * whether to override the validation rules written in custom components
   * `true` to override, default `false`
   */
  overrideRules: boolean

  label?: string //set el-form-item's label
  trim = true // trim value at change event

  // 用于处理输入值，输入的值包括：1. default；2. v-model；3. updateForm。参数为整个表单的值对象或 updateForm 传入的对象
  // 如果 inputFormat 返回 undefined，则不会更新此表单项
  // obj is param you passed to updateForm. You can use this function to hijack this process and customize the form value
  inputFormat?: (obj: any) => any

  // 用于处理输出值，参数为对应组件返回值
  // 如果处理后的值是对象类型，会覆盖（Object.assign）到整个表单的值上
  // used to hijack the getFormValue's process and customize the return value
  outputFormat?: (val: any) => any

  // set el-form-item's rules
  rules?: object

  // @deprecated
  atChange?: (id: string, value: any) => void

  /**
   * 监听表单项发出的事件
   * listen to any events emitted by component of form item
   * @param {any[]} args - what that event emits
   * @param {function} updateForm - same as updateForm
   */
  on?: {
    [eventName: string]: (args: any[], updateForm: function) => void
  }
}

/**
 * a tour of typescript
 */
interface obj {
  a: string // type string
  b?: string // type string, optional
  c = true // type boolean, optional, default true
  d: string[] // type array, each item must be string
  e: any // could be any valid js type
  f: (a: number) => void // type function, which receives a param 'a' as number and return nothing
  h: Vue // instance of Vue
  i: {[a: string]: number} // type object, whose key is type string, and value is type number
}
```

## Methods

support all [el-form's methods](https://element.eleme.io/#/zh-CN/component/form#form-methods)

## Slots

| Slot     | Description                                 |
| -------- | ------------------------------------------- |
| default  | insert at bottom                            |
| id:hello | insert before form-item whose id is 'hello' |

## Inspiration

thanks to [el-form-renderer](https://github.com/femessage/el-form-renderer/)
