describe('Protected signup', () => {
  it('loads the protected form without sending registration emails', () => {
    cy.request('/env.json').then(({ body }) => {
      expect(body.signupsEnabled).to.equal(true)
      expect(body.signupCaptcha.apiKey).to.be.a('string').and.not.be.empty
      expect(body.signupCaptcha.scriptUrl).to.include(
        '.captcha-sdk.awswaf.com/',
      )
    })
    cy.visit('/')
    cy.get('[data-testid=your-email-input]').should('be.visible')
    cy.get('[data-testid=partner-email-input]').should('be.visible')
    cy.contains('Submit').should('not.be.disabled')
    // Real CAPTCHA completion is a manual staging acceptance check.
  })
})
