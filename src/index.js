import elFormRenderer from "./components/femessage/el-form-renderer.vue" // 引入封装好的组件
export { elFormRenderer } //实现按需引入*

const components = [elFormRenderer]
const install = function (App) {
  components.forEach(component => {
    App.component(component.name, component)
  })
}
export default { install } // 批量的引入*
