---
map:
  path: /faq/
---

# 常见问题

## 安装与使用

### 如何安装 el-form-renderer-vue3？

```bash
pnpm i el-form-renderer-vue3
# 或
npm install el-form-renderer-vue3
# 或
yarn add el-form-renderer-vue3
```

### 如何在项目中注册组件？

```javascript
import { createApp } from "vue"
import App from "./App.vue"
import elFormRenderer from "el-form-renderer-vue3"

const app = createApp(App)
app.use(elFormRenderer)
app.mount("#app")
```

## 数据绑定

### 为什么 v-model 不生效？

确保使用 `v-model:FormData` 而不是 `v-model`：

```vue
<!-- ❌ 错误 -->
<el-form-renderer v-model="formData" :content="content" />

<!-- ✅ 正确 -->
<el-form-renderer v-model:FormData="formData" :content="content" />
```

### 如何批量更新表单数据？

使用 `updateForm` 方法：

```vue
<template>
  <el-form-renderer ref="formRef" :content="content" v-model:FormData="formData" />
</template>

<script setup>
import { ref } from "vue"

const formRef = ref()

// 批量更新
const updateData = () => {
  formRef.value.updateForm({
    name: "张三",
    age: 25
  })
}
</script>
```

### select 多选时为什么会报错？

当 `select` 的 `multiple` 为 `true` 时，必须初始化为空数组：

```javascript
// ❌ 错误
const formData = reactive({
  region: undefined // 或 null
})

// ✅ 正确
const formData = reactive({
  region: []
})
```

## 表单验证

### 如何添加表单验证规则？

在 `content` 配置中添加 `rules` 属性：

```javascript
const content = [
  {
    type: "input",
    id: "name",
    label: "姓名",
    rules: [
      { required: true, message: "请输入姓名", trigger: "blur" },
      { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
    ]
  }
]
```

### 如何手动触发表单验证？

```vue
<script setup>
const formRef = ref()

const handleValidate = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log("验证通过")
    }
  } catch (error) {
    console.log("验证失败", error)
  }
}
</script>
```

### 如何验证单个字段？

```javascript
// 验证单个字段
formRef.value.validateField("name")

// 验证多个字段
formRef.value.validateField(["name", "age"])
```

### 如何清除验证结果？

```javascript
// 清除所有验证结果
formRef.value.clearValidate()

// 清除指定字段的验证结果
formRef.value.clearValidate(["name", "age"])
```

## 自定义组件

### 如何使用自定义组件？

使用 `component` 属性并配合 `markRaw`：

```vue
<script setup>
import { markRaw } from "vue"
import MyCustomInput from "./MyCustomInput.vue"

const content = [
  {
    id: "custom",
    label: "自定义组件",
    component: markRaw(MyCustomInput),
    el: {
      placeholder: "请输入"
    }
  }
]
</script>
```

### 为什么自定义组件需要使用 markRaw？

Vue 3 的响应式系统会递归地将对象转换为响应式代理。对于组件定义对象，这可能导致性能问题和意外行为。`markRaw` 可以标记一个对象，使其永远不会被转换为响应式代理。

### 自定义组件如何接收和更新值？

自定义组件需要：

1. 接收 `modelValue` prop
2. 触发 `update:modelValue` 事件

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

## 数据格式化

### 如何格式化输入和输出数据？

使用 `inputFormat` 和 `outputFormat`：

```javascript
{
  type: 'date-picker',
  id: 'date',
  label: '日期范围',
  el: {
    type: 'daterange',
    valueFormat: 'YYYY-MM-DD'
  },
  // 将 startDate 和 endDate 转换为数组格式
  inputFormat: (row) => {
    if (row.startDate && row.endDate) {
      return [row.startDate, row.endDate]
    }
  },
  // 将数组格式转换回 startDate 和 endDate
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

### trim 属性的作用是什么？

`trim` 属性用于自动去除输入值的首尾空格，默认为 `true`：

```javascript
{
  type: 'input',
  id: 'name',
  label: '姓名',
  trim: true  // 默认值，会自动去除首尾空格
}
```

## 动态表单

### 如何动态显示/隐藏表单项？

使用 `hidden` 函数：

```javascript
const content = [
  {
    type: "select",
    id: "type",
    label: "类型",
    options: [
      { label: "个人", value: "personal" },
      { label: "企业", value: "company" }
    ]
  },
  {
    type: "input",
    id: "companyName",
    label: "公司名称",
    // 当 type 不是 'company' 时隐藏
    hidden: formValue => formValue.type !== "company"
  }
]
```

### 如何动态更新选项？

使用 `setOptions` 方法：

```vue
<script setup>
const formRef = ref()

