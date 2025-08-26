---
name: 'Preact: React Ecosystem Compatibility'
description: 'A procedure for using preact/compat to leverage the vast React ecosystem within a Preact application.'
tier: technology
layer: null
schema: procedure
---

## Primary Directive

To use libraries from the React ecosystem in a Preact project, you MUST configure a path alias in your `vite.config.ts` to point `react` and `react-dom` imports to `preact/compat`.

## Process

1.  **Open `vite.config.ts`:** Locate and open your Vite configuration file.
2.  **Add the `resolve` Key:** Inside the `defineConfig` object, add a `resolve` key if one does not already exist.
3.  **Configure the `alias` Object:** Within the `resolve` object, add an `alias` object.
4.  **Set the Aliases:** The `alias` object MUST contain two key-value pairs:
    - `'react': 'preact/compat'`
    - `'react-dom': 'preact/compat'`

## Constraints

- This alias MUST be in place before attempting to install and use a React-specific library.
- You must be aware that `preact/compat` adds a small amount of overhead to your bundle size, which is the trade-off for gaining access to the React ecosystem.
