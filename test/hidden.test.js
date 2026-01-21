import { mount } from "@vue/test-utils"
import ElementPlus from "element-plus"
import renderFormItem from "../src/components/render-form-item.vue"

const testOrigin = {
  type: "input",
  id: "name"
}

const testValue = {
  name: "hello"
}

describe("mixin-hidden.js", () => {
  // 辅助函数：模拟旧代码中的 new Constructor
  const createWrapper = props => {
    return mount(renderFormItem, {
      props: props,
      // 防止测试过程中注入报错
      global: {
        provide: {
          _elFormRenderer_: {}
        },
        plugins: [ElementPlus]
      }
    })
  }

  describe("enableWhen 与 hidden", () => {
    test("没有使用 enableWhen 与 hidden", () => {
      const wrapper = createWrapper({ data: testOrigin, value: testValue })

      expect(wrapper.vm._show).toBe(true)
    })

    test("使用 enableWhen，不被 hidden 干扰", () => {
      const data = { ...testOrigin, enableWhen: { name: false } }
      const wrapper = createWrapper({ data, value: testValue })

      expect(wrapper.vm.hiddenStatus).toBe(false)
      expect(wrapper.vm._show).toBe(false)
    })

    test("同时使用 hidden 与 enableWhen，取并集", () => {
      const data = {
        ...testOrigin,
        hidden: () => false,
        enableWhen: { name: false }
      }
      const wrapper = createWrapper({ data, value: testValue })

      expect(wrapper.vm.hiddenStatus).toBe(false)
      expect(wrapper.vm._show).toBe(false)
    })
  })

  describe("使用 hidden", () => {
    test("使用 hidden，返回 true，不显示", () => {
      const data = { ...testOrigin, hidden: () => true }
      const wrapper = createWrapper({ data, value: testValue })

      expect(wrapper.vm._show).toBe(false)
    })

    test("使用 hidden，返回 false，显示", () => {
      const data = { ...testOrigin, hidden: () => false }
      const wrapper = createWrapper({ data, value: testValue })

      expect(wrapper.vm._show).toBe(true)
    })
  })

  describe("hidden 可以使用 form 与当前 item 值", () => {
    test("hidden 可以获取 form 值", () => {
      const data = { ...testOrigin, hidden: form => form.name === "hello" }
      const wrapper = createWrapper({ data, value: testValue })

      expect(wrapper.vm.hiddenStatus).toBe(true)
      expect(wrapper.vm._show).toBe(false)
    })

    test("hidden 可以获取 item 信息", () => {
      const data = { ...testOrigin, hidden: (_, item) => item.id === "name" }
      const wrapper = createWrapper({ data, value: testValue })

      expect(wrapper.vm.hiddenStatus).toBe(true)
      expect(wrapper.vm._show).toBe(false)
    })
  })
})
