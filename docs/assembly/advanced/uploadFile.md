# basic

<script setup>
import CustomComponent from '../../../src/view/uploadFile.vue'
</script>
<br/>
<CustomComponent />

## 父组件代码

- action:上传地址
- limit: 最大上传的个数

::: details 查看源代码

<<< ../../../src/view/uploadFile.vue

:::

## 上传组件代码

```ts
测试用例不可以上传; 请将 action 替换为上传地址；该上传为手动上传点击提交后上传
```

- action：提交地址
- on-preview 点击文件列表中已上传的文件时的钩子
- name: 上传的文件字段名
- limit：最大允许上传个数
- data： 上传时附带的额外参数
- accept 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
- on-error：文件上传失败时的钩子
- on-exceed：文件超出个数限制时的钩子
- on-success：文件上传成功时的钩子
- before-upload：上传文件之前的钩子
- on-change 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
- on-remove 文件列表移除文件时的钩子
- file-list 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
- headers 设置上传的请求头部
- auto-upload 是否自动上传文件

::: details 查看源代码

<<< ../../../src/view/components/ManualUpload.vue

:::
