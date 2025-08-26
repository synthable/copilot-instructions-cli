---
name: 'Vite: Vendor Chunking for Caching'
description: "A pattern for optimizing production builds by splitting node_modules dependencies into a separate 'vendor' chunk to improve browser caching."
tier: technology
layer: null
schema: pattern
---

## Summary

Vendor chunking is a build optimization strategy where all third-party dependencies from `node_modules` are bundled into a single, separate JavaScript file (a "chunk"). Because vendor code changes far less frequently than application code, this allows browsers to cache the large vendor chunk for long periods, improving subsequent page load times.

## Core Principles

- **Code Separation:** The pattern separates third-party library code (vendor) from the application's own source code.
- **Caching Strategy:** It leverages long-term browser caching for vendor code, which changes infrequently, while allowing application code to be updated with every deployment.

## Advantages / Use Cases

- **Improved Caching:** When you deploy a change to your application, users only need to re-download the small, changed application chunk. The large vendor chunk remains cached in their browser.
- **Faster Subsequent Loads:** This leads to significantly faster load times for returning visitors after the first visit.

## Disadvantages / Trade-offs

- **Initial Load Time:** Can slightly increase the initial page load time as the browser may need to make two parallel requests for JavaScript instead of one. This is generally a worthwhile trade-off.
- **Configuration Complexity:** Requires adding `manualChunks` logic to the `rollupOptions` in your `vite.config.ts` file.

## Implementation Example

```typescript
// vite.config.ts
export default defineConfig({
  // ...
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
```
