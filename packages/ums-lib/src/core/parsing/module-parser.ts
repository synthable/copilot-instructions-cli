/**
 * UMS v1.0 Module Parser
 * Handles YAML parsing of module content
 */

import { parse } from 'yaml';
import { validateModule } from '../validation/index.js';
import type { UMSModule } from '../../types/index.js';

// Raw parsed YAML structure before validation
interface RawModuleData {
  id?: unknown;
  version?: unknown;
  schemaVersion?: unknown;
  shape?: unknown;
  meta?: unknown;
  body?: unknown;
  [key: string]: unknown;
}

function isValidRawModuleData(data: unknown): data is RawModuleData {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}

/**
 * Parses and validates a UMS v1.0 module from a YAML content string.
 *
 * The input string must be valid YAML representing a UMS v1.0 module. The function will
 * parse the YAML and validate the resulting object according to the UMS v1.0 specification.
 * If the content is invalid YAML or fails validation, an error will be thrown.
 *
 * @param {string} content - The YAML string containing the UMS module definition.
 * @returns {UMSModule} The validated UMS module object.
 * @throws {Error} If the content is not valid YAML or fails UMS module validation.
 */
export function parseModule(content: string): UMSModule {
  try {
    const parsed: unknown = parse(content);

    if (!isValidRawModuleData(parsed)) {
      throw new Error('Invalid YAML: expected object at root');
    }

    // Validate the module structure
    const validation = validateModule(parsed);
    if (!validation.valid) {
      const errorMessages = validation.errors.map(e => e.message).join('\n');
      throw new Error(`Module validation failed:\n${errorMessages}`);
    }

    // After validation, we know this is a valid UMSModule structure
    return parsed as UMSModule;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse module: ${message}`);
  }
}
