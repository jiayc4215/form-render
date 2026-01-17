import DefaultTheme from "vitepress/theme"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css" // CSS 在这里导入不会报错
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

export default {
  extends: DefaultTheme, // 继承默认主题
  enhanceApp: async ({ app }) => {
    // 注册图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    // 注册 ElementPlus
    app.use(ElementPlus)
  }
}
