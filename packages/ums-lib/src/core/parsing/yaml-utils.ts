/**
 * YAML parsing utilities for UMS v1.0
 * Common utilities for handling YAML content
 */

import { parse } from 'yaml';

/**
 * Safely parses YAML content and validates basic structure
 * @param content - YAML string to parse
 * @returns Parsed object
 * @throws Error if YAML is invalid or not an object
 */
export function parseYaml(content: string): Record<string, unknown> {
  try {
    const parsed: unknown = parse(content);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Invalid YAML: expected object at root');
    }

    return parsed as Record<string, unknown>;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse YAML: ${message}`);
  }
}

/**
 * Type guard to check if unknown data is a valid object
 */
export function isValidObject(data: unknown): data is Record<string, unknown> {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}
