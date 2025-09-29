// useVModel.js
import { computed } from "vue";

export function useVModle(props, propName, emit) {
  return computed({
    get() {
      return new Proxy(props[propName], {
        get(target, key) {
          return Reflect.get(target, key);
        },
        set(target, key, newValue) {
          emit("update:" + propName, {
            ...target,
            [key]: newValue,
          });
          return true;
        },
      });
    },
    set(value) {
      emit("update:" + propName, value);
    },
  });
}
