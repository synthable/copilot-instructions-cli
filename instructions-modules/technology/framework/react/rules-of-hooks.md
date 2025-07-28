---
tier: technology
name: 'React: Rules of Hooks'
description: 'The two fundamental rules for using React Hooks correctly.'
schema: specification
layer: null
---

## Core Concept

Hooks are functions that let you “hook into” React state and lifecycle features from function components.

## Key Rules

- **Only Call Hooks at the Top Level.** Do not call Hooks inside loops, conditions, or nested functions. This ensures that Hooks are called in the same order each time a component renders.
- **Only Call Hooks from React Functions.** Call Hooks from React function components or from custom Hooks. Do not call them from regular JavaScript functions.

## Best Practices

- Use the `eslint-plugin-react-hooks` to enforce these rules automatically.
- Name your custom Hooks starting with `use` (e.g., `useUserData`).

## Anti-Patterns

- Calling `useState` inside an `if` statement.
- Using `useEffect` inside a `for` loop.
- Calling any Hook from a class component's lifecycle method.
