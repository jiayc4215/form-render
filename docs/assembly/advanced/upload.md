# basic

<script setup>
import CustomComponent from '../../../src/view/upload.vue'
</script>
<br/>
<CustomComponent />

## 父组件代码

- isShowTip:是否展示提示
- limit: 最大上传的个数
- extralData: 附加参数

::: details 查看源代码

<<< ../../../src/view/upload.vue

:::

## 上传组件代码

```ts
测试用例不可以上传; 请将 action 替换为上传地址； 或者点击设置图片地址查看效果
```

- disabled：禁用
- multiple：支持多选
- action：提交地址
- list-type：文件列表的类型 （text/picture/picture-card）、
- on-success：文件上传成功时的钩子
- before-upload：上传文件之前的钩子
- limit：最大允许上传个数
- on-error：文件上传失败时的钩子
- on-exceed：文件超出个数限制时的钩子
- data： 上传时附带的额外参数
- on-remove 文件列表移除文件时的钩子
- show-file-list 是否显示已上传文件列表
- headers 设置上传的请求头部
- file-list 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
- on-preview 点击文件列表中已上传的文件时的钩子

::: details 查看源代码

<<< ../../../src/view/components/ImageUpload.vue

:::
