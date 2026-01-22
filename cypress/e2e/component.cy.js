/// <reference types="Cypress" />

describe("测试 component 示例", function () {
  beforeEach(() => {
    cy.visit("/")
    cy.contains("开始").click()
    cy.$goto("component")
  })
  it("基础用例", function () {
    cy.contains("component")

    // 定义别名
    cy.get(".el-form-renderer input").as("myInput")

    // 第一步：输入
    cy.get("@myInput").type("1")
    cy.get("@myInput").should("have.value", "v1")

    // 第二步：失焦 (重新引用别名 = 重新查询 DOM)
    cy.get("@myInput").blur()

    // 第三步：验证结果 (再次重新查询 DOM)
    cy.get("@myInput").should("have.value", "v1.0.0")
  })
})
