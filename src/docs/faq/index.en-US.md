---
map:
  path: /faq/
---

# FAQ

## Installation & Usage

### How to install el-form-renderer-vue3?

```bash
pnpm i el-form-renderer-vue3
# or
npm install el-form-renderer-vue3
# or
yarn add el-form-renderer-vue3
```

### How to register the component in a project?

```javascript
import { createApp } from "vue"
import App from "./App.vue"
import elFormRenderer from "el-form-renderer-vue3"

const app = createApp(App)
app.use(elFormRenderer)
app.mount("#app")
```

## Data Binding

### Why is v-model not working?

Make sure to use `v-model:FormData` instead of `v-model`:

```vue
<!-- ❌ Wrong -->
<el-form-renderer v-model="formData" :content="content" />

<!-- ✅ Correct -->
<el-form-renderer v-model:FormData="formData" :content="content" />
```

### How to batch update form data?

Use the `updateForm` method:

```vue
<template>
  <el-form-renderer ref="formRef" :content="content" v-model:FormData="formData" />
</template>

<script setup>
import { ref } from "vue"

const formRef = ref()

// Batch update
const updateData = () => {
  formRef.value.updateForm({
    name: "John",
    age: 25
  })
}
</script>
```

### Why does select with multiple selection throw an error?

When `select`'s `multiple` is `true`, it must be initialized as an empty array:

```javascript
// ❌ Wrong
const formData = reactive({
  region: undefined // or null
})

// ✅ Correct
const formData = reactive({
  region: []
})
```

## Form Validation

### How to add form validation rules?

Add the `rules` property in the `content` configuration:

```javascript
const content = [
  {
    type: "input",
    id: "name",
    label: "Name",
    rules: [
      { required: true, message: "Please enter name", trigger: "blur" },
      { min: 2, max: 10, message: "Length should be 2 to 10 characters", trigger: "blur" }
    ]
  }
]
```

### How to manually trigger form validation?

```vue
<script setup>
const formRef = ref()

const handleValidate = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log("Validation passed")
    }
  } catch (error) {
    console.log("Validation failed", error)
  }
}
</script>
```

### How to validate a single field?

```javascript
// Validate single field
formRef.value.validateField("name")

// Validate multiple fields
formRef.value.validateField(["name", "age"])
```

### How to clear validation results?

```javascript
// Clear all validation results
formRef.value.clearValidate()

// Clear validation results for specific fields
formRef.value.clearValidate(["name", "age"])
```

## Custom Components

### How to use custom components?

Use the `component` property with `markRaw`:

```vue
<script setup>
import { markRaw } from "vue"
import MyCustomInput from "./MyCustomInput.vue"

const content = [
  {
    id: "custom",
    label: "Custom Component",
    component: markRaw(MyCustomInput),
    el: {
      placeholder: "Please enter"
    }
  }
]
</script>
```

### Why do custom components need markRaw?

Vue 3's reactivity system recursively converts objects into reactive proxies. For component definition objects, this can lead to performance issues and unexpected behavior. `markRaw` marks an object so it will never be converted to a reactive proxy.

### How do custom components receive and update values?

Custom components need to:

1. Accept `modelValue` prop
2. Emit `update:modelValue` event

```vue
<!-- MyCustomInput.vue -->
<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script setup>
defineProps({
  modelValue: [String, Number]
})

defineEmits(["update:modelValue"])
</script>
```

## Data Formatting

### How to format input and output data?

Use `inputFormat` and `outputFormat`:

```javascript
{
  type: 'date-picker',
  id: 'date',
  label: 'Date Range',
  el: {
    type: 'daterange',
    valueFormat: 'YYYY-MM-DD'
  },
  // Convert startDate and endDate to array format
  inputFormat: (row) => {
    if (row.startDate && row.endDate) {
      return [row.startDate, row.endDate]
    }
  },
  // Convert array format back to startDate and endDate
  outputFormat: (val) => {
    if (!val) {
      return { startDate: '', endDate: '' }
    }
    return {
      startDate: val[0],
      endDate: val[1]
    }
  }
}
```

### What is the purpose of the trim property?

The `trim` property automatically removes leading and trailing whitespace from input values, default is `true`:

```javascript
{
  type: 'input',
  id: 'name',
  label: 'Name',
  trim: true  // Default value, will automatically trim whitespace
}
```

## Dynamic Forms

### How to dynamically show/hide form items?

Use the `hidden` function:

