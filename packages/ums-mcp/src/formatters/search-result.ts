/**
 * Search Result Formatter
 *
 * Formats search results to markdown for MCP responses.
 */

import type { ModuleInfo } from 'ums-sdk';
import { formatModuleListMarkdown } from './module-list.js';

/**
 * Format search results as markdown for human-readable output
 */
export function formatSearchResultMarkdown(
  modules: ModuleInfo[],
  query: string
): string {
  if (modules.length === 0) {
    return `No modules found matching "${query}".`;
  }

  return formatModuleListMarkdown(modules);
}

/**
 * Format search results as structured output for programmatic access
 */
export function formatSearchResultStructured(
  modules: ModuleInfo[],
  query: string
) {
  return {
    success: true,
    query,
    count: modules.length,
    modules: modules.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description,
      version: m.version,
      capabilities: m.capabilities,
      source: m.source,
    })),
  };
}
