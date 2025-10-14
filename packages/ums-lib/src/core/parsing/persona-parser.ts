/**
 * UMS v2.0 Persona Parser
 * Handles parsing and basic validation of persona data structures.
 */

import type { Persona } from '../../types/index.js';
import { PersonaParseError } from '../../utils/errors.js';

/**
 * Parses and validates a raw object as a UMS v2.0 persona.
 *
 * This function performs initial structural validation to ensure the object
 * has the required fields to be considered a persona. It does not perform
 * a full validation against the UMS specification.
 *
 * @param obj - The raw object to parse as a persona.
 * @returns The validated persona object.
 * @throws {PersonaParseError} If the object is not a valid persona structure.
 */
export function parsePersonaObject(obj: unknown): Persona {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new PersonaParseError('Persona must be an object.');
  }

  const persona = obj as Persona;

  // Validate required top-level fields
  if (typeof persona.name !== 'string') {
    throw new PersonaParseError(
      'Persona missing or invalid required field: name'
    );
  }
  if (persona.schemaVersion !== '2.0') {
    throw new PersonaParseError(
      `Persona schemaVersion must be "2.0", but found "${persona.schemaVersion}"`
    );
  }
  if (typeof persona.version !== 'string') {
    throw new PersonaParseError(
      'Persona missing or invalid required field: version'
    );
  }
  if (typeof persona.description !== 'string') {
    throw new PersonaParseError(
      'Persona missing or invalid required field: description'
    );
  }
  if (typeof persona.semantic !== 'string') {
    throw new PersonaParseError(
      'Persona missing or invalid required field: semantic'
    );
  }
  if (!Array.isArray(persona.modules)) {
    throw new PersonaParseError(
      'Persona missing or invalid required field: modules'
    );
  }

  // Full validation can be done separately using `validatePersona`
  return persona;
}
