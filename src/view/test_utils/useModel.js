// useModel.js
import { getCurrentInstance, customRef, watchSyncEffect, ref } from "vue";

function hasChanged(a, b) {
  return a !== b && (a === a || b === b);
}

export function useModel(props, name) {
  const i = getCurrentInstance();
  if (!i) return ref();

  const emit = i.emit;

  const res = customRef((track, trigger) => {
    let localValue;

    // 父 → 子 (受控模式)
    watchSyncEffect(() => {
      const propValue = props[name];
      if (hasChanged(localValue, propValue)) {
        localValue = propValue;
        trigger(); // 父传新值时，触发视图更新
      }
    });

    return {
      get() {
        track();
        return localValue;
      },
      set(value) {
        // 如果父没传 v-model，就自己维护 (非受控模式)
        if (!(name in (i.vnode.props || {}))) {
          localValue = value;
          trigger(); // 只有 trigger() 才能更新视图
        }
        // 通知父更新
        emit(`update:${name}`, value);
      },
    };
  });

  return res;
}
