/**
 * Core domain exports for UMS v2.0
 * Organizes exports by functional domain
 */

// Parsing domain - YAML parsing and basic structure validation
export * from './parsing/index.js';

// Validation domain - UMS specification validation
export * from './validation/index.js';

// Resolution domain - Module resolution and dependency management
export * from './resolution/index.js';

// Rendering domain - Markdown rendering and report generation
export * from './rendering/index.js';

// Registry domain - Conflict-aware registry (Phase 2)
export * from './registry/index.js';
