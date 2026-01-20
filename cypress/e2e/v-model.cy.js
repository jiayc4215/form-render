/// <reference types="Cypress" />

function stringify(json) {
  return JSON.stringify(json, null, 2)
}

describe("测试 v-model 示例", function () {
  beforeEach(() => {
    cy.visit("/")
    cy.contains("开始").click()
    cy.$goto("v-model")
  })

  it("基础用例", function () {
    const initState = {
      name: "",
      type: [],
      startDate: "2019-01-01",
      endDate: "2019-01-02",
      region: [],
      date: ["2019-01-01", "2019-01-02"]
    }

    cy.contains(stringify(initState))

    // 初始值不触发校验
    cy.get(".el-form").contains("miss").should("not.exist")

    cy.$getFormItemInput("name").type("111")

    // /**
    //  * 不应该触发其他 form-item 的校验;
    //  * 之前对 form 用深拷贝再赋值给 value 时出过这个问题
    //  */
    cy.get(".el-form").contains("miss").should("not.exist")
    cy.contains(stringify({ ...initState, name: "111" }))

    // // 选择城市
    cy.$getFormItemInput("region").first().click()
    cy.get(".el-select-dropdown__item").contains("shanghai").click()
    // 点击 name 隐藏可能存在的弹出框
    cy.$getFormItemInput("name").click()

    // 修改日期
    cy.$getFormItemInput("date").eq(1).type("{backspace}3")

    // 点击 name 隐藏可能存在的弹出框
    cy.$getFormItemInput("name").click()

    cy.contains("typeA").click()
    cy.contains("resourceA").click()
    cy.$getFormItemInput("desc", "textarea").type("desc")

    cy.contains(
      stringify({
        name: "111",
        type: ["typeA"],
        startDate: "2019-01-01",
        endDate: "2019-01-03",
        region: ["shanghai"],
        date: ["2019-01-01", "2019-01-03"],
        resource: "A",
        desc: "desc"
      })
    )

    cy.contains("reset").click()
    cy.contains(stringify(initState))

    cy.contains("设置名字为小明").click()
    cy.$getFormItemInput("name").should("have.value", "小明")
  })
})
