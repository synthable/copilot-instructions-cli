/**
 * Constants for the UMS v1.0 CLI implementation
 */

// Valid tiers as per UMS v1.0 spec
export const VALID_TIERS = [
  'foundation',
  'principle',
  'technology',
  'execution',
] as const;

export type ValidTier = (typeof VALID_TIERS)[number];

// ID validation regex as specified in UMS v1.0 Section 3.3
export const ID_REGEX =
  /^(foundation|principle|technology|execution)\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)\/[a-z0-9][a-z0-9-]*$/;

// Standard directive keys as defined in UMS v1.0 Section 4.1
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

// Standard shapes as defined in UMS v1.0 Section 2.5
export const STANDARD_SHAPES = {
  specification: {
    required: ['goal', 'constraints'],
    optional: ['principles', 'examples'],
  },
  procedure: {
    required: ['goal', 'process'],
    optional: ['constraints', 'examples'],
  },
  pattern: {
    required: ['goal', 'principles'],
    optional: ['constraints', 'examples'],
  },
  checklist: {
    required: ['goal', 'criteria'],
    optional: ['examples'],
  },
  data: {
    required: ['goal', 'data'],
    optional: ['examples'],
  },
  'procedural-specification': {
    required: ['goal', 'process', 'constraints'],
    optional: ['criteria', 'examples'],
  },
  playbook: {
    required: ['goal', 'process', 'constraints', 'criteria'],
    optional: ['principles', 'examples', 'data'],
  },
} as const;

export type StandardShape = keyof typeof STANDARD_SHAPES;

// Schema version for UMS v1.0
export const UMS_SCHEMA_VERSION = '1.0';

// File extensions
export const MODULE_FILE_EXTENSION = '.module.yml';
export const PERSONA_FILE_EXTENSION = '.persona.yml';

// Directory paths
export const MODULES_ROOT = 'instructions-modules';
export const PERSONAS_ROOT = 'personas';