```javascript
const content = [
  {
    type: "select",
    id: "type",
    label: "Type",
    options: [
      { label: "Personal", value: "personal" },
      { label: "Company", value: "company" }
    ]
  },
  {
    type: "input",
    id: "companyName",
    label: "Company Name",
    // Hide when type is not 'company'
    hidden: formValue => formValue.type !== "company"
  }
]
```

### How to dynamically update options?

Use the `setOptions` method:

```vue
<script setup>
const formRef = ref()

const updateOptions = () => {
  formRef.value.setOptions("region", [
    { label: "Beijing", value: "beijing" },
    { label: "Shanghai", value: "shanghai" }
  ])
}
</script>
```

### How to implement remote data loading?

Use the `remote` configuration:

```javascript
{
  type: 'select',
  id: 'city',
  label: 'City',
  remote: {
    url: '/api/cities',
    request: () => axios.get('/api/cities').then(res => res.data),
    dataPath: 'data.list',  // Path to data in response
    label: 'name',  // Field to use as label in remote data
    value: 'id',    // Field to use as value in remote data
    onError: (error) => {
      console.error('Loading failed', error)
    }
  }
}
```

## Event Handling

### How to listen to form item events?

Use the `on` property:

```javascript
{
  type: 'input',
  id: 'name',
  label: 'Name',
  on: {
    blur: (args, updateForm) => {
      console.log('Blur event', args)
    },
    focus: (args) => {
      console.log('Focus event', args)
    },
    change: (args, updateForm) => {
      console.log('Change event', args)
      // Can use updateForm to update other fields
      updateForm({ otherField: 'new value' })
    }
  }
}
```

## Slot Usage

### How to add buttons at the bottom of the form?

Use the default slot:

```vue
<template>
  <el-form-renderer :content="content" v-model:FormData="formData">
    <el-button type="primary" @click="handleSubmit">Submit</el-button>
    <el-button @click="handleReset">Reset</el-button>
  </el-form-renderer>
</template>
```

### How to insert content before a specific form item?

Use named slot `id:xxx`:

```vue
<template>
  <el-form-renderer :content="content" v-model:FormData="formData">
    <template #id:name>
      <div class="tip">Please enter your real name</div>
    </template>
  </el-form-renderer>
</template>
```

## Grouped Forms

### How to create nested object type forms?

Use `type="group"` with `items`:

```javascript
const content = [
  {
    type: "group",
    id: "address",
    label: "Address Information",
    items: [
      {
        type: "input",
        id: "province",
        label: "Province"
      },
      {
        type: "input",
        id: "city",
        label: "City"
      }
    ]
  }
]

// Form data structure
const formData = reactive({
  address: {
    province: "",
    city: ""
  }
})
```

## Performance Optimization

### How to optimize performance with many form items?

1. Use `markRaw` to mark data that doesn't need to be reactive
2. Avoid complex calculations in `hidden`, `inputFormat`, `outputFormat`
3. Use `v-show` and `hidden` function appropriately

### Why is form update slow?

Check the following:

1. Are there too many `watch` or `computed` properties
2. Does the `hidden` function perform complex calculations
3. Are there unnecessary deep reactive objects

## Compatibility

### Which versions of Vue and Element Plus are supported?

- Vue 3.x
- Element Plus 2.x

### What are the differences from the Vue 2 version?

Main differences:

1. Use `v-model:FormData` instead of `v-model`
2. Custom components need to use `markRaw`
3. Use Composition API
4. Removed the distinction between `$attrs` and `$listeners`

See: [Difference between vue2 and vue3 v-model](https://v3-migration.vuejs.org/zh/breaking-changes/v-model.html)

## Other Issues

### How to get form component instance?

Use the `getComponentById` method:

```javascript
const formRef = ref()

// Get component instance with id 'name'
const nameComponent = formRef.value.getComponentById("name")
```

### How to set read-only mode?

Use the `readonly` property:

```javascript
{
  type: 'input',
  id: 'name',
  label: 'Name',
  readonly: true  // Read-only mode
}
```

For `input` type, it displays text value; for `select` type, it displays the corresponding label; for other components, it's equivalent to `disabled = true`.

### Why are enableWhen and atChange marked as deprecated?

These properties have been replaced by more powerful `hidden` and `on` in the new version:

- `enableWhen` → Use `hidden` function
- `atChange` → Use `on.change` event

### How to contribute code or report issues?

- GitHub: [https://github.com/jiayc4215/form-render](https://github.com/jiayc4215/form-render)
- Technical Exchange Group: 711368818

## Related Resources

- [Element Plus Official Documentation](https://element-plus.org/)
- [Vue 3 Official Documentation](https://vuejs.org/)
- [el-form-renderer Vue 2 Version](https://github.com/femessage/el-form-renderer/)
