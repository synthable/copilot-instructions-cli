/**
 * List Modules Handler
 *
 * Handles the ums_list_modules MCP tool.
 */

import type { ModuleService } from '../services/module-service.js';
import type { ListModulesInput } from '../schemas/index.js';
import {
  formatModuleListMarkdown,
  formatModuleListStructured,
} from '../formatters/index.js';

/**
 * Create a handler for the list-modules tool
 * @param moduleService - ModuleService instance
 * @returns Handler function
 */
export function createListModulesHandler(moduleService: ModuleService) {
  return async (params: ListModulesInput) => {
    const modules = await moduleService.list({
      includeStandard: params.includeStandard,
      ...(params.capability && { capability: params.capability }),
      ...(params.tag && { tag: params.tag }),
    });

    const text = formatModuleListMarkdown(modules);
    const structuredContent = formatModuleListStructured(modules);

    return {
      content: [{ type: 'text' as const, text }],
      structuredContent,
    };
  };
}
