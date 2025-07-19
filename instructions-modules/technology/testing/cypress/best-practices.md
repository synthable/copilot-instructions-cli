---
name: 'Cypress Best Practices'
description: 'A guide to best practices for writing reliable, maintainable, and effective end-to-end tests with Cypress.'
tags:
  - testing
  - cypress
  - e2e
  - best-practices
---

# Cypress Best Practices

## Primary Directive

You MUST write end-to-end (E2E) tests that are stable, readable, and focused on user workflows. Cypress tests should simulate real user interactions and provide confidence that the application is working as expected from the user's perspective.

## Process

1.  **Test User Workflows, Not Pages:** Structure your tests around user stories and critical user paths. A good E2E test should follow a user as they accomplish a goal in your application.
2.  **Use `data-cy` Attributes for Selectors:** The most resilient way to select elements is to use `data-cy` (or `data-testid`) attributes. This decouples your tests from the implementation details of your CSS and JavaScript.
3.  **Use `cy.intercept()` for Network Requests:** Use `cy.intercept()` to stub and spy on network requests. This allows you to control the data your application receives and to test edge cases without relying on a live backend.
4.  **Avoid `cy.wait()` with a Fixed Time:** Using `cy.wait(1000)` is an anti-pattern. Instead, wait for specific events to occur, such as a network request to complete or an element to become visible.
5.  **Organize Tests with `describe` and `it`:** Use `describe` to group tests for a specific feature or workflow. Use `it` to describe the specific behavior being tested.

## Constraints

- You MUST NOT write tests that are overly long or complex. Break down complex workflows into smaller, more manageable tests.
- You MUST NOT rely on CSS classes or element IDs for selectors, as these are subject to change. Use `data-cy` attributes instead.
- You MUST NOT test functionality that is already covered by unit or integration tests. E2E tests should focus on the interactions between different parts of your system.
layer: null
