/**
 * Persona Service
 *
 * Thin facade over ums-sdk buildPersona functionality.
 * Provides dependency injection point for handlers.
 */

import {
  buildPersona,
  type BuildResult,
  type BuildOptions,
} from 'ums-sdk';

/**
 * Service for building personas from .persona.ts files
 */
export class PersonaService {
  /**
   * Build a persona from a .persona.ts file
   * @param personaPath - Path to the persona file
   * @param options - Build options
   * @returns Build result with markdown, modules, and metadata
   */
  async build(
    personaPath: string,
    options?: BuildOptions
  ): Promise<BuildResult> {
    return buildPersona(personaPath, options);
  }
}
