import { sidebar } from "./sidebar" // 确保路径正确
import { resolve } from "path"
import { genTemp } from "@ruabick/vite-plugin-gen-temp"
import { applyPlugins } from "@ruabick/md-demo-plugins"
import { copyDocs } from "./theme/plugins/copy-docs"
const socialLinks = [{ icon: "github", link: "https://gitee.com/childe-jia" }]
import { defineConfig } from "vitepress"
export default defineConfig({
  lang: "zh-CN",
  lastUpdated: true, //显示最后更新时间
  themeConfig: {
    base: "/jiayc4215/",
    logo: "/logo.png",
    sidebar
  },
  // markdown 配置
  markdown: {
    config: md => {
      applyPlugins(md)
    },
    theme: {
      light: "github-light",
      dark: "github-dark"
    }
  },
  // 多语言配置
  locales: {
    // 这里的 root 代表默认语言（无前缀）
    root: {
      lang: "zh-CN",
      label: "简体中文",
      nav: [{ text: "指南", link: "/guide/" }],
      //主题配置
      themeConfig: {
        // 社交链接
        socialLinks: [...socialLinks]
      }
    },
    // 这里的 en 代表英语（路径带 /en/）
    en: {
      lang: "en-US",
      label: "English",
      link: "/en/",
      themeConfig: {
        socialLinks: [...socialLinks]
      }
    }
  },
  vite: {
    server: {
      port: 8090
    },
    plugins: [genTemp(), copyDocs()],
    resolve: {
      alias: {
        "el-form-renderer-vue3": resolve("./src/")
      }
    }
  },
  //  为了解决打包后，控制台不结束
  buildEnd() {
    setTimeout(() => {
      process.exit(0)
    }, 2000)
  }
})
