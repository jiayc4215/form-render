// .vitepress/theme/index.js

import DefaultTheme from "vitepress/theme";
import "element-plus/dist/index.css";
import elementplus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
export default {
  ...DefaultTheme,
  enhanceApp: async ({ app, router, siteData }) => {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
    app.use(elementplus);
  },
};
