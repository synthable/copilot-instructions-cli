---
name: 'Vercel Deployment Best Practices'
description: 'A set of rules and processes for deploying applications to Vercel, focusing on performance, environment variables, and caching.'
tags:
  - vercel
  - deployment
  - hosting
  - platform
---

# Vercel Deployment Best Practices

## Primary Directive

You MUST configure Vercel deployments to be secure, performant, and cost-effective by correctly managing environment variables, caching, and build settings.

## Process

1.  **Environment Variables:**
    - All secrets (API keys, database credentials) MUST be stored as Environment Variables in the Vercel project settings.
    - Use the appropriate environment (Production, Preview, Development) for each variable.
    - Do NOT hard-code secrets directly in the source code.
2.  **Caching:**
    - Configure `Cache-Control` headers for static assets and serverless functions to optimize performance and reduce costs.
    - For Next.js applications, leverage Incremental Static Regeneration (ISR) or Static Site Generation (SSG) for pages that do not require real-time data.
3.  **Build Settings:**
    - Ensure the correct Framework Preset (e.g., Next.js, Create React App) is selected in the project settings.
    - Use the "Ignored Build Step" command (`git diff --quiet HEAD^ HEAD .`) to prevent unnecessary builds when only non-application files are changed.
4.  **Previews and Production:**
    - Use Preview Deployments for every pull request to test changes in a production-like environment.
    - The `main` branch MUST be connected to the Production deployment.

## Constraints

- Sensitive environment variables MUST NOT be exposed to the browser. They should only be used in server-side code (e.g., `getServerSideProps` in Next.js).
- The build process MUST NOT contain any commands that require interactive input.
- Do NOT disable Vercel's automatic optimizations (like image optimization) without a specific, justified reason.
layer: null
