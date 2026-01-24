---
map:
  path: /api/
---

# API Documentation

## Component Props

### el-form-renderer

The `el-form-renderer` component supports all [el-form attributes](https://element-plus.org/en-US/component/form.html#form-attributes) and extends with the following:

| Prop               | Description                                                             | Type        | Default |
| ------------------ | ----------------------------------------------------------------------- | ----------- | ------- |
| content            | Form item configuration array, each item represents an atomic form item | `Content[]` | -       |
| disabled           | Disable all form items                                                  | `boolean`   | `false` |
| FormData (v-model) | Form data object                                                        | `object`    | -       |

## Content Configuration

Configuration object for each form item, supports the following properties:

### Basic Properties

| Property | Description                                                         | Type     | Required | Default |
| -------- | ------------------------------------------------------------------- | -------- | -------- | ------- |
| id       | Unique identifier for the form item, used to store the value        | `string` | Yes      | -       |
| type     | Form component type, such as `input`, `select`, `date-picker`, etc. | `string` | Yes      | -       |
| label    | Form item label text                                                | `string` | No       | -       |
| default  | Default value                                                       | `any`    | No       | -       |

### Component Configuration

| Property  | Description                                                                     | Type            | Default |
| --------- | ------------------------------------------------------------------------------- | --------------- | ------- |
| el        | Properties of the specific form component, such as `placeholder` for `el-input` | `object`        | -       |
| attrs     | Native HTML attributes                                                          | `object`        | -       |
| component | Custom component for rendering locally registered components                    | `Vue Component` | -       |

### Options Configuration

| Property | Description                                      | Type                                  | Default |
| -------- | ------------------------------------------------ | ------------------------------------- | ------- |
| options  | Options configuration for select-type components | `Array<{label: string, value?: any}>` | -       |
| remote   | Remote data configuration                        | `RemoteConfig`                        | -       |

### Display Control

| Property | Description                                         | Type                                            | Default |
| -------- | --------------------------------------------------- | ----------------------------------------------- | ------- |
| hidden   | Function to control whether the form item is hidden | `(formValue: Object, item: Content) => boolean` | -       |
| readonly | Read-only mode                                      | `boolean`                                       | `false` |
| disabled | Disabled state                                      | `boolean`                                       | `false` |

### Data Processing

| Property     | Description                                                             | Type                | Default |
| ------------ | ----------------------------------------------------------------------- | ------------------- | ------- |
| inputFormat  | Function to process input values, used to format incoming data          | `(obj: any) => any` | -       |
| outputFormat | Function to process output values, used to format component return data | `(val: any) => any` | -       |
| trim         | Whether to automatically trim whitespace on change event                | `boolean`           | `true`  |

### Validation Rules

| Property      | Description                                                        | Type              | Default |
| ------------- | ------------------------------------------------------------------ | ----------------- | ------- |
| rules         | Form validation rules, same as el-form-item's rules                | `object \| array` | -       |
| overrideRules | Whether to override built-in validation rules in custom components | `boolean`         | `false` |

### Event Listeners

| Property | Description                                      | Type                                                                   |
| -------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| on       | Listen to events emitted by form item components | `{ [eventName: string]: (args: any[], updateForm: function) => void }` |

### Group Configuration

| Property | Description                                        | Type        |
| -------- | -------------------------------------------------- | ----------- |
| items    | Used when `type="group"`, defines child form items | `Content[]` |

## Remote Configuration

Remote data configuration object for dynamically loading form item data:

| Property   | Description                                                                      | Type                     | Default                                              |
| ---------- | -------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------- |
| url        | Remote API address                                                               | `string`                 | -                                                    |
| prop       | Property name to inject                                                          | `string`                 | `'options'`                                          |
| request    | Custom request method                                                            | `() => Promise`          | `() => this.$axios.get(url).then(resp => resp.data)` |
| dataPath   | Data path in response body                                                       | `string`                 | `''`                                                 |
| onResponse | Function to process response data                                                | `(resp: any) => any`     | -                                                    |
| onError    | Function to handle request errors                                                | `(error: Error) => void` | `error => console.error(error.message)`              |
| label      | Key name for label in remote data (only for select, radio-group, checkbox-group) | `string`                 | `'label'`                                            |
| value      | Key name for value in remote data (only for select, radio-group, checkbox-group) | `string`                 | `'value'`                                            |

## Component Methods

`el-form-renderer` supports all [el-form methods](https://element-plus.org/en-US/component/form.html#form-methods):

| Method        | Description                    | Parameters                                                                                              |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| validate      | Validate the entire form       | `(callback?: (valid: boolean, fields?: object) => void) => Promise<boolean>`                            |
| validateField | Validate specific form fields  | `(props: string \| string[], callback?: (valid: boolean, fields?: object) => void) => Promise<boolean>` |
| resetFields   | Reset form fields              | `(props?: string \| string[]) => void`                                                                  |
| scrollToField | Scroll to specified form field | `(prop: string) => void`                                                                                |
| clearValidate | Clear validation results       | `(props?: string \| string[]) => void`                                                                  |

### Extended Methods

| Method           | Description                                        | Parameters                             |
| ---------------- | -------------------------------------------------- | -------------------------------------- |
| updateForm       | Batch update form data                             | `(data: object) => void`               |
| setOptions       | Dynamically set options for select-type components | `(id: string, options: Array) => void` |
| getFormValue     | Get form data                                      | `() => object`                         |
| getComponentById | Get form item component instance by id             | `(id: string) => ComponentInstance`    |

## Component Slots

| Slot Name | Description                                         |
| --------- | --------------------------------------------------- |
| default   | Content inserted at the bottom of the form          |
| id:xxx    | Content inserted before the form item with id 'xxx' |

## Type Definitions

### Content Interface

```typescript
interface Content {
  // Required properties
  id: string
  type: string

  // Optional basic properties
  label?: string
  default?: any
  readonly?: boolean
  disabled?: boolean

  // Group related
  items?: Content[]

  // Options configuration
  options?: Array<{ label: string; value?: any }>
  remote?: RemoteConfig

  // Display control
  hidden?: (formValue: Object, item: Content) => boolean

  // HTML and component properties
  attrs?: object
  el?: object
  component?: Vue

  // Data processing
  inputFormat?: (obj: any) => any
  outputFormat?: (val: any) => any
  trim?: boolean

  // Validation
  rules?: object | array
  overrideRules?: boolean

  // Events
  on?: {
    [eventName: string]: (args: any[], updateForm: function) => void
  }

  // Deprecated
  enableWhen?: object | string
  atChange?: (id: string, value: any) => void
}
```

### RemoteConfig Interface

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

## Supported Form Component Types

Common `type` values:

- `input` - Input
- `textarea` - Textarea
- `select` - Select
- `radio-group` - Radio Group
- `radio-button` - Radio Button Group
- `checkbox-group` - Checkbox Group
- `checkbox-button` - Checkbox Button Group
- `switch` - Switch
- `date-picker` - Date Picker
- `time-picker` - Time Picker
- `time-select` - Time Select
- `cascader` - Cascader
- `input-number` - Input Number
- `rate` - Rate
- `color-picker` - Color Picker
- `slider` - Slider
- `group` - Group (for creating nested objects)

## Examples

### Basic Usage

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
    label: "Name",
    rules: [{ required: true, message: "Please enter name" }]
  },
  {
    type: "input-number",
    id: "age",
    label: "Age",
    el: { min: 0, max: 150 }
  }
]
</script>
```

### Using Methods

```vue
<template>
  <el-form-renderer ref="formRef" :content="content" v-model:FormData="formData">
    <el-button @click="handleSubmit">Submit</el-button>
    <el-button @click="handleReset">Reset</el-button>
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
    label: "Name",
    rules: [{ required: true, message: "Please enter name" }]
  }
]

const handleSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    console.log("Form data:", formData)
  }
}

const handleReset = () => {
  formRef.value.resetFields()
}
</script>
```
