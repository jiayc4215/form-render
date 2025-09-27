import { isDef } from "@vueuse/shared";
import {
  computed,
  ref as deepRef,
  getCurrentInstance,
  nextTick,
  watch,
} from "vue";
import { cloneFnJSON } from "../useCloned";

/**
 * v-model 的简写工具
 * 作用：把 props + emit 封装成一个 ref
 *
 * @param {Object} props 组件的 props
 * @param {String} key 绑定的 key，默认是 "modelValue"
 * @param {Function} emit 组件的 emit 函数
 * @param {Object} options 选项配置
 *
 * options 参数：
 * - passive: 是否开启被动模式，true 时用 watch 同步，false 时用 v-model
 * - eventName: 自定义触发的事件名
 * - deep: 是否深度监听（只在 passive 模式下生效）
 * - defaultValue: 默认值
 * - clone: 是否克隆（true 用 JSON 深拷贝，或者自定义函数）
 * - shouldEmit: 触发 emit 前的钩子，返回 false 会阻止 emit
 */
export function useVModel(props, key, emit, options = {}) {
  const {
    clone = false,
    passive = false,
    eventName,
    deep = false,
    defaultValue,
    shouldEmit,
  } = options;

  const vm = getCurrentInstance();
  // 获取 emit 方法（兼容性写法）
  const _emit =
    emit ||
    vm?.emit ||
    vm?.$emit?.bind(vm) ||
    vm?.proxy?.$emit?.bind(vm?.proxy);

  // 默认 key
  if (!key) key = "modelValue";

  // 事件名，默认是 update:xxx
  let event = eventName || `update:${key}`;

  // 克隆函数
  const cloneFn = (val) => {
    if (!clone) return val;
    if (typeof clone === "function") return clone(val);
    return cloneFnJSON(val);
  };

  // 获取值，优先用 props，否则用默认值
  const getValue = () => {
    return isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
  };

  // 触发 emit
  const triggerEmit = (value) => {
    if (shouldEmit) {
      if (shouldEmit(value)) _emit(event, value);
    } else {
      _emit(event, value);
    }
  };

  // 被动模式：用 watch 同步
  if (passive) {
    const initialValue = getValue();
    const proxy = deepRef(initialValue);
    let isUpdating = false;

    // 监听 props 更新，写入 proxy
    watch(
      () => props[key],
      (v) => {
        if (!isUpdating) {
          isUpdating = true;
          proxy.value = cloneFn(v);
          nextTick(() => {
            isUpdating = false;
          });
        }
      }
    );

    // 监听 proxy 更新，触发 emit
    watch(
      proxy,
      (v) => {
        if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
      },
      { deep }
    );

    return proxy;
  }
  // 普通模式：computed 双向绑定
  else {
    return computed({
      get() {
        return getValue();
      },
      set(value) {
        triggerEmit(value);
      },
    });
  }
}
