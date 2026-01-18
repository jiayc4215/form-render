import Component from "./el-form-renderer.vue"

// 1. 定义插件安装逻辑
const install = app => {
  app.component(Component.name, Component)
}

// 2. 为组件对象添加 install 属性，支持 app.use(Component)
Component.install = install

// 3. 导出组件本身，支持 import { ElFormRenderer } 局部引入
export const ElFormRenderer = Component

// 4. 默认导出，支持 import ElFormRenderer from '...'
export default Component
