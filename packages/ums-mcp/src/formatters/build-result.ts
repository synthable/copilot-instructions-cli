/**
 * Build Result Formatter
 *
 * Formats BuildResult from ums-sdk to markdown for MCP responses.
 */

import type { BuildResult } from 'ums-sdk';

/**
 * Format build result as markdown for human-readable output
 */
export function formatBuildResultMarkdown(result: BuildResult): string {
  const lines: string[] = [
    `# Build Result: ${result.persona.name}`,
    '',
    `**Version**: ${result.persona.version}`,
    `**Modules**: ${result.modules.length}`,
    `**Warnings**: ${result.warnings.length}`,
    '',
  ];

  if (result.warnings.length > 0) {
    lines.push('## Warnings', '');
    for (const warning of result.warnings) {
      lines.push(`- ${warning}`);
    }
    lines.push('');
  }

  lines.push('## Modules Included', '');
  for (const module of result.modules) {
    lines.push(
      `- **${module.metadata.name}** (${module.id}) v${module.version}`
    );
  }
  lines.push('');

  lines.push('## Generated Markdown', '');
  lines.push('```markdown');
  lines.push(result.markdown.slice(0, 2000)); // Truncate for display
  if (result.markdown.length > 2000) {
    lines.push(`... (truncated, ${result.markdown.length} total characters)`);
  }
  lines.push('```');

  return lines.join('\n');
}

/**
 * Format build result as structured output for programmatic access
 */
export function formatBuildResultStructured(result: BuildResult) {
  return {
    success: true,
    persona: {
      id: result.persona.id,
      name: result.persona.name,
      version: result.persona.version,
      description: result.persona.description,
    },
    modulesCount: result.modules.length,
    modules: result.modules.map(m => ({
      id: m.id,
      name: m.metadata.name,
      version: m.version,
    })),
    markdownLength: result.markdown.length,
    warnings: result.warnings,
    buildReport: {
      personaDigest: result.buildReport.personaDigest,
      buildTimestamp: result.buildReport.buildTimestamp,
    },
  };
}
