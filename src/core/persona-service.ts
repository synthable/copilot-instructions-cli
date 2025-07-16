import { promises as fs } from 'fs';
import type { PersonaConfig } from '../types/index.js';
import { parse } from 'jsonc-parser';

/**
 * Validates a persona object.
 * @param persona - The persona object to validate.
 * @returns A result indicating if the persona is valid and which fields are missing or invalid.
 */
export function validatePersona(persona: PersonaConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Field: name
  if (!persona.name || typeof persona.name !== 'string') {
    errors.push('The "name" field is required and must be a non-empty string.');
  }

  // Field: description
  if (
    persona.description !== undefined &&
    (typeof persona.description !== 'string' ||
      persona.description.trim() === '')
  ) {
    errors.push('The "description" field must be a non-empty string.');
  }

  // Field: output
  if (
    persona.output !== undefined &&
    (typeof persona.output !== 'string' || persona.output.trim() === '')
  ) {
    errors.push('The "output" field must be a non-empty string.');
  }

  // Field: modules
  if (!persona.modules) {
    errors.push('The "modules" field is required.');
  } else if (!Array.isArray(persona.modules) || persona.modules.length === 0) {
    errors.push('The "modules" field must be a non-empty array.');
  } else if (
    persona.modules.some(m => typeof m !== 'string' || m.trim() === '')
  ) {
    errors.push('All items in the "modules" array must be non-empty strings.');
  }

  // Field: attributions
  if (
    persona.attributions !== undefined &&
    typeof persona.attributions !== 'boolean'
  ) {
    errors.push('The "attributions" field must be a boolean.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Reads, parses, and validates a persona file.
 * @param filePath - Path to the persona file.
 * @returns ValidationResult { filePath, isValid, errors }
 */
export async function validatePersonaFile(
  filePath: string
): Promise<{ filePath: string; isValid: boolean; errors: string[] }> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const personaConfig: PersonaConfig = parse(fileContent);
    const result = validatePersona(personaConfig);

    if (!result.isValid) {
      return { filePath, isValid: false, errors: result.errors };
    }
    return { filePath, isValid: true, errors: [] };
  } catch (e) {
    const err = e as Error;
    const error = `Failed to read or parse persona ${filePath}: ${err.message}`;
    return { filePath, isValid: false, errors: [error] };
  }
}
