/// <reference types="Cypress" />

describe("测试 basic 示例", function () {
  beforeEach(() => {
    cy.visit("/")
    cy.contains("开始").click()
    cy.$goto("base")
  })

  it("基础用例", function () {
    cy.contains("base")
    cy.contains("submit").click()
    cy.contains("miss name")

    cy.$getFormItemInput("name").type("name")

    cy.$getFormItemInput("area").click({ force: true })
    cy.get(".el-select-dropdown__item").contains("area1").click()

    cy.$getFormItemInput("date").click({ multiple: true })
    cy.get(".el-picker-panel").contains("Now").click()

    cy.contains("typeA").click()
    cy.contains("resourceA").click()

    cy.$getFormItemInput("desc", "textarea").type("desc")

    cy.contains("submit").click()
    cy.contains("submit!")
    cy.contains("reset").click()

    cy.$getFormItemInput("name").should("have.value", "")
  })
})
