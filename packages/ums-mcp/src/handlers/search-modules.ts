/**
 * Search Modules Handler
 *
 * Handles the ums_search_modules MCP tool.
 */

import type { ModuleService } from '../services/module-service.js';
import type { SearchModulesInput } from '../schemas/index.js';
import {
  formatSearchResultMarkdown,
  formatSearchResultStructured,
} from '../formatters/index.js';

/**
 * Create a handler for the search-modules tool
 * @param moduleService - ModuleService instance
 * @returns Handler function
 */
export function createSearchModulesHandler(moduleService: ModuleService) {
  return async (params: SearchModulesInput) => {
    const modules = await moduleService.search(params.query, {
      limit: params.limit,
      ...(params.capability && { capability: params.capability }),
    });

    const text = formatSearchResultMarkdown(modules, params.query);
    const structuredContent = formatSearchResultStructured(
      modules,
      params.query
    );

    return {
      content: [{ type: 'text' as const, text }],
      structuredContent,
    };
  };
}
