---
name: 'Cypress Selector Strategies'
description: 'A guide to the best strategies for selecting elements in Cypress tests to create stable and resilient tests.'
tags:
  - testing
  - cypress
  - e2e
  - selectors
layer: null
---

# Cypress Selector Strategies

## Primary Directive

You MUST use selectors that are resilient to change and that clearly express the intent of your tests. The choice of selector is one of the most critical factors in creating stable and maintainable end-to-end tests.

## Process

1.  **Prioritize `data-cy` Attributes:** The best and most resilient selector strategy is to use `data-cy` or `data-testid` attributes. These attributes are specifically for testing and are not tied to the implementation details of your application.
2.  **Use `cy.contains()` for Text:** When you need to select an element based on its text content, use `cy.contains()`. This is often more readable and less brittle than using a CSS selector.
3.  **Avoid Brittle Selectors:** Avoid using selectors that are likely to change, such as CSS classes, element IDs, or complex XPath expressions.
4.  **Chain Commands to Scope Selections:** Use Cypress's command chaining to scope your selections and make your tests more readable. For example, `cy.get('form').find('button').click()`.
5.  **Use the Cypress Selector Playground:** When you are unsure of the best selector to use, use the Cypress Selector Playground to experiment and find a good selector.

## Constraints

- You MUST NOT use selectors that are tied to the visual appearance of your application, as these are likely to change.
- You MUST NOT use overly specific selectors that are likely to break when the structure of the DOM changes.
- You MUST NOT use automatically generated selectors from browser developer tools, as these are often brittle and unreadable.