const updateOptions = () => {
  formRef.value.setOptions("region", [
    { label: "北京", value: "beijing" },
    { label: "上海", value: "shanghai" }
  ])
}
</script>
```

### 如何实现远程数据加载？

使用 `remote` 配置：

```javascript
{
  type: 'select',
  id: 'city',
  label: '城市',
  remote: {
    url: '/api/cities',
    request: () => axios.get('/api/cities').then(res => res.data),
    dataPath: 'data.list',  // 数据在响应中的路径
    label: 'name',  // 远程数据中作为 label 的字段
    value: 'id',    // 远程数据中作为 value 的字段
    onError: (error) => {
      console.error('加载失败', error)
    }
  }
}
```

## 事件处理

### 如何监听表单项的事件？

使用 `on` 属性：

```javascript
{
  type: 'input',
  id: 'name',
  label: '姓名',
  on: {
    blur: (args, updateForm) => {
      console.log('失去焦点', args)
    },
    focus: (args) => {
      console.log('获得焦点', args)
    },
    change: (args, updateForm) => {
      console.log('值改变', args)
      // 可以使用 updateForm 更新其他字段
      updateForm({ otherField: 'new value' })
    }
  }
}
```

## 插槽使用

### 如何在表单底部添加按钮？

使用默认插槽：

```vue
<template>
  <el-form-renderer :content="content" v-model:FormData="formData">
    <el-button type="primary" @click="handleSubmit">提交</el-button>
    <el-button @click="handleReset">重置</el-button>
  </el-form-renderer>
</template>
```

### 如何在特定表单项前插入内容？

使用具名插槽 `id:xxx`：

```vue
<template>
  <el-form-renderer :content="content" v-model:FormData="formData">
    <template #id:name>
      <div class="tip">请输入您的真实姓名</div>
    </template>
  </el-form-renderer>
</template>
```

## 分组表单

### 如何创建嵌套对象类型的表单？

使用 `type="group"` 和 `items`：

```javascript
const content = [
  {
    type: "group",
    id: "address",
    label: "地址信息",
    items: [
      {
        type: "input",
        id: "province",
        label: "省份"
      },
      {
        type: "input",
        id: "city",
        label: "城市"
      }
    ]
  }
]

// 表单数据结构
const formData = reactive({
  address: {
    province: "",
    city: ""
  }
})
```

## 性能优化

### 大量表单项时如何优化性能？

1. 使用 `markRaw` 标记不需要响应式的数据
2. 避免在 `hidden`、`inputFormat`、`outputFormat` 中进行复杂计算
3. 合理使用 `v-show` 和 `hidden` 函数

### 为什么表单更新很慢？

检查以下几点：

1. 是否有过多的 `watch` 或 `computed`
2. `hidden` 函数是否进行了复杂计算
3. 是否有不必要的深度响应式对象

## 兼容性

### 支持哪些版本的 Vue 和 Element Plus？

- Vue 3.x
- Element Plus 2.x

### 与 Vue 2 版本有什么区别？

主要区别：

1. 使用 `v-model:FormData` 代替 `v-model`
2. 自定义组件需要使用 `markRaw`
3. 使用 Composition API
4. 移除了 `$attrs` 和 `$listeners` 的区别

详见：[vue2 与 vue3 v-model 的区别](https://v3-migration.vuejs.org/zh/breaking-changes/v-model.html)

## 其他问题

### 如何获取表单组件实例？

使用 `getComponentById` 方法：

```javascript
const formRef = ref()

// 获取 id 为 'name' 的组件实例
const nameComponent = formRef.value.getComponentById("name")
```

### 如何设置只读模式？

使用 `readonly` 属性：

```javascript
{
  type: 'input',
  id: 'name',
  label: '姓名',
  readonly: true  // 只读模式
}
```

对于 `input` 类型，会显示文本值；对于 `select` 类型，会显示对应的 label；其他组件等同于 `disabled = true`。

### enableWhen 和 atChange 为什么被标记为废弃？

这些属性在新版本中被更强大的 `hidden` 和 `on` 替代：

- `enableWhen` → 使用 `hidden` 函数
- `atChange` → 使用 `on.change` 事件

### 如何贡献代码或报告问题？

- GitHub: [https://github.com/jiayc4215/form-render](https://github.com/jiayc4215/form-render)
- 技术交流群: 711368818

## 相关资源

- [Element Plus 官方文档](https://element-plus.org/)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [el-form-renderer Vue 2 版本](https://github.com/femessage/el-form-renderer/)
