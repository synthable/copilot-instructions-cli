---
name: 'Preact: State Management with Signals'
description: 'A pattern for managing state in Preact using Signals for fine-grained reactivity, avoiding unnecessary component re-renders.'
tier: technology
layer: null
schema: pattern
---

## Summary

Signals are a state management pattern that provides fine-grained reactivity. Instead of re-rendering an entire component when state changes, Signals allow you to update only the specific parts of the DOM that depend on the reactive value. This results in more efficient and performant applications.

## Core Principles

- **Reactive Values:** A signal is a reactive value that holds a piece of state. It can be read by accessing its `.value` property.
- **Automatic Updates:** When a signal's `.value` is updated, only the components or parts of the DOM that directly use that signal are updated, without re-rendering the entire component.
- **No Re-Renders:** The component function itself does not re-execute on state change, only on prop changes.

## Advantages / Use Cases

- **Performance:** Superior performance compared to `useState` because it avoids the cost of re-rendering the entire component tree.
- **Simplicity:** State can often be defined outside of components, simplifying logic and avoiding prop drilling.
- **Ideal for frequently updated state** that only affects a small part of the UI, such as counters, timers, or input fields.

## Disadvantages / Trade-offs

- **Different Mental Model:** Requires a shift in thinking from the traditional React/Preact hooks model of re-renders.
- **Ecosystem:** While growing, the ecosystem around Signals is less mature than the hooks-based ecosystem.

## Comparison Example

- **`useState` approach (re-renders on every click):**
  ```jsx
  function Counter() {
    console.log('Re-rendering');
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
  }
  ```
- **`signal` approach (renders only once):**
  ```jsx
  import { signal } from '@preact/signals';
  const count = signal(0);
  function Counter() {
    console.log('Rendered ONCE');
    return <button onClick={() => count.value++}>Count: {count}</button>;
  }
  ```
