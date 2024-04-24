describe('Currency Conversion', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.get('[data-cy="input-amount"]').as('inputAmount');
    cy.get('[data-cy="input-currency"]').as('inputCurrency');
    cy.get('[data-cy="output-amount"]').as('outputAmount');
    cy.get('[data-cy="output-currency"]').as('outputCurrency');
  });

  const typeAndSelectCurrencies = (amount: string, inputCurrency: string, outputCurrency: string) => {
    cy.get('@inputAmount').type(amount);
    cy.get('@inputCurrency').select(inputCurrency);
    cy.get('@outputCurrency').select(outputCurrency);
  };

  it('currency conversion form is visible', () => {
    cy.get('@inputAmount').should('be.visible');
    cy.get('@inputCurrency').should('be.visible');
    cy.get('@outputAmount').should('be.visible');
    cy.get('@outputCurrency').should('be.visible');
  });

  it('user can input values and select currencies for conversion', () => {
    typeAndSelectCurrencies('1000', 'USD', 'EUR');
    cy.get('@outputAmount').should('not.have.value', '0');
  });

  it('user can switch input and ouput values', () => {
    typeAndSelectCurrencies('1000', 'USD', 'EUR');
    cy.get('@outputAmount').invoke('val').then((value) => {
      if (value) {
        cy.get('[data-cy="inout-switch"]').click();
        cy.get('@inputAmount').should('have.value', value);
      } else {
        throw new Error('output value was not valid');
      }
    });
  });

  it('displays the conversion history', () => {
    typeAndSelectCurrencies('1000', 'USD', 'EUR');
    cy.get('[data-cy="history-entry"]').should('have.length.at.least', 1);
  });

  it('clears the history when the clear button is clicked', () => {
    typeAndSelectCurrencies('1000', 'USD', 'EUR');
    cy.get('[data-cy="history-entry"]').should('have.length', 1);
    cy.get('[data-cy="clear-history"]').click();
    cy.get('[data-cy="history-entry"]').should('have.length', 0);
  });
});
