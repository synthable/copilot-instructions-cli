/**
 * UMS MCP Server Implementation
 *
 * MCP server for UMS (Unified Module System) - provides AI assistants
 * with module discovery, persona building, and validation capabilities.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  buildPersona,
  validateAll,
  listModules,
  type BuildResult,
  type ValidationReport,
  type ModuleInfo,
} from 'ums-sdk';

// ===== Zod Schemas for Tool Inputs =====

const BuildPersonaInputSchema = z
  .object({
    personaPath: z
      .string()
      .min(1, 'Persona path is required')
      .describe('Path to the .persona.ts file to build'),
    includeStandard: z
      .boolean()
      .default(true)
      .describe('Include standard library modules (default: true)'),
    emitDeclarations: z
      .boolean()
      .default(false)
      .describe('Emit TypeScript declaration files (default: false)'),
  })
  .strict();

const ListModulesInputSchema = z
  .object({
    capability: z
      .string()
      .optional()
      .describe('Filter modules by capability (e.g., "reasoning", "coding")'),
    tag: z.string().optional().describe('Filter modules by tag'),
    includeStandard: z
      .boolean()
      .default(true)
      .describe('Include standard library modules (default: true)'),
  })
  .strict();

const ValidateModulesInputSchema = z
  .object({
    includePersonas: z
      .boolean()
      .default(true)
      .describe('Also validate persona files (default: true)'),
    includeStandard: z
      .boolean()
      .default(true)
      .describe('Include standard library modules (default: true)'),
  })
  .strict();

const SearchModulesInputSchema = z
  .object({
    query: z
      .string()
      .min(1, 'Search query is required')
      .describe(
        'Search query to match against module names, descriptions, and semantic fields'
      ),
    capability: z
      .string()
      .optional()
      .describe('Filter results by capability'),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe('Maximum number of results to return (default: 10)'),
  })
  .strict();

// ===== Type Definitions =====

type BuildPersonaInput = z.infer<typeof BuildPersonaInputSchema>;
type ListModulesInput = z.infer<typeof ListModulesInputSchema>;
type ValidateModulesInput = z.infer<typeof ValidateModulesInputSchema>;
type SearchModulesInput = z.infer<typeof SearchModulesInputSchema>;

// ===== Helper Functions =====

/**
 * Format build result as markdown for human-readable output
 */
function formatBuildResultMarkdown(result: BuildResult): string {
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
    lines.push(`- **${module.metadata.name}** (${module.id}) v${module.version}`);
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
 * Format module list as markdown
 */
function formatModuleListMarkdown(modules: ModuleInfo[]): string {
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
 * Format validation report as markdown
 */
function formatValidationReportMarkdown(report: ValidationReport): string {
  const lines: string[] = ['# Validation Report', ''];

  lines.push('## Summary');
  lines.push(`- **Total Modules**: ${report.totalModules}`);
  lines.push(`- **Valid Modules**: ${report.validModules}`);
  lines.push(
    `- **Invalid Modules**: ${report.totalModules - report.validModules}`
  );

  if (report.totalPersonas !== undefined) {
    lines.push(`- **Total Personas**: ${report.totalPersonas}`);
    lines.push(`- **Valid Personas**: ${report.validPersonas}`);
  }
  lines.push('');

  if (report.errors.size > 0) {
    lines.push('## Errors', '');
    for (const [id, errors] of report.errors) {
      lines.push(`### ${id}`);
      for (const error of errors) {
        lines.push(`- ${error.message}`);
      }
      lines.push('');
    }
  }

  if (report.warnings.size > 0) {
    lines.push('## Warnings', '');
    for (const [id, warnings] of report.warnings) {
      lines.push(`### ${id}`);
      for (const warning of warnings) {
        lines.push(`- ${warning.message}`);
      }
      lines.push('');
    }
  }

  if (report.errors.size === 0 && report.warnings.size === 0) {
    lines.push('All modules and personas passed validation.');
  }

  return lines.join('\n');
}

/**
 * Search modules by query string
 */
function searchModulesByQuery(
  modules: ModuleInfo[],
  query: string,
  limit: number
): ModuleInfo[] {
  const lowerQuery = query.toLowerCase();

  // Score each module based on query match
  const scored = modules.map(module => {
    let score = 0;

    // Exact ID match (highest priority)
    if (module.id.toLowerCase() === lowerQuery) {
      score += 100;
    } else if (module.id.toLowerCase().includes(lowerQuery)) {
      score += 50;
    }

    // Name match
    if (module.name.toLowerCase().includes(lowerQuery)) {
      score += 30;
    }

    // Description match
    if (module.description.toLowerCase().includes(lowerQuery)) {
      score += 20;
    }

    // Capability match
    if (module.capabilities.some(c => c.toLowerCase().includes(lowerQuery))) {
      score += 15;
    }

    return { module, score };
  });

  // Filter modules with score > 0, sort by score descending, limit results
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.module);
}

/**
 * Handle errors consistently
 */
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return `Error: ${String(error)}`;
}

