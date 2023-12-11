<template>
  <!--
action：提交地址
on-preview	点击文件列表中已上传的文件时的钩子
name:	上传的文件字段名
limit：最大允许上传个数
data：	上传时附带的额外参数
accept 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
on-error：文件上传失败时的钩子
on-exceed：文件超出个数限制时的钩子
on-success：文件上传成功时的钩子
before-upload：上传文件之前的钩子
on-change 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
on-remove	文件列表移除文件时的钩子
file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
headers	设置上传的请求头部
auto-upload 是否自动上传文件

 -->
  <div class="component-upload-image">
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="uploadFileUrl"
      :on-preview="handlePreview"
    >
      <template #trigger>
        <el-button size="small" type="primary">选取文件</el-button>
      </template>

      <template #tip v-if="showTip">
        <div v-if="parentTip" v-html="parentTip"></div>
        <div v-else>
          请上传
          <template v-if="fileSize">
            大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
          </template>
          <template v-if="fileType">
            格式为 <b style="color: #f56c6c">{{ fileType.join(",") }}</b>
          </template>
          的文件
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script setup>
import { ref, computed, reactive, watch } from "vue";
const props = defineProps({
  // 回显的值
  modelValue: [String, Object, Array],
  // 	必选参数，上传的地址
  action: {
    type: String,
    default: "/dev-api/admin/product/fileUpload",
  },

  // 数量限制
  limit: {
    type: Number,
    default: 5,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // 文件类型, 例如['xls', 'xlsx']
  fileType: {
    type: Array,
    default: () => ["xls", "xlsx"],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true,
  },
  // 	上传的文件字段名
  name: {
    type: String,
    default: "file",
  },
  parentTip: {
    type: String,
    default: "",
  },
});
// 提交地址
const uploadFileUrl = computed(() => {
  return props.action;
});
const showTip = computed(() => {
  return props.isShowTip && (props.fileType || props.fileSize);
});
</script>
