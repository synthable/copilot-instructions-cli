---
name: 'React Component Best Practices'
description: 'Rules for component composition, state management, and props to create maintainable and performant React applications.'
tags:
  - react
  - components
  - best-practices
  - state-management
---

# React Component Best Practices

## Primary Directive

You MUST build React components that are small, reusable, and follow best practices for composition, state, and props.

## Process

1.  **Component Composition:** Break down complex UIs into small, single-responsibility components. Use composition (passing components as props, e.g., `props.children`) to build complex UIs from simpler ones.
2.  **State Management:**
    - Lift state up to the nearest common ancestor only when multiple components need to share it.
    - Use the `useState` hook for simple, local component state.
    - Do not mutate state or props directly. Always use the setter function provided by `useState` or pass new props.
3.  **Props:**
    - Use TypeScript or `PropTypes` to validate the types of props a component receives.
    - Pass down only the necessary props to a component to avoid unnecessary re-renders.
    - A component MUST treat its props as immutable.
4.  **Keys:** When rendering a list of components, each component MUST have a unique and stable `key` prop. The key should be a unique identifier from the data (e.g., an ID), not the array index.

## Constraints

- Do NOT create large, monolithic components that handle many different responsibilities.
- Do NOT use array indexes as keys for lists if the list's order can change, as this can lead to bugs and performance issues.
- State should be co-located with the components that use it as much as possible. Avoid placing all state at the top level of the application.
layer: null
