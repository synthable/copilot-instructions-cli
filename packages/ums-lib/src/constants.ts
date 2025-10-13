/**
 * UMS Library Constants
 */

export const MODULES_ROOT = 'instructions-modules';
export const MODULE_FILE_EXTENSION = '.module.yml';

// Default render order for directives
export const RENDER_ORDER = [
  'goal',
  'process',
  'constraints',
  'principles',
  'criteria',
  'data',
  'examples',
] as const;

export type DirectiveKey = (typeof RENDER_ORDER)[number];

// UMS v2.0 specification constants
export const UMS_SCHEMA_VERSION = '2.0';

// Valid tiers for modules
export const VALID_TIERS = [
  'foundation',
  'principle',
  'technology',
  'execution',
] as const;
export type ValidTier = (typeof VALID_TIERS)[number];

// Standard shapes
export const STANDARD_SHAPES = [
  'procedure',
  'specification',
  'pattern',
  'checklist',
  'data',
  'procedural-specification',
  'pattern-specification',
  'playbook',
] as const;
export type StandardShape = (typeof STANDARD_SHAPES)[number];

// Module ID validation regex (UMS v2.0 compliant)
export const MODULE_ID_REGEX =
  /^(foundation|principle|technology|execution)\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*\/[a-z0-9][a-z0-9-]*|[a-z0-9][a-z0-9-]*)$/;

// Standard shape directive specifications (UMS v2.0 compliant)
export const STANDARD_SHAPE_SPECS = {
  procedure: {
    required: ['goal', 'process'],
    optional: ['examples', 'data'],
  },
  specification: {
    required: ['goal', 'constraints'],
    optional: ['examples', 'data'],
  },
  pattern: {
    required: ['goal', 'principles'],
    optional: ['constraints', 'examples', 'data'],
  },
  checklist: {
    required: ['goal', 'criteria'],
    optional: ['examples', 'data'],
  },
  data: {
    required: ['goal', 'data'],
    optional: ['examples'],
  },
  'procedural-specification': {
    required: ['goal', 'process', 'constraints'],
    optional: ['examples', 'data'],
  },
  'pattern-specification': {
    required: ['goal', 'principles', 'constraints'],
    optional: ['examples', 'data'],
  },
  playbook: {
    required: ['goal', 'process', 'constraints', 'criteria'],
    optional: ['principles', 'examples', 'data'],
  },
} as const;
