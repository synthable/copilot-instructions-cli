/**
 * Module List Formatter
 *
 * Formats ModuleInfo[] from ums-sdk to markdown for MCP responses.
 */

import type { ModuleInfo } from 'ums-sdk';

/**
 * Format module list as markdown for human-readable output
 */
export function formatModuleListMarkdown(modules: ModuleInfo[]): string {
  if (modules.length === 0) {
    return 'No modules found matching the criteria.';
  }

  const lines: string[] = [`# Available Modules (${modules.length})`, ''];

  for (const module of modules) {
    lines.push(`## ${module.name}`);
    lines.push(`- **ID**: ${module.id}`);
    lines.push(`- **Version**: ${module.version}`);
    lines.push(`- **Source**: ${module.source}`);
    lines.push(`- **Description**: ${module.description}`);
    if (module.capabilities.length > 0) {
      lines.push(`- **Capabilities**: ${module.capabilities.join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format module list as structured output for programmatic access
 */
export function formatModuleListStructured(modules: ModuleInfo[]) {
  return {
    success: true,
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
