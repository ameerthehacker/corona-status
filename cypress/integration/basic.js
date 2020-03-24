/// <reference types="Cypress" />

beforeEach(() => {
  cy.clearLocalStorage();
  cy.visit('/');
});

describe('Basic', () => {
  it('should not break', () => {
    cy.get('[data-cy="brand-name"]').contains('Corona Status');
  });

  it('should show empty state bt default', () => {
    cy.get('[data-cy="empty-state"]').contains(
      'search your state or country to view the status'
    );
  });

  it('should suggest countries', () => {
    cy.get('[data-cy="country-search-input"]').type('Ind');

    cy.get('[data-cy="country-suggestion"]').contains('India');
  });
});
