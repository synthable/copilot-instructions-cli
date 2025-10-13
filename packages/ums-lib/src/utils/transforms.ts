/**
 * @file Transformation utilities for UMS v2.0.
 */

/**
 * Transforms a UMS module ID into the expected TypeScript named export.
 * The transformation logic takes the last segment of the module ID
 * (split by '/') and converts it from kebab-case to camelCase.
 *
 * @param moduleId - The UMS module ID (e.g., "principle/testing/test-driven-development").
 * @returns The expected camelCase export name (e.g., "testDrivenDevelopment").
 * @see {@link file://./../../../docs/ums-v2-lib-implementation.md#33-export-name-transformation}
 *
 * @example
 * // "error-handling" → "errorHandling"
 * moduleIdToExportName("error-handling");
 *
 * @example
 * // "principle/testing/test-driven-development" → "testDrivenDevelopment"
 * moduleIdToExportName("principle/testing/test-driven-development");
 *
 * @example
 * // "foundation/ethics/do-no-harm" → "doNoHarm"
 * moduleIdToExportName("foundation/ethics/do-no-harm");
 */
export function moduleIdToExportName(moduleId: string): string {
  // Validate input
  if (!moduleId || moduleId.trim().length === 0) {
    throw new Error('Module ID cannot be empty');
  }

  // Get the final segment after the last '/'.
  // If no '/', the whole string is the final segment.
  const finalSegment = moduleId.includes('/')
    ? moduleId.substring(moduleId.lastIndexOf('/') + 1)
    : moduleId;

  // Additional validation: final segment should not be empty
  if (finalSegment.length === 0) {
    throw new Error(`Invalid module ID format: ${moduleId}`);
  }

  // Transform kebab-case to camelCase.
  return finalSegment
    .split('-')
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join('');
}
