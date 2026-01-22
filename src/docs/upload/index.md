---
map:
  path: /en/form/upload/
---

# Image Upload

This article describes how to integrate an image upload component in `el-form-renderer`.

## Parent Component Configuration

In the parent component, we need to import the `ImageUpload` component via the `component` prop and pass configuration via the `el` prop.

- **isShowTip**: Whether to show tip
- **limit**: Max upload count
- **extralData**: Extra data

## Upload Component Attributes

The `ImageUpload` component supports the following attributes (passed via `el`):

- **disabled**: disabled
- **multiple**: multiple selection
- **action**: submission address
- **list-type**: type of file list (text/picture/picture-card)
- **on-success**: hook when file uploaded successfully
- **before-upload**: hook before uploading file
- **limit**: max allowed upload count
- **on-error**: hook when file upload fails
- **on-exceed**: hook when file limit is exceeded
- **data**: extra parameters to attach when uploading
- **on-remove**: hook when file is removed from the list
- **show-file-list**: whether to show the uploaded file list
- **headers**: set request headers for upload
- **file-list**: uploaded file list, e.g.: `[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]`
- **on-preview**: hook when clicking on an uploaded file in the list

## Example

> Test cases cannot upload; please replace action with the upload address; or click set image address to view the effect.

<demo src="./upload.vue"
title="Image Upload Example"
desc="Demonstrates how to configure and use a custom image upload component">
</demo>
