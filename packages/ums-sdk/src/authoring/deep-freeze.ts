/**
 * @file Deep freeze utility for ensuring complete immutability
 * @module authoring/deep-freeze
 */

/**
 * Recursively freezes an object and all its nested properties.
 *
 * This ensures complete immutability at runtime, preventing modifications
 * to both top-level and nested object properties.
 *
 * @param obj - The object to deeply freeze
 * @returns The frozen object (same reference)
 *
 * @example
 * ```typescript
 * const module = deepFreeze({
 *   id: 'test',
 *   metadata: { name: 'Test' }
 * });
 *
 * module.id = 'changed'; // Throws in strict mode
 * module.metadata.name = 'changed'; // Also throws in strict mode
 * ```
 */
export function deepFreeze<T>(obj: T): T {
  // Freeze the object itself
  Object.freeze(obj);

  // Get all property names (including non-enumerable)
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as Record<string, unknown>)[prop];

    // Recursively freeze nested objects
    // Skip if:
    // - value is null or undefined
    // - value is not an object (primitives, functions)
    // - value is already frozen
    if (
      value &&
      typeof value === 'object' &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });

  return obj;
}
