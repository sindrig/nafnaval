describe('Changing language', () => {
  it('Starts in english and changes languages', () => {
    cy.visit('/')
    cy.contains('.MuiFormGroup-root', 'Girl').should('exist')
    cy.get('.MuiIconButton-label > .MuiSvgIcon-root').click()
    cy.get('[data-testid=i18n-icelandic]').click()
    cy.contains('.MuiFormGroup-root', 'Girl').should('not.exist')
    cy.contains('.MuiFormGroup-root', 'Stúlka').should('exist')
    cy.get('[data-testid=i18n-english]').click()
    cy.contains('.MuiFormGroup-root', 'Girl').should('exist')
    cy.contains('.MuiFormGroup-root', 'Stúlka').should('not.exist')
  })
})
