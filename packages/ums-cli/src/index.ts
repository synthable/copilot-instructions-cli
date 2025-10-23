#!/usr/bin/env node

import { Argument, Command, Option } from 'commander';
import { handleBuild } from './commands/build.js';
import { handleList } from './commands/list.js';
import { handleSearch } from './commands/search.js';
import { handleValidate } from './commands/validate.js';
import { handleInspect } from './commands/inspect.js';
import {
  handleMcpStart,
  handleMcpTest,
  handleMcpValidateConfig,
  handleMcpListTools,
} from './commands/mcp.js';
import pkg from '../package.json' with { type: 'json' };

const program = new Command();

program
  .name('copilot-instructions')
  .description(
    'A CLI for building and managing AI persona instructions from UMS v1.0 modules.'
  )
  .version(pkg.version)
  .option('-v, --verbose', 'Enable verbose output');

program
  .command('build')
  .description(
    'Builds a persona instruction file from a .persona.yml configuration (UMS v1.0)'
  )
  .option(
    '-p, --persona <file>',
    'Path to the persona configuration file (.persona.yml)'
  )
  .option('-o, --output <file>', 'Specify the output file for the build')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions build --persona ./personas/my-persona.persona.yml
    $ copilot-instructions build --persona ./personas/my-persona.persona.yml --output ./dist/my-persona.md
    $ cat persona.yml | copilot-instructions build --output ./dist/my-persona.md
    `
  )
  .showHelpAfterError()
  .action(
    async (options: {
      persona?: string;
      output?: string;
      verbose?: boolean;
    }) => {
      if (!options.persona) {
        console.error('Error: --persona <file> is required');
        process.exit(1);
      }

      const verbose = options.verbose ?? false;

      await handleBuild({
        persona: options.persona,
        ...(options.output && { output: options.output }),
        verbose,
      });
    }
  );

program
  .command('list')
  .description('Lists all available UMS v2.0 modules.')
  .option('-t, --tag <name>', 'Filter by tag (e.g., foundational, reasoning)')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions list
    $ copilot-instructions list --tag foundational
    $ copilot-instructions list --tag reasoning
    `
  )
  .showHelpAfterError()
  .action(async (options: { tag?: string; verbose?: boolean }) => {
    const verbose = options.verbose ?? false;
    await handleList({
      ...(options.tag && { tag: options.tag }),
      verbose,
    });
  });

program
  .command('search')
  .description('Searches for UMS v2.0 modules by name, description, or tags.')
  .addArgument(new Argument('<query>', 'Search query'))
  .option('-t, --tag <name>', 'Filter by tag (e.g., foundational, reasoning)')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions search "logic"
    $ copilot-instructions search "reasoning" --tag foundational
    $ copilot-instructions search "react" --tag typescript
    `
  )
  .showHelpAfterError()
  .action(
    async (query: string, options: { tag?: string; verbose?: boolean }) => {
      const verbose = options.verbose ?? false;
      await handleSearch(query, {
        ...(options.tag && { tag: options.tag }),
        verbose,
      });
    }
  );

program
  .command('validate')
  .description('Validates UMS v1.0 modules and persona files.')
  .addArgument(
    new Argument(
      '[path]',
      'Path to validate (file or directory, defaults to current directory)'
    ).default('.')
  )
  .option(
    '-v, --verbose',
    'Enable verbose output with detailed validation steps'
  )
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions validate
    $ copilot-instructions validate ./instructions-modules
    $ copilot-instructions validate ./personas/my-persona.persona.yml
    $ copilot-instructions validate --verbose
    `
  )
  .showHelpAfterError()
  .action((path: string, options: { verbose?: boolean }) => {
    const verbose = options.verbose ?? false;
    handleValidate({ targetPath: path, verbose });
  });

program
  .command('inspect')
  .description('Inspect module conflicts and registry state.')
  .option('-m, --module-id <id>', 'Inspect a specific module for conflicts')
  .option('-c, --conflicts-only', 'Show only modules with conflicts')
  .option('-s, --sources', 'Show registry sources summary')
  .option('-f, --format <format>', 'Output format (table|json)', 'table')
  .option('-v, --verbose', 'Enable verbose output with detailed information')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions inspect                                    # Registry overview
    $ copilot-instructions inspect --conflicts-only                  # Show only conflicts
    $ copilot-instructions inspect --sources                         # Sources summary
    $ copilot-instructions inspect --module-id foundation/logic      # Specific module
    $ copilot-instructions inspect --format json                     # JSON output
    $ copilot-instructions inspect --verbose                         # Detailed info
    `
  )
  .showHelpAfterError()
  .action(
    async (options: {
      moduleId?: string;
      conflictsOnly?: boolean;
      sources?: boolean;
      format?: string;
      verbose?: boolean;
    }) => {
      const verbose = options.verbose ?? false;
      await handleInspect({
        ...(options.moduleId && { moduleId: options.moduleId }),
        ...(options.conflictsOnly && { conflictsOnly: options.conflictsOnly }),
        ...(options.sources && { sources: options.sources }),
        ...(options.format && { format: options.format as 'table' | 'json' }),
        verbose,
      });
    }
  );

// MCP command group
const mcpCommand = program
  .command('mcp')
  .description('MCP server development and testing tools');

mcpCommand
  .command('start')
  .description('Start the MCP server')
  .addOption(
    new Option('--transport <type>', 'Transport protocol to use').choices([
      'stdio',
      'http',
      'sse',
    ])
  )
  .option('--debug', 'Enable debug logging')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions mcp start                # Start with stdio (default)
    $ copilot-instructions mcp start --transport http
    $ copilot-instructions mcp start --debug --verbose
    `
  )
  .showHelpAfterError()
  .action(
    async (options: {
      transport?: 'stdio' | 'http' | 'sse';
      debug?: boolean;
      verbose?: boolean;
    }) => {
      await handleMcpStart({
        transport: options.transport ?? 'stdio',
        debug: options.debug ?? false,
        verbose: options.verbose ?? false,
      });
    }
  );

mcpCommand
  .command('test')
  .description('Test MCP server with sample requests')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions mcp test
    $ copilot-instructions mcp test --verbose
    `
  )
  .showHelpAfterError()
  .action(async (options: { verbose?: boolean }) => {
    await handleMcpTest({ verbose: options.verbose ?? false });
  });

mcpCommand
  .command('validate-config')
  .description('Validate Claude Desktop MCP configuration')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions mcp validate-config
    `
  )
  .showHelpAfterError()
  .action(async (options: { verbose?: boolean }) => {
    await handleMcpValidateConfig({ verbose: options.verbose ?? false });
  });

mcpCommand
  .command('list-tools')
  .description('List available MCP tools')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions mcp list-tools
    `
  )
  .showHelpAfterError()
  .action(async (options: { verbose?: boolean }) => {
    await handleMcpListTools({ verbose: options.verbose ?? false });
  });

void program.parseAsync();
