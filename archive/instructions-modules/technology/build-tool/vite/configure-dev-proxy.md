---
name: 'Vite: Configuring a Development Server Proxy'
description: 'A procedure for setting up a proxy in vite.config.ts to solve CORS issues during local development.'
tier: technology
layer: null
schema: procedure
---

## Primary Directive

To avoid Cross-Origin Resource Sharing (CORS) errors during local development, you MUST configure a proxy in your `vite.config.ts` file to route API requests from the Vite dev server to your backend server.

## Process

1.  **Open `vite.config.ts`:** Locate and open your Vite configuration file.
2.  **Add the `server` Key:** Inside the `defineConfig` object, add a `server` key if one does not already exist.
3.  **Configure the `proxy` Object:** Within the `server` object, add a `proxy` object. For each path you want to proxy (e.g., `/api`), create a key.
4.  **Set Proxy Options:** The value for the path key MUST be an object with at least the following properties:
    - `target`: The origin of your backend API server (e.g., `http://localhost:8080`).
    - `changeOrigin`: Set to `true`.
    - `rewrite`: A function that removes the proxy prefix from the path (e.g., `(path) => path.replace(/^\/api/, '')`).

## Constraints

- This proxy configuration is for development only and MUST NOT be relied upon for production builds.
- The `target` URL must be the correct address of your running backend server.
