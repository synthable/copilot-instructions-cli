/**
 * Constants for the UMS v2.0 CLI implementation
 */

// ID validation regex for UMS v2.0
// Supports flat IDs (e.g., 'be-concise') and hierarchical IDs (e.g., 'ethics/do-no-harm')
export const ID_REGEX = /^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/;

// Standard directive keys as defined in UMS v2.0 Section 4.1
export const DIRECTIVE_KEYS = [
  'goal',
  'process',
  'constraints',
  'principles',
  'criteria',
  'data',
  'examples',
] as const;

export type DirectiveKey = (typeof DIRECTIVE_KEYS)[number];

// Rendering order for directives as specified in UMS v1.0
export const RENDER_ORDER: DirectiveKey[] = [
  'goal',
  'principles',
  'constraints',
  'process',
  'criteria',
  'data',
  'examples',
];

// Schema version for UMS v2.0
export const UMS_SCHEMA_VERSION = '2.0';

// File extensions
export const MODULE_FILE_EXTENSION = '.module.ts';
export const PERSONA_FILE_EXTENSION = '.persona.ts';

// Directory paths
export const MODULES_ROOT = 'instructions-modules';
export const PERSONAS_ROOT = 'personas';
