<template>
  <div>
    <el-form-item
      v-if="_show"
      :label="typeof data.label === 'string' ? data.label : ''"
      :rules="!readonly && Array.isArray(data.rules) ? data.rules : undefined"
      v-bind="data.attrs"
      class="render-form-item"
    >
      <!-- label -->
      <!-- <v-node v-if="typeof data.label !== 'string'" slot="label" :content="data.label" /> -->
      <!--只读 input select -->
      <template v-if="readonly && hasReadonlyContent">
        <el-input
          v-if="data.type === 'input'"
          v-bind="componentProps"
          :modelValue="itemValue"
          readonly
          v-on="listeners"
        />
        <div v-else-if="data.type === 'select'">
          <template> {{ multipleValue }} </template>
        </div>
      </template>
      <custom-component
        v-else
        ref="customComponent"
        :component="data.component || `el-${data.type || 'input'}`"
        v-bind="componentProps"
        :modelValue="itemValue"
        :disabled="disabled || componentProps.disabled || readonly"
        v-on="listeners"
        :loading="loading"
        :remote-method="data.remoteMethod || componentProps.remoteMethod || remoteMethod"
      >
        <template v-for="(opt, index) in options">
          <el-option
            v-if="data.type === 'select'"
            :key="optionKey(opt) || index"
            v-bind="opt"
          />
          <el-checkbox-button
            v-if="data.type === 'checkbox-group' && data.style === 'button'"
            :key="opt.value"
            v-bind="opt"
            :label="'value' in opt ? opt.value : opt.label"
          >
            {{ opt.label }}
          </el-checkbox-button>
          <el-checkbox
            v-else-if="data.type === 'checkbox-group' && data.style !== 'button'"
            :key="opt.value"
            v-bind="opt"
            :label="'value' in opt ? opt.value : opt.label"
          >
            {{ opt.label }}
          </el-checkbox>
          <el-radio-button
            v-else-if="data.type === 'radio-group' && data.style === 'button'"
            :key="opt.label"
            v-bind="opt"
            :label="'value' in opt ? opt.value : opt.label"
            >{{ opt.label }}</el-radio-button
          >
          <el-radio
            v-else-if="data.type === 'radio-group' && data.style !== 'button'"
            :key="opt.label"
            v-bind="opt"
            :label="'value' in opt ? opt.value : opt.label"
            >{{ opt.label }}</el-radio
          >
        </template>
      </custom-component>
    </el-form-item>
  </div>
</template>

<script setup>
import { computed, reactive, inject, nextTick, ref, watch } from "vue";
import { noop } from "../util/utils";
import getEnableWhenStatus from "../util/enable-when";
import _includes from "lodash.includes";
import _topairs from "lodash.topairs";
import _frompairs from "lodash.frompairs";
import _get from "lodash.get";
import CustomComponent from "../util/CustomComponent";
import axios from "axios";

