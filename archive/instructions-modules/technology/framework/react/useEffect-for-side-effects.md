---
name: 'React: Handling Side Effects with useEffect'
description: 'A specification for using the useEffect hook to manage side effects, dependencies, and cleanup.'
tier: technology
schema: specification
layer: null
---

## Core Concept

The `useEffect` hook is the tool for synchronizing a React component with an external system, such as a network request, a browser DOM API, or a third-party library.

## Key Rules

- The function passed to `useEffect` (the "effect") runs after the component has rendered to the screen.
- The second argument to `useEffect` is a dependency array. The effect will only re-run if one of the values in this array has changed since the last render.
- An empty dependency array (`[]`) means the effect runs exactly once, after the initial render.
- If the dependency array is omitted entirely, the effect will run after _every single render_, which is usually undesirable and can cause performance issues.

## Best Practices

- **Always Specify a Dependency Array:** Every `useEffect` call MUST include a dependency array to prevent it from running on every render.
- **Include All Dependencies:** The dependency array MUST include every value from the component scope (props, state, functions) that is used inside the effect function. The `eslint-plugin-react-hooks` `exhaustive-deps` rule should be enabled to enforce this.
- **Return a Cleanup Function:** If the effect sets up a subscription, timer, or event listener, it MUST return a cleanup function. React will execute this function before the component unmounts and before the effect re-runs to prevent memory leaks.

## Anti-Patterns

- **Omitting Dependencies:** Intentionally leaving a value out of the dependency array to prevent the effect from re-running. This is a common source of bugs where the effect references stale data.
- **Using `useEffect` for Event Handling:** Do not use `useEffect` to handle user events. User interactions should be handled by regular event handler functions (e.g., `onClick`, `onSubmit`).
- **Fetching Data Without Cleanup:** When fetching data, if the component unmounts before the request finishes, attempting to set state will cause an error. The cleanup function should be used to ignore the result of an in-flight request.
