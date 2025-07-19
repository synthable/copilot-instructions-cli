---
name: 'React State Management Decisions'
description: 'A decision-tree module for choosing between useState, useReducer, useContext, and external libraries.'
tags:
  - react
  - state-management
  - hooks
  - decision-tree
layer: null
---

# React State Management Decisions

## Primary Directive

You MUST choose the appropriate state management tool for the job based on the complexity and scope of the state, following this decision tree.

## Process

1.  **Is the state simple and local to a single component?**
    - **Yes:** Use `useState`. This is the default and simplest choice.
    - **No:** Proceed to the next question.
2.  **Is the state complex (e.g., a nested object with multiple fields) OR does the next state depend on the previous one?**
    - **Yes:** Use `useReducer`. It is better suited for managing complex state transitions and can improve performance by passing a stable `dispatch` function down.
    - **No:** Proceed to the next question.
3.  **Does the state need to be shared by multiple components that are not direct parent/child (i.e., to avoid "prop drilling")?**
    - **Yes:** Use `useContext` combined with `useState` or `useReducer`. The context provides the state to the component tree, while the hook manages the state itself.
    - **No:** `useState` or `useReducer` is likely sufficient.
4.  **Does the application have very complex global state, require advanced features like caching or selectors, or need to interact with server state in a sophisticated way (e.g., fetching, caching, optimistic updates)?**
    - **Yes:** Consider a dedicated external library.
      - For client state: `Zustand` or `Redux Toolkit`.
      - For server state: `React Query` or `SWR`.

## Constraints

- Do NOT use `useContext` for state that is only needed by a few, closely-related components; passing props (prop drilling) is often simpler and more explicit in these cases.
- Do NOT introduce an external state management library before determining that React's built-in hooks are insufficient for the task.
- Always start with the simplest appropriate tool (`useState`) and refactor to more complex tools only when the application's needs justify it.
