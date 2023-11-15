<template>
  <!--
disabled：禁用
multiple：支持多选
action：提交地址
list-type：文件列表的类型 （text/picture/picture-card）、
on-success：文件上传成功时的钩子
before-upload：上传文件之前的钩子
limit：最大允许上传个数
on-error：文件上传失败时的钩子
on-exceed：文件超出个数限制时的钩子
data：	上传时附带的额外参数
on-remove	文件列表移除文件时的钩子
show-file-list	是否显示已上传文件列表
headers	设置上传的请求头部
file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
on-preview	点击文件列表中已上传的文件时的钩子
 -->
  <div class="component-upload-image">
    <el-upload
      ref="upload"
      :disabled="disabled"
      multiple
      :action="uploadFileUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :data="{ ...defaultData, ...extralData }"
      name="file"
      :on-remove="handleRemove"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
    >
      <el-icon class="avatar-uploader-icon"><Plus /></el-icon>\
    </el-upload>

    <el-dialog v-model="dialogVisible" title="预览" width="800" append-to-body>
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, computed, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
let uploadList = reactive([]); // 准备上传的数组
let number = ref(0); // 准备上传的个数
let fileList = reactive([]); // 上传的文件列表
let headers = reactive({ Authorization: "Bearer " + 1111 }); // 设置上传的请求头部
let dialogImageUrl = ref("");
let dialogVisible = ref(false);
const props = defineProps({
  // 回显的值
  value: [String, Object, Array],
  // 	必选参数，上传的地址
  action: {
    type: String,
    default: "/dev-api/admin/product/fileUpload",
  },
  // 	上传时附带的额外参数
  extralData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  // 图片数量限制
  limit: {
    type: Number,
    default: 5,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ["png", "jpg", "jpeg"],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true,
  },
  // 禁用
  disabled: {
    type: Boolean,
    default: false,
  },
});
const defaultData = reactive({});
const emit = defineEmits(["input"]);
const upload = ref("");

watch(
  () => props.value,
  (val) => {
    if (val) {
      // 首先将值转为数组, 当只穿了一个图片时，会报map方法错误
      // 如果"value"是一个数组，则直接使用它；否则，将"value"按逗号分隔成一个数组；
      // 如果"value"不是一个数组或字符串，则将"value"作为单独的元素创建一个数组。\
      // 然后，将数组中的每个元素转换为对象，并将转换后的对象数组赋值给组件的"fileList"属性。
      const list = Array.isArray(val)
        ? val
        : Array.isArray(props.value.split(","))
        ? props.value.split(",")
        : Array.of(props.value);
      // 然后将数组转为对象数组
      fileList = list.map((item) => {
        if (typeof item === "string") {
          // edit by
          item = { name: item, url: item };
        }
        return item;
      });
    } else {
      fileList = [];
      return [];
    }
  },
  { deep: true, immediate: true }
);

// 删除图片
const handleRemove = (file, fileList) => {
  const findex = fileList.map((f) => f.name).indexOf(file.name);
  if (findex > -1) {
    fileList.splice(findex, 1);
    emit("input", listToString(fileList));
  }
};
// 提交地址
const uploadFileUrl = computed(() => {
  return props.action;
});
// 上传成功回调
const handleUploadSuccess = (res, file) => {
  if (res.code === 200) {
    // edit by
    // edit by
    uploadList.push({ name: res.data, url: res.data });
    // 上传成功数等于上传数（上传成功）
    if (uploadList.length === number.value) {
      // 回显赋值
      fileList = fileList.concat(uploadList);
      // 情空数据
      uploadList = [];
      number.value = 0;
      // 向父组件派发最终结果
      emit("input", listToString(fileList));
      console.log(listToString(fileList));
    }
    console.log("上传成功");
  } else if (res.code === 401) {
    console.log("权限不足");
  } else {
    console.log("上传失败");
    // 删除上传
    number.value--;

    upload.value.handleRemove(file);
  }
};
// 上传前loading加载
const handleBeforeUpload = (file) => {
  let isImg = false;
  if (props.fileType.length) {
    // 用来存储文件的扩展名
    let fileExtension = "";
    // 如果包含扩展名返回扩展名
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    // 如果有一个元素满足条件，则表达式返回true
    isImg = props.fileType.some((type) => {
      // 如果文件的类型（file.type）中包含当前遍历到的类型（type），则返回true，表示文件类型匹配成功。
      if (file.type.indexOf(type) > -1) return true;
      // 如果文件的扩展名（fileExtension）存在，并且文件的扩展名中包含当前遍历到的类型（type），则返回true，表示文件类型匹配成功。
      return !!(fileExtension && fileExtension.indexOf(type) > -1);
    });
  } else {
    // 如果没有定义文件类型，则会检查文件的类型是否包含"image"字符串，如果是图片类型，则将isImg设置为true。
    isImg = file.type.indexOf("image") > -1;
  }

  //图片格式不正确
  if (!isImg) {
    console.log("文件格式不正确");
    return false;
  }
  // 会检查文件的大小是否小于指定的大小。
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      console.log("超出大小");
      return false;
    }
  }
  console.log("正在上传中");
  number.value++;
};
// 对象转成指定字符串分隔
const listToString = (list, separator) => {
  // 用来存储最终的字符串结果。
  let strs = "";
  // 如果没有传入分隔符参数separator，则将separator设置为逗号","
  separator = separator || ",";
  for (let i in list) {
    // 将列表中的每个元素的url属性值去除baseUrl部分，并将其与分隔符连接起来，然后添加到strs字符串中
    strs += list[i].url + separator;
  }
  // 通过判断strs是否为空字符串，如果不为空，则使用substr函数去掉最后一个分隔符，否则返回空字符串。
  return strs !== "" ? strs.substr(0, strs.length - 1) : "";
};
// 上传失败
const handleUploadError = (error) => {
  console.log(error);
};
// 文件个数超出
const handleExceed = () => {
  console.log("超出个数");
};
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>