/**
 * UMS v1.0 Persona Parser
 * Handles YAML parsing of persona content
 */

import { parse } from 'yaml';
import { validatePersona } from '../validation/index.js';
import type { UMSPersona, ModuleGroup } from '../../types/index.js';

// Raw parsed YAML structure before validation
interface RawPersonaData {
  name?: unknown;
  description?: unknown;
  semantic?: unknown;
  role?: unknown;
  attribution?: unknown;
  moduleGroups?: unknown;
  [key: string]: unknown;
}

function isValidRawPersonaData(data: unknown): data is RawPersonaData {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}

/**
 * Parses and validates a UMS v1.0 persona from a YAML content string.
 *
 * The YAML content must define a persona object with the following structure:
 *
 * ```yaml
 * name: string                # Required. The persona's name.
 * version: string             # Required. The persona's version.
 * schemaVersion: string       # Required. The UMS schema version (e.g., "1.0").
 * description: string         # Required. Description of the persona.
 * semantic: string            # Required. Semantic meaning or type.
 * identity: string            # Required. Unique identity string.
 * attribution: boolean        # Optional. Whether attribution is required.
 * moduleGroups:               # Required. Array of module group objects.
 *   - ...                     # ModuleGroup structure as defined in UMS spec.
 * ```
 *
 * @param {string} content - The YAML string representing a UMS v1.0 persona.
 * @returns {UMSPersona} The validated persona object.
 * @throws {Error} If the YAML is invalid, or if the persona fails validation.
 */
export function parsePersona(content: string): UMSPersona {
  try {
    const parsed: unknown = parse(content);

    if (!isValidRawPersonaData(parsed)) {
      throw new Error('Invalid YAML: expected object at root');
    }

    // Validate the persona structure
    const validation = validatePersona(parsed);
    if (!validation.valid) {
      const errorMessages = validation.errors.map(e => e.message).join('\n');
      throw new Error(`Persona validation failed:\n${errorMessages}`);
    }

    // Return the validated persona with proper typing
    const validatedPersona: UMSPersona = {
      name: parsed.name as string,
      version: parsed.version as string,
      schemaVersion: parsed.schemaVersion as string,
      description: parsed.description as string,
      semantic: parsed.semantic as string,
      identity: parsed.identity as string,
      ...(parsed.attribution !== undefined && {
        attribution: parsed.attribution as boolean,
      }),
      moduleGroups: parsed.moduleGroups as ModuleGroup[],
    };

    return validatedPersona;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse persona: ${message}`);
  }
}
