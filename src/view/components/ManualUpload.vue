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
      :name="name"
      :limit="limit"
      :data="{ ...extraData }"
      :accept="fileType.join(',')"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :file-list="fileList"
      :headers="headers"
      :auto-upload="false"
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
import { ref, computed, reactive, watch, nextTick, inject } from "vue";
import { ElMessage, ElLoading } from "element-plus";
let fileList = reactive([]); // 上传的文件列表
let number = ref(0); // 准备上传的个数
let extraData = reactive({}); // 上传的附加参数
let headers = reactive({ Authorization: "Bearer " + 1111 }); // 设置上传的请求头部
let loading = null;
const upload = ref("");
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  // 回显的值
  modelValue: [String, Object, Array],
  // 	必选参数，上传的地址
  action: {
    type: String,
    default: "/sys/user/import",
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
const uploaded = inject("uploaded");
// 提交地址
const uploadFileUrl = computed(() => {
  return props.action;
});
const showTip = computed(() => {
  return props.isShowTip && (props.fileType || props.fileSize);
});
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      let temp = 1;
      const list = Array.isArray(val) ? val : props.modelValue.split(",");
      fileList = list.map((item) => {
        if (typeof item === "string") {
          item = { name: item, url: item };
        }
        // uid
        item.uid = item.uid || new Date().getTime() + temp++;
        return item;
      });
    } else {
      fileList = [];
      return [];
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
// 上传前校检格式和大小
const handleBeforeUpload = (file) => {
  if (props.fileType) {
    // 用来存储文件的扩展名
    let fileExtension = "";
    // 如果包含扩展名返回扩展名
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    // 使用some方法来判断文件类型是否匹配
    const isTypeOk = props.fileType.some((type) => {
      if (file.type.indexOf(type) > -1) return true;
      // 如果文件的类型（file.type）中包含当前遍历到的类型（type），则返回true，表示文件类型匹配成功。
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
    //文件格式不正确
    if (!isTypeOk) {
      ElMessage({
        message: `文件格式不正确, 请上传${props.fileType.join(",")}格式文件!`,
        type: "error",
      });
      return false;
    }
  }
  // 会检查文件的大小是否小于指定的大小。
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      ElMessage({
        message: `上传文件大小不能超过 ${props.fileSize} MB!`,
        type: "error",
      });
      return false;
    }
  }
  loading = ElLoading.service({
    lock: true,
    text: "正在上传文件，请稍候...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  number.value++;
};
// 文件个数超出
const handleExceed = () => {
  ElMessage({
    message: `上传文件数量不能超过 ${props.limit} 个!`,
    type: "error",
  });
};
// 上传失败
const handleUploadError = (error) => {
  uploaded(error);
  ElMessage({
    message: "上传图片失败，请重试",
    type: "error",
  });
  loading.close();
};
// 提交上传(父组件控制上传)
const submitUpload = async (extraData) => {
  extraData = { ...extraData };
  await nextTick();
  upload.value.submit();
};
// 删除文件
const handleRemove = (file, fileList) => {
  emit("update:modelValue", fileList);
};

// 文件状态改变时的钩子
const handleChange = (file, fileList) => {
  emit("update:modelValue", fileList);
};
// 上传成功的回调
const handleUploadSuccess = (res, file) => {
  console.log("上传成功的回调");
  if (res.code === 0) {
    loading.close();
    ElMessage({
      message: "上传成功",
      type: "success",
    });
  } else if (res.code === 401) {
    ElMessage({
      message: "登录状态过期，请重新登录",
      type: "error",
    });
  } else {
    // 删除上传
    number.value--;
    loading.close();
    ElMessage({
      message: "上传失败",
      type: "error",
    });
    upload.value.handleRemove(file);
  }
  uploaded(res);
};
// 点击文件列表中已上传的文件时的钩子
const handlePreview = (file, List) => {
  console.log(file);
};

defineExpose({
  submitUpload,
});
</script>


