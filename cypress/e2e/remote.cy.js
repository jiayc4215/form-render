/// <reference types="Cypress" />

describe("测试 remote 示例", function () {
  beforeEach(() => {
    cy.visit("/")
    cy.contains("开始").click()
    cy.$goto("remote")
  })

  it("测试所有 remote 配置", function () {
    cy.$getFormItemInput("remote-by-url").click()
    cy.$getFormItemInput("remote-by-url").type("input")
    cy.contains("area1").click()

    cy.contains("resourceA")
    cy.contains("typeA")

    cy.$getFormItemInput("cascader").click()
    cy.get(".el-cascader-node").contains("hello").should("be.visible").click()
    cy.get(".el-cascader-node").contains("world").should("be.visible").click()
    cy.$getFormItemInput("cascader").should("have.value", "hello / world")
  })
})