let props = defineProps({
  data: Object,
  prop: String,
  itemValue: {},
  value: Object,
  disabled: Boolean,
  readonly: Boolean,
  options: Array,
});
// setOptions
const emit = defineEmits(["updateValue"]);
let propsInner = reactive({});
const loading = ref(false);
let dataRef = ref(props.data);
let validateField = inject("validateField");
let setOptions = inject("setOptions");
const isBlurTrigger = () => {
  return (
    props.data.rules &&
    props.data.rules.some((rule) => {
      return rule.required && rule.trigger === "blur";
    })
  );
};
const componentProps = computed(() => ({ ...props.data.el, ...propsInner }));
const hasReadonlyContent = computed(() => ["input", "select"].includes(props.data.type));
const hiddenStatus = computed(() => {
  const hidden = props.data.hidden || (() => false);
  return hidden(props.data.value, props.data);
});
const enableWhenStatus = computed(() =>
  getEnableWhenStatus(props.data.enableWhen, props.data.value)
);
const _show = computed(() => !hiddenStatus.value && enableWhenStatus.value);
const listeners = computed(() => {
  const data = props.data;
  const id = data.id;
  const atChange = data.atChange || noop;
  const on = data.on || {};
  const originOnInput = on.input || noop;
  const originOnChange = on.change || noop;
  const trim = data.trim !== undefined ? data.trim : true;

  let updateForm = inject("updateForm");
  return {
    ..._frompairs(
      _topairs(on).map(([eName, handler]) => [
        eName,
        (...args) => handler(args, updateForm),
      ])
    ),
    // 手动更新表单数据
    "update:modelValue": (value, ...rest) => {
      if (typeof value === "string" && trim) value = value.trim();
      console.log(value, "update:modelValue");
      emit("updateValue", { id, value });
      // FIXME: rules 的 trigger 只写了 blur，依然会在 change 的时候触发校验！
      triggerValidate(id);
    },
  };
});
watch(dataRef, (data) => {
  if (!data) {
    throw new Error("data must be an Object.");
  } else if (!data.id) {
    throw new Error("`id` is unvalidated.");
  } else if (!data.type && !data.component) {
    throw new Error("`type` and `component` cannot both be null.");
  }
});
watch(
  /**
   * 这里其实用 remote 处理了两件事。有机会是可以拆分的
   * 1. 基本用法，配置 url 后即可从远程获取某个 prop 注入到组件
   * 2. 针对 select、checkbox-group & radio-group 组件，会直接将 resp 作为 options 处理；label & value 也是直接为这个场景而生的
   */
  () => props.data.remote?.request,
  (newValue, oldValue) => {
    console.log(newValue);
    // 不应该用 watch data.remote，因为对象引用是同一个 https://cn.vuejs.org/v2/api/#vm-watch (估计当初这样写是为了方便)
    // 现改写成：分开处理 remote.request，remote.url
    // 至于为什么判断新旧值相同则返回，是因为 form 的 content 是响应式的，防止用户直接修改 content 其他内容时，导致 remote.request 重新发请求

    if (!newValue || typeof newValue !== "function" || newValue === oldValue) return;
    makingRequest(props.data.remote.remote);
  },
  { immediate: true }
);
watch(
  () => props.data.remote?.url,
  (url, oldV) => {
    // 第三个判断条件：防止 url 与 request 同时存在时，发送两次请求
    if (!url || url === oldV || (!oldV && props.data.remote.request)) return;
    const request =
      props.data.remote.request || (() => axios.get(url).then((resp) => resp.data));
    makingRequest(Object.assign({}, props.data.remote, { request }));
  },
  { immediate: true }
);
const multipleValue = ({ data, itemValue, options = [] }) => {
  const multipleSelectValue =
    _get(data, "el.multiple") && Array.isArray(itemValue) ? itemValue : [itemValue];
  return multipleSelectValue
    .map((val) => (options.find((op) => op.value === val) || {}).label)
    .join();
};
// 校验表单项目
const triggerValidate = async (id) => {
  try {
    if (!props.data.rules || !props.data.rules.length) return;
    console.log(isBlurTrigger(), "isBlurTrigger");
    if (isBlurTrigger()) return;
    await nextTick();
    validateField && validateField(id);
  } catch (error) {
    console.log(error);
  }
};
const makingRequest = (remoteConfig, query) => {
  const isOptionsCase =
    ["select", "checkbox-group", "radio-group"].indexOf(peops.data.type) > -1;
  const {
    request,
    prop = "options", // 默认处理 el-cascader 的情况
    dataPath = "",
    onResponse = (resp) => {
      if (dataPath) resp = _get(resp, dataPath);
      if (isOptionsCase) {
        return resp.map((item) => ({
          label: item[label],
          value: item[value],
        }));
      } else {
        return resp;
      }
    },
    onError = (error) => {
      console.error(error.message);
      loading.value = false;
    },
    label = "label",
    value = "value",
  } = remoteConfig;

  loading.value = true;

  Promise.resolve(request(query))
    .then(onResponse, onError)
    .then((resp) => {
      if (isOptionsCase) {
        setOptions && setOptions(props.prop, resp);
      } else {
        propsInner = { [prop]: resp };
      }
      loading.value = false;
    });
};
const remoteMethod = (query) => {
  if (
    _get(props.data, "type") === "select" &&
    _get(props.data, "el.filterable") &&
    _get(props.data, "el.remote")
  ) {
    this.makingRequest(this.data.remote, query);
  }
};
const optionKey = (opt) => {
  if (opt.value instanceof Object) {
    if (!props.data.el || !props.data.el.valueKey) {
      return;
    }

    return opt.value[props.data.el.valueKey];
  } else {
    return opt.value;
  }
};
</script>
