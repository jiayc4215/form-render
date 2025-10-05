import { h, resolveComponent, ref } from "vue";
import { createApp } from "../../index";
export const renderDialog = (component, componentProps, modalProps) => {
  // 声明一个 ref 响应式数据，用于控制弹窗的显示与隐藏 （为了保留 Modal 组件关闭动画）
  let { confirmButtonText = "确 认", cancelButtonText = "取 消" } = modalProps;
  let { methodKey = "submit" } = componentProps;
  const open = ref(true);
  const instance = ref(null);
  const loading = ref(false);

  const Dialog = () => {
    return h(
      resolveComponent("el-dialog"),
      {
        ...modalProps,
        modelValue: open.value, // 这里不是模板语法！需要 .value
        "onUpdate:modelValue": (val) => {
          open.value = val;
        },
        // PS: 如果组件库没有 onClosed 钩子，可以使用 setTimeout 处理
        onClosed() {
          // 关闭动画结束后，卸载组件
          app.unmount();
          document.body.removeChild(div);
        },
      },
      {
        default: () => h(component, { ref: instance, ...componentProps }),
        footer: () =>
          h("div", { class: "dialog-footer" }, [
            h(
              resolveComponent("el-button"),
              { onClick: () => (open.value = false) },
              () => cancelButtonText
            ),
            h(
              resolveComponent("el-button"),
              { type: "primary", onClick: submit, loading: loading.value },
              () => confirmButtonText
            ),
          ]),
      }
    );
  };

  // 创建挂载节点
  const div = document.createElement("div");
  document.body.appendChild(div);

  // 动态创建应用并挂载
  const app = createApp(Dialog);
  app.mount(div);
  // 导出一个对外关闭弹窗的方法，支持外部调用关闭弹窗
  const unmount = (delay = 0) => {
    if (!open.value) return;
    open.value = false;
    setTimeout(() => {
      app.unmount();
      document.body.removeChild(div);
    }, delay);
  };
  async function submit() {
    loading.value = true;
    try {
      await instance.value?.[methodKey]?.();
      open.value = false;
    } finally {
      loading.value = false;
    }
  }

  return { unmount, instance };
};
