import { ref, computed, watch, getCurrentInstance, nextTick } from "vue";

/**
 * 简单实现 isDef
 */
function isDef(val) {
  return val !== undefined && val !== null;
}

/**
 * 简单 JSON 深拷贝函数
 */
function cloneFnJSON(val) {
  return JSON.parse(JSON.stringify(val));
}

/**
 * v-model 的简写工具
 * @param {Object} props 组件 props
 * @param {String} key 绑定 key，默认 modelValue
 * @param {Function} emit 组件 emit 函数
 * @param {Object} options 配置选项
 */
export function useVModel(props, key = "modelValue", emit, options = {}) {
  const {
    clone = false,
    passive = false,
    eventName,
    deep = false,
    defaultValue,
    shouldEmit,
  } = options;

  const vm = getCurrentInstance();
  const _emit =
    emit ||
    vm?.emit ||
    vm?.$emit?.bind(vm) ||
    vm?.proxy?.$emit?.bind(vm?.proxy);

  const event = eventName || `update:${key}`;

  const doClone = (val) => {
    if (!clone) return val;
    if (typeof clone === "function") return clone(val);
    return cloneFnJSON(val);
  };

  const getValue = () => {
    return isDef(props[key]) ? doClone(props[key]) : defaultValue;
  };

  const triggerEmit = (value) => {
    if (shouldEmit) {
      if (shouldEmit(value)) _emit(event, value);
    } else {
      _emit(event, value);
    }
  };

  if (passive) {
    const proxy = ref(getValue());
    let isUpdating = false;

    // props -> proxy
    watch(
      () => props[key],
      (v) => {
        console.log("watch2");

        if (!isUpdating) {
          isUpdating = true;
          proxy.value = doClone(v);
          nextTick(() => {
            console.log("nextTick========", proxy.value);

            isUpdating = false;
          });
        }
      },
      { deep }
    );

    // proxy -> emit
    watch(
      proxy,
      (v) => {
        console.log("proxy");

        if (!isUpdating && (v !== props[key] || deep)) {
          triggerEmit(v);
        }
      },
      { deep }
    );

    return proxy;
  } else {
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
