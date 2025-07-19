---
name: 'Cypress Custom Commands'
description: 'A guide to creating and using custom commands in Cypress to promote reusable and readable test code.'
tags:
  - testing
  - cypress
  - e2e
  - custom-commands
---

# Cypress Custom Commands

## Primary Directive

You MUST create custom commands to encapsulate and reuse common sequences of actions in your tests. Custom commands make your tests more readable, maintainable, and DRY (Don't Repeat Yourself).

## Process

1.  **Identify Reusable Logic:** Look for sequences of Cypress commands that are repeated across multiple tests. This is a good indication that you should create a custom command.
2.  **Add a New Command in `cypress/support/commands.js`:** Use `Cypress.Commands.add()` to define a new custom command. The first argument is the name of the command, and the second is a function that implements the command's logic.
3.  **Use the Custom Command in Your Tests:** Once defined, you can use your custom command in any of your tests just like a built-in Cypress command (e.g., `cy.login()`).
4.  **Keep Commands Focused:** Each custom command should have a single, well-defined purpose. Avoid creating large, monolithic commands that do too many things.
5.  **Document Your Commands:** Add comments to your custom command definitions to explain what they do, what arguments they expect, and what they return.

## Constraints

- You MUST NOT create a custom command for every single interaction. Only create commands for logic that is truly reusable.
- You MUST NOT create custom commands that hide the intent of your tests. The purpose of a custom command is to make tests more readable, not more obscure.
- You MUST NOT create custom commands that contain assertions. Assertions should be made in the test itself, not in the custom command.
layer: null
