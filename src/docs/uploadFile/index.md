---
map:
  path: /en/form/uploadFile/
---

# File Upload

This article describes how to integrate a file upload component in `el-form-renderer`.

## Parent Component Configuration

In the parent component, we need to import the `ManualUpload` component via the `component` prop and pass configuration via the `el` prop.

- **action**: upload address
- **limit**: max upload count

## Upload Component Attributes

The `ManualUpload` component is a wrapper component for manual upload scenarios. Upload triggers after clicking the submit button. Supports the following attributes (passed via `el`):

- **action**: submission address
- **on-preview**: hook when clicking on an uploaded file in the list
- **name**: uploaded file field name
- **limit**: max allowed upload count
- **data**: extra parameters to attach when uploading
- **accept**: accepted file types (invalid in thumbnail-mode)
- **on-error**: hook when file upload fails
- **on-exceed**: hook when file limit is exceeded
- **on-success**: hook when file uploaded successfully
- **before-upload**: hook before uploading file
- **on-change**: hook when file status changes, called on add file, upload success, and upload fail
- **on-remove**: hook when file is removed from the list
- **file-list**: uploaded file list, e.g.: `[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]`
- **headers**: set request headers for upload
- **auto-upload**: whether to automatically upload files

## Example

> Test cases cannot upload; please replace action with the upload address; this upload is manual upload, uploading after clicking submit.

<demo src="./uploadFile.vue"
title="File Upload Example"
desc="Demonstrates how to configure and use a custom file upload component">
</demo>
