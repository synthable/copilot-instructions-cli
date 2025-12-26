/**
 * Build Persona Handler
 *
 * Handles the ums_build_persona MCP tool.
 */

import type { PersonaService } from '../services/persona-service.js';
import type { BuildPersonaInput } from '../schemas/index.js';
import {
  formatBuildResultMarkdown,
  formatBuildResultStructured,
} from '../formatters/index.js';

/**
 * Create a handler for the build-persona tool
 * @param personaService - PersonaService instance
 * @returns Handler function
 */
export function createBuildPersonaHandler(personaService: PersonaService) {
  return async (params: BuildPersonaInput) => {
    const result = await personaService.build(params.personaPath, {
      includeStandard: params.includeStandard,
      emitDeclarations: params.emitDeclarations,
    });

    const text = formatBuildResultMarkdown(result);
    const structuredContent = formatBuildResultStructured(result);

    return {
      content: [{ type: 'text' as const, text }],
      structuredContent,
    };
  };
}
