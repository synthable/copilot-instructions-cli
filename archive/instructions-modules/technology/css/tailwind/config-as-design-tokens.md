---
name: 'TailwindCSS: Config as Design Tokens'
description: "A specification for using the tailwind.config.js file as a single source of truth for a project's design tokens."
tier: technology
layer: null
schema: specification
---

## Core Concept

The `tailwind.config.js` file MUST be treated as the canonical manifest for all design tokens in the application, such as colors, fonts, and spacing. This ensures a consistent and maintainable design system.

## Key Rules

- You MUST NOT overwrite the default Tailwind theme. You MUST use `theme.extend` to add project-specific tokens.
- Design tokens MUST be organized into a logical structure, using nested objects for clarity (e.g., `colors.brand.primary`).

## Best Practices

- A well-structured config file serves as the single source of truth for the UI.
  ```javascript
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        colors: {
          brand: {
            primary: '#0055FF',
            secondary: '#7A00E5',
          },
          ui: {
            background: '#F8F9FA',
            surface: '#FFFFFF',
          },
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
      },
    },
  };
  ```

## Anti-Patterns

- Using arbitrary values in your markup (e.g., `class="bg-[#123456]"`). All colors and values should be defined as tokens in the config file.
- Overwriting the entire default theme, which removes access to Tailwind's useful default palette and scales.
