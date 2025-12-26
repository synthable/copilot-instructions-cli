/**
 * Zod Input Schemas for MCP Tools
 *
 * Defines validation schemas for all MCP tool inputs.
 * Uses Zod for runtime validation and type inference.
 */

import { z } from 'zod';

/**
 * Schema for ums_build_persona tool input
 */
export const BuildPersonaInputSchema = z
  .object({
    personaPath: z
      .string()
      .min(1, 'Persona path is required')
      .describe('Path to the .persona.ts file to build'),
    includeStandard: z
      .boolean()
      .default(true)
      .describe('Include standard library modules (default: true)'),
    emitDeclarations: z
      .boolean()
      .default(false)
      .describe('Emit TypeScript declaration files (default: false)'),
  })
  .strict();

/**
 * Schema for ums_list_modules tool input
 */
export const ListModulesInputSchema = z
  .object({
    capability: z
      .string()
      .optional()
      .describe('Filter modules by capability (e.g., "reasoning", "coding")'),
    tag: z.string().optional().describe('Filter modules by tag'),
    includeStandard: z
      .boolean()
      .default(true)
      .describe('Include standard library modules (default: true)'),
  })
  .strict();

/**
 * Schema for ums_validate_modules tool input
 */
export const ValidateModulesInputSchema = z
  .object({
    includePersonas: z
      .boolean()
      .default(true)
      .describe('Also validate persona files (default: true)'),
    includeStandard: z
      .boolean()
      .default(true)
      .describe('Include standard library modules (default: true)'),
  })
  .strict();

/**
 * Schema for ums_search_modules tool input
 */
export const SearchModulesInputSchema = z
  .object({
    query: z
      .string()
      .min(1, 'Search query is required')
      .describe(
        'Search query to match against module names, descriptions, and semantic fields'
      ),
    capability: z
      .string()
      .optional()
      .describe('Filter results by capability'),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe('Maximum number of results to return (default: 10)'),
  })
  .strict();

// Type exports inferred from schemas
export type BuildPersonaInput = z.infer<typeof BuildPersonaInputSchema>;
export type ListModulesInput = z.infer<typeof ListModulesInputSchema>;
export type ValidateModulesInput = z.infer<typeof ValidateModulesInputSchema>;
export type SearchModulesInput = z.infer<typeof SearchModulesInputSchema>;
