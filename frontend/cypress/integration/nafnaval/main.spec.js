describe('Create and finish selection', () => {
  beforeEach(() => {
    cy.server()
    cy.route('PUT', '**/state/').as('createState')
    cy.visit('/')
    cy.get('[data-testid=your-email-input]').type('sindri@nafnaval.is')
    cy.get('[data-testid=partner-email-input]').type('gerdur@nafnaval.is')
    cy.get('[data-testid=male-radio]').click()
    cy.contains('Submit').click()
    cy.wait('@createState').then(
      ({
        response: {
          body: { stateId },
        },
      }) => {
        cy.route('POST', `**/state/${stateId}`).as('saveState')
      },
    )
  })

  it('Selects a few names and saves them', async () => {
    // Select 25 and reject 25 names
    for (let i = 0; i < 25; i++) {
      cy.get('.selection-select').click()
      cy.get('.selection-reject').click()
    }

    // Maybe skip this block
    cy.contains('Save').click()
    cy.wait('@saveState')
    cy.contains('Save').should('not.exist')

    cy.get('.material-icons').click()
    cy.get('[data-testid=menu-view-selected]').click()
    cy.get('.listitem-name').should('have.length', 25)
    cy.get('.MuiListItemSecondaryAction-root').first().click()
    cy.contains('Reject').click()
    cy.get('.MuiListItemSecondaryAction-root').first().click()
    cy.contains('Remove from list').click()
    cy.get('.listitem-name').should('have.length', 23)

    cy.contains('Save').click()
    cy.wait('@saveState')
    cy.contains('Save').should('not.exist')
  })
})
