/// <reference types="Cypress" />

describe("测试 set-options 示例", function () {
  beforeEach(() => {
    cy.visit("/")
    cy.contains("开始").click()
    cy.$goto("set-options")
  })

  it("基础用例", function () {
    cy.$getFormItemInput("select").click({ force: true })

    cy.get(".el-select-dropdown__item").contains("shanghai").should("be.visible")
    cy.get(".el-select-dropdown__item").contains("beijing").should("be.visible")

    cy.get(".el-select-dropdown__item").contains("guangzhou").should("not.exist")
    cy.get(".el-select-dropdown__item").contains("hangzhou").should("not.exist")

    cy.get("button").contains("set").click()

    cy.$getFormItemInput("select").click({ force: true })

    cy.get(".el-select-dropdown__item").contains("shanghai").should("not.exist")
    cy.get(".el-select-dropdown__item").contains("beijing").should("not.exist")

    cy.get(".el-select-dropdown__item").contains("guangzhou").should("be.visible")
    cy.get(".el-select-dropdown__item").contains("hangzhou").should("be.visible")
  })
})
