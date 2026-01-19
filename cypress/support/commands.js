// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// TODO: 补充 ts 类型声明
// @return Cypress.Chainable<JQuery<HTMLInputElement>>
Cypress.Commands.add("$getFormItemInput", (label, el = "input") => cy.contains(".el-form-item", label).find(el))
Cypress.Commands.add("$goto", demo =>
  cy
    .get(".VPSidebar")
    .contains(".VPLink", RegExp("^" + demo + "$"))
    .click()
)
