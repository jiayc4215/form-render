import { createApp as _createApp } from "vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
function loadPlugins(app) {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  app.use(ElementPlus);
  app.use(router);
}

export const createApp = (...args) => {
  const app = _createApp(...args);
  loadPlugins(app);
  return app;
};
