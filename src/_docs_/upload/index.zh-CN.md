---
map:
  path: /form/upload/
---

# 图片上传

本文将介绍如何在 el-form-renderer 中接入图片上传组件。

## 父组件配置

在父组件中，我们需要通过 `component` 属性引入 `ImageUpload` 组件，并通过 `el` 属性传递配置。

- **isShowTip**: 是否展示提示
- **limit**: 最大上传的个数
- **extralData**: 附加参数

## 上传组件属性

`ImageUpload` 组件支持以下属性（通过 `el` 传递）：

- **disabled**：禁用
- **multiple**：支持多选
- **action**：提交地址
- **list-type**：文件列表的类型 （text/picture/picture-card）
- **on-success**：文件上传成功时的钩子
- **before-upload**：上传文件之前的钩子
- **limit**：最大允许上传个数
- **on-error**：文件上传失败时的钩子
- **on-exceed**：文件超出个数限制时的钩子
- **data**：上传时附带的额外参数
- **on-remove**：文件列表移除文件时的钩子
- **show-file-list**：是否显示已上传文件列表
- **headers**：设置上传的请求头部
- **file-list**：上传的文件列表, 例如: `[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]`
- **on-preview**：点击文件列表中已上传的文件时的钩子

## 示例

> 测试用例不可以上传; 请将 action 替换为上传地址； 或者点击设置图片地址查看效果

<demo src="./upload.vue"
title="图片上传示例"
desc="展示了如何配置和使用自定义图片上传组件">
</demo>
