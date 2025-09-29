// useModel.js
import { getCurrentInstance, customRef, watchSyncEffect, ref } from "vue";

/**
 * 简单版 hasChanged
 * 判断两个值是否不同（考虑 NaN 的情况）
 */
function hasChanged(a, b) {
  return a !== b && (a === a || b === b);
}

/**
 * useModel - 实现类似 defineModel 的 hooks
 *
 * @param {Object} props - 组件的 props
 * @param {String} name  - 要绑定的 prop 名字（如 "modelValue"）
 * @param {Object} options - 可选 { get, set } 转换器
 * @returns {Ref} 一个 ref，可以直接在组件内部 v-model 绑定
 */
export function useModel(props, name, options = {}) {
  const i = getCurrentInstance();
  if (!i) {
    console.warn(`useModel() called without active instance.`);
    return ref();
  }

  const emit = i.emit;
  const propValue = () => props[name];

  const res = customRef((track, trigger) => {
    let localValue; // 缓存当前值
    let prevSetValue = Symbol(); // 缓存上一次 set 时的“原始值”
    let prevEmittedValue; // 缓存上一次实际 emit 出去的值

    // 同步父组件传进来的 prop → 更新 localValue
    watchSyncEffect(() => {
      const value = propValue();
      if (hasChanged(localValue, value)) {
        localValue = value;
        trigger(); // 通知依赖更新
      }
    });

    return {
      get() {
        track(); // 依赖收集
        return options.get ? options.get(localValue) : localValue;
      },
      set(value) {
        // 如果有 set 转换器，先转换
        const emittedValue = options.set ? options.set(value) : value;

        // --------------------------
        // prevSetValue 的作用：
        // --------------------------
        // 避免这种情况触发多余更新：
        // - 组件内部 set 了一个值（value）
        // - 父组件 emit 回来时 props 同步了（emittedValue）
        // - 结果 localValue 没变，但因为 "value !== prevSetValue"
        //   又触发了一次 trigger，造成死循环或多余刷新
        //
        // 所以这里多存一份 "上次 set 的原始值"，用来跳过这种情况
        if (
          !hasChanged(emittedValue, localValue) &&
          !(prevSetValue !== Symbol() && hasChanged(value, prevSetValue))
        ) {
          return; // 没有真正变化，直接跳过
        }

        // 如果父组件没传 v-model，则自己维护一份 localValue
        if (!(name in i.vnode.props)) {
          localValue = value;
          trigger();
        }

        // 通知父组件更新
        emit(`update:${name}`, emittedValue);

        // 特殊情况：如果 value 和 emittedValue 不同，
        // 且不是重复的 prevSetValue，
        // 且 emittedValue 也没变，
        // 那么手动 trigger 一次，保持依赖更新
        if (
          hasChanged(value, emittedValue) &&
          hasChanged(value, prevSetValue) &&
          !hasChanged(emittedValue, prevEmittedValue)
        ) {
          trigger();
        }

        // 更新缓存
        prevSetValue = value;
        prevEmittedValue = emittedValue;
      },
    };
  });

  return res;
}
