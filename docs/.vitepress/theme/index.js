import DefaultTheme from "vitepress/theme"
import ElementPlus from "element-plus"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import DemoBlock from "@ruabick/vitepress-demo-block"
import "element-plus/dist/index.css" // CSS 在这里导入不会报错
import "@ruabick/vitepress-demo-block/dist/style.css"
import "./styles/index.css"

export default {
  extends: DefaultTheme, // 继承默认主题
  enhanceApp: async ({ app }) => {
    // 注册图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    // eslint-disable-next-line
    app.component("demo", DemoBlock)
    // 注册 ElementPlus
    app.use(ElementPlus)
  }
}
