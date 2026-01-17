import { sidebar } from "./sidebar" // 确保路径正确
import { resolve } from "path"
import { genTemp } from "@ruabick/vite-plugin-gen-temp"
import { applyPlugins } from "@ruabick/md-demo-plugins"

export default {
  themeConfig: {
    base: "/jiayc4215/",
    siteTitle: false,
    logo: "/logo.png",
    nav: [
      { text: "指南", link: "/guide/form" },
      { text: "组件", link: "/assembly/form/basic" }
    ],
    socialLinks: [{ icon: "github", link: "https://gitee.com/childe-jia" }],
    sidebar
  },
  markdown: {
    config: md => {
      applyPlugins(md)
    },
    theme: {
      light: "github-light",
      dark: "github-dark"
    }
  },
  vite: {
    server: {
      port: 8090
    },
    plugins: [genTemp()],
    resolve: {
      alias: {
        "el-form-renderer-vue3": resolve(__dirname, "../../")
      }
    }
  }
}
