<script setup>
import { reactive, ref } from "vue";

const props = defineProps({
  msg: {
    type: String,
    default: "登录",
  },
});

const formRef = ref();
const formState = reactive({
  username: "",
  password: "",
});

async function submit() {
  // validate() 返回 boolean 或抛出异常（取决于 Element Plus 版本）
  const valid = await formRef.value?.validate();
  if (!valid) return;

  // 模拟异步提交
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...formState }), 2000);
  });
}

defineExpose({ submit });
</script>

<template>
  <div>
    <h3>{{ props.msg }}</h3>

    <el-form ref="formRef" :model="formState" label-width="80px">
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[
          { required: true, message: '请输入用户名！', trigger: 'blur' },
        ]"
      >
        <el-input v-model="formState.username" />
      </el-form-item>

      <el-form-item
        label="密码"
        prop="password"
        :rules="[{ required: true, message: '请输入密码！', trigger: 'blur' }]"
      >
        <el-input v-model="formState.password" type="password" />
      </el-form-item>
    </el-form>
  </div>
</template>
