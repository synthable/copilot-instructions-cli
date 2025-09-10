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

// UMS v1.0 specification constants
export const UMS_SCHEMA_VERSION = '1.0';

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

// Module ID validation regex (UMS v1.0 compliant)
export const MODULE_ID_REGEX =
  /^(foundation|principle|technology|execution)\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*\/[a-z0-9][a-z0-9-]*|[a-z0-9][a-z0-9-]*)$/;

// Standard shape directive specifications (UMS v1.0 compliant)
export const STANDARD_SHAPE_SPECS = {
  procedure: {
    required: ['goal', 'process'] as string[],
    optional: ['examples', 'data'] as string[],
  },
  specification: {
    required: ['goal', 'constraints'] as string[],
    optional: ['examples', 'data'] as string[],
  },
  pattern: {
    required: ['goal', 'principles'] as string[],
    optional: ['constraints', 'examples', 'data'] as string[],
  },
  checklist: {
    required: ['goal', 'criteria'] as string[],
    optional: ['examples', 'data'] as string[],
  },
  data: {
    required: ['goal', 'data'] as string[],
    optional: ['examples'] as string[],
  },
  'procedural-specification': {
    required: ['goal', 'process', 'constraints'] as string[],
    optional: ['examples', 'data'] as string[],
  },
  'pattern-specification': {
    required: ['goal', 'principles', 'constraints'] as string[],
    optional: ['examples', 'data'] as string[],
  },
  playbook: {
    required: ['goal', 'process', 'constraints', 'criteria'] as string[],
    optional: ['principles', 'examples', 'data'] as string[],
  },
};
