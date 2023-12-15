/* eslint-disable no-undef */
describe('Greeting テスト', () => {
  it('Greetingページに移動し動作することを確認', () => {
    cy.visit('http://localhost:3000/')
    cy.url().should('include', 'localhost')
    cy.get('.greeting-input').type('太郎')
    cy.get('.greeting-button').click()
    cy.get('.greeting-body').should('include.text', 'こんにちは！太郎さん！')
  })

  it('Greetingページにて名前を入力しないでボタンを押下した時に、エラーメッセージが表示されることを確認', () => {
    cy.visit('http://localhost:3000/')
    cy.url().should('include', 'localhost')
    cy.get('.greeting-button').click()
    cy.get('.greeting-error').should('include.text', '名前が空です！')
  })
})
