import js from "@eslint/js" //js规范（标准的）
import globals from "globals" //环境
import pluginVue from "eslint-plugin-vue" //vue规范
import { defineConfig } from "eslint/config" //配置
import eslintConfigPrettier from "eslint-config-prettier" // prettier
const ignores = ["**/dist/**", "**/node_modules/**", ".*", "**/.docs/**", "**/docs/.vitepress/**"]
export default defineConfig([
  {
    ignores
  },
  pluginVue.configs["flat/essential"], //vue规范
  {
    files: ["**/*.{js,mjs,cjs,vue}"], //匹配文件
    plugins: { js },
    extends: ["js/recommended"], //js规范
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }, //全局变量 window
    ...eslintConfigPrettier,
    rules: {
      "vue/multi-word-component-names": "off"
    }
  }
])
