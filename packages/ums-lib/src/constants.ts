/**
 * UMS Library Constants
 */

export const MODULES_ROOT = 'instructions-modules';
export const MODULE_FILE_EXTENSION = '.md';

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
  'rule',
] as const;
export type StandardShape = (typeof STANDARD_SHAPES)[number];

// Module ID validation regex
export const ID_REGEX = /^[a-z0-9]+(?:\/[a-z0-9-]+)*$/;

// Standard shape directive specifications
export const STANDARD_SHAPE_SPECS = {
  procedure: {
    required: ['goal', 'process', 'constraints'] as string[],
    optional: ['principles', 'criteria'] as string[],
  },
  specification: {
    required: ['goal', 'principles'] as string[],
    optional: ['constraints', 'criteria'] as string[],
  },
  pattern: {
    required: ['goal', 'principles'] as string[],
    optional: ['constraints', 'criteria'] as string[],
  },
  checklist: {
    required: ['goal', 'criteria'] as string[],
    optional: ['principles', 'constraints'] as string[],
  },
  data: {
    required: ['goal', 'data'] as string[],
    optional: ['principles'] as string[],
  },
  rule: {
    required: ['goal', 'constraints'] as string[],
    optional: ['principles'] as string[],
  },
};