// ===== MCP Server Setup =====

/**
 * Create and configure the MCP server with all tools
 */
function createMCPServer(): McpServer {
  const server = new McpServer({
    name: 'ums-mcp',
    version: '1.0.0',
  });

  // ===== Tool: ums_build_persona =====
  server.registerTool(
    'ums_build_persona',
    {
      title: 'Build UMS Persona',
      description: `Build a persona from a .persona.ts file, rendering all referenced modules into markdown.

This tool compiles a UMS persona definition into a complete markdown document that can be used as AI system instructions.

Args:
  - personaPath (string, required): Path to the .persona.ts file
  - includeStandard (boolean): Include standard library modules (default: true)
  - emitDeclarations (boolean): Emit TypeScript declaration files (default: false)

Returns:
  Build result including:
  - Generated markdown content
  - Persona metadata (name, version, description)
  - List of resolved modules
  - Build report with digests
  - Any warnings encountered

Example:
  personaPath: "./personas/developer.persona.ts"`,
      inputSchema: BuildPersonaInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: BuildPersonaInput) => {
      try {
        const result = await buildPersona(params.personaPath, {
          includeStandard: params.includeStandard,
          emitDeclarations: params.emitDeclarations,
        });

        const textContent = formatBuildResultMarkdown(result);

        // Prepare structured output
        const structuredOutput = {
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

        return {
          content: [{ type: 'text', text: textContent }],
          structuredContent: structuredOutput,
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: handleError(error) }],
          isError: true,
        };
      }
    }
  );

  // ===== Tool: ums_list_modules =====
  server.registerTool(
    'ums_list_modules',
    {
      title: 'List UMS Modules',
      description: `List all available UMS modules with optional filtering.

This tool discovers and lists all modules available in the UMS system, including both standard library modules and local project modules.

Args:
  - capability (string, optional): Filter by capability (e.g., "reasoning", "coding")
  - tag (string, optional): Filter by tag
  - includeStandard (boolean): Include standard library modules (default: true)

Returns:
  Array of module information including:
  - id: Module identifier
  - name: Human-readable name
  - description: Brief description
  - version: Module version
  - capabilities: List of capabilities
  - source: "standard" or "local"

Example:
  capability: "reasoning" - List only modules with reasoning capability`,
      inputSchema: ListModulesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ListModulesInput) => {
      try {
        const modules = await listModules({
          ...(params.capability && { capability: params.capability }),
          ...(params.tag && { tag: params.tag }),
          includeStandard: params.includeStandard,
        });

        const textContent = formatModuleListMarkdown(modules);

        const structuredOutput = {
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

        return {
          content: [{ type: 'text', text: textContent }],
          structuredContent: structuredOutput,
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: handleError(error) }],
          isError: true,
        };
      }
    }
  );

  // ===== Tool: ums_validate_modules =====
  server.registerTool(
    'ums_validate_modules',
    {
      title: 'Validate UMS Modules',
      description: `Validate all modules and personas in the workspace.

This tool runs validation checks on all discovered UMS modules and optionally persona files to ensure they conform to the UMS specification.

Args:
  - includePersonas (boolean): Also validate persona files (default: true)
  - includeStandard (boolean): Include standard library modules (default: true)

Returns:
  Validation report including:
  - totalModules: Total number of modules checked
  - validModules: Number that passed validation
  - totalPersonas: Total personas checked (if includePersonas)
  - validPersonas: Number that passed validation
  - errors: Map of module/persona IDs to validation errors
  - warnings: Map of module/persona IDs to warnings

Use this tool to check module health before building personas.`,
      inputSchema: ValidateModulesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: ValidateModulesInput) => {
      try {
        const report = await validateAll({
          includePersonas: params.includePersonas,
          includeStandard: params.includeStandard,
        });

        const textContent = formatValidationReportMarkdown(report);

        // Convert Maps to plain objects for structured output
        const errorsObj: Record<string, { message: string; path?: string }[]> =
          {};
        for (const [id, errors] of report.errors) {
          errorsObj[id] = errors.map(e => ({
            message: e.message,
            ...(e.path && { path: e.path }),
          }));
        }

        const warningsObj: Record<
          string,
          { code: string; message: string; path?: string }[]
        > = {};
        for (const [id, warnings] of report.warnings) {
          warningsObj[id] = warnings.map(w => ({
            code: w.code,
            message: w.message,
            ...(w.path && { path: w.path }),
          }));
        }

        const structuredOutput = {
          success: true,
          totalModules: report.totalModules,
          validModules: report.validModules,
          invalidModules: report.totalModules - report.validModules,
          totalPersonas: report.totalPersonas,
          validPersonas: report.validPersonas,
          hasErrors: report.errors.size > 0,
          hasWarnings: report.warnings.size > 0,
          errors: errorsObj,
          warnings: warningsObj,
        };

        return {
          content: [{ type: 'text', text: textContent }],
          structuredContent: structuredOutput,
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: handleError(error) }],
          isError: true,
        };
      }
    }
  );

  // ===== Tool: ums_search_modules =====
  server.registerTool(
    'ums_search_modules',
    {
      title: 'Search UMS Modules',
      description: `Search for modules by query string.

This tool searches across all available UMS modules, matching against module IDs, names, descriptions, and capabilities.

Args:
  - query (string, required): Search query to match
  - capability (string, optional): Filter results by capability
  - limit (number): Maximum results to return (default: 10, max: 100)

Returns:
  Array of matching modules sorted by relevance, including:
  - id: Module identifier
  - name: Human-readable name
  - description: Brief description
  - version: Module version
  - capabilities: List of capabilities
  - source: "standard" or "local"

Examples:
  query: "error handling" - Find modules related to error handling
  query: "typescript" - Find TypeScript-related modules
  query: "reasoning", capability: "logic" - Find reasoning modules with logic capability`,
      inputSchema: SearchModulesInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params: SearchModulesInput) => {
      try {
        // First get all modules with optional capability filter
        const allModules = await listModules({
          ...(params.capability && { capability: params.capability }),
          includeStandard: true,
        });

        // Search and rank results
        const results = searchModulesByQuery(
          allModules,
          params.query,
          params.limit
        );

        const textContent =
          results.length > 0
            ? formatModuleListMarkdown(results)
            : `No modules found matching "${params.query}".`;

        const structuredOutput = {
          success: true,
          query: params.query,
          count: results.length,
          modules: results.map(m => ({
            id: m.id,
            name: m.name,
            description: m.description,
            version: m.version,
            capabilities: m.capabilities,
            source: m.source,
          })),
        };

        return {
          content: [{ type: 'text', text: textContent }],
          structuredContent: structuredOutput,
        };
      } catch (error) {
        return {
          content: [{ type: 'text', text: handleError(error) }],
          isError: true,
        };
      }
    }
  );

  return server;
}

// ===== Server Startup =====

/**
 * Start the MCP server with the specified transport
 */
export async function startMCPServer(
  transport: 'stdio' | 'http' | 'sse'
): Promise<void> {
  const server = createMCPServer();

  if (transport === 'stdio') {
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
    console.error('UMS MCP server running via stdio');
  } else if (transport === 'http') {
    // HTTP transport not yet implemented
    console.error('HTTP transport not yet implemented');
    console.error('Use stdio transport for Claude Desktop integration');
    process.exit(1);
  } else if (transport === 'sse') {
    // SSE transport deprecated in favor of streamable HTTP
    console.error('SSE transport is deprecated, use stdio or http instead');
    process.exit(1);
  }
}
