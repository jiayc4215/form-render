<template>
  <el-form ref="formRef" :model="FormData">
    <el-form-item
      v-for="item in content"
      :key="item.id"
      :label="item.label"
      :prop="item.id"
      :rules="item.rules"
    >
      <!-- 
      :modelValue="FormData[item.id]"
      @update:modelValue="FormData[item.id] = $event"
 -->
      <!-- is 自定义的input组件 -->
      <component
        :is="typeof item.type !== 'string' ? item.type : `el-${item.type}`"
        v-model="FormData[item.id]"
        v-bind="item.el"
        v-on="item?.on || {}"
      >
        <template v-for="(option, index) in item.options">
          <el-option
            v-if="item.type === 'select'"
            v-bind="option"
            :key="getOptionKey(item, option) || index"
          >
          </el-option>
          <el-checkbox-button
            v-if="item.type === 'checkbox-group' && item.style === 'button'"
            :key="option.value"
            v-bind="option"
            :label="'value' in option ? option.value : option.label"
          >
            {{ option.label }}
          </el-checkbox-button>
          <template
            v-else-if="
              item.type === 'checkbox-group' && item.style !== 'button'
            "
          >
            <el-checkbox
              :key="option.value"
              v-bind="option"
              :label="'value' in option ? option.value : option.label"
            >
              {{ option.label }}
            </el-checkbox>
          </template>

          <el-radio-button
            v-else-if="item.type === 'radio-group' && item.style === 'button'"
            :key="option.label"
            v-bind="option"
            :label="'value' in option ? option.value : option.label"
            >{{ option.label }}</el-radio-button
          >
          <template
            v-else-if="item.type === 'radio-group' && item.style !== 'button'"
          >
            <el-radio
              :key="option.label"
              v-bind="option"
              :label="'value' in option ? option.value : option.label"
              >{{ option.label }}</el-radio
            >
          </template>
        </template>
      </component>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { useVModle } from "./utils";
import { ref } from "vue";
const formRef = ref(null);
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  content: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: () => {},
  },
});
const getOptionKey = (item, option) => {
  if (option.value instanceof Object) {
    if (!item?.el || !item?.el?.valueKey) return;
    return option.value[item?.el?.valueKey];
  } else {
    return option.value;
  }
};
const FormData = useVModle(props, "modelValue", emit);
defineExpose({
  validate: (...args) => formRef.value.validate(...args),
});
</script>
