#!/usr/bin/env node

import { Argument, Command, Option } from 'commander';
import { handleBuild } from './commands/build.js';
import { handleList } from './commands/list.js';
import { handleSearch } from './commands/search.js';
import { handleValidate } from './commands/validate.js';
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
      const verbose = options.verbose ?? false;

      await handleBuild({
        ...(options.persona && { persona: options.persona }),
        ...(options.output && { output: options.output }),
        verbose,
      });
    }
  );

program
  .command('list')
  .description('Lists all available UMS v1.0 modules.')
  .addOption(
    new Option('-t, --tier <name>', 'Filter by tier').choices([
      'foundation',
      'principle',
      'technology',
      'execution',
    ])
  )
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions list
    $ copilot-instructions list --tier foundation
    $ copilot-instructions list --tier technology
    `
  )
  .showHelpAfterError()
  .action(async (options: { tier?: string; verbose?: boolean }) => {
    const verbose = options.verbose ?? false;
    await handleList({
      ...(options.tier && { tier: options.tier }),
      verbose,
    });
  });

program
  .command('search')
  .description('Searches for UMS v1.0 modules by name, description, or tags.')
  .addArgument(new Argument('<query>', 'Search query'))
  .addOption(
    new Option('-t, --tier <name>', 'Filter by tier').choices([
      'foundation',
      'principle',
      'technology',
      'execution',
    ])
  )
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    $ copilot-instructions search "logic"
    $ copilot-instructions search "reasoning" --tier foundation
    $ copilot-instructions search "react" --tier technology
    `
  )
  .showHelpAfterError()
  .action(
    async (query: string, options: { tier?: string; verbose?: boolean }) => {
      const verbose = options.verbose ?? false;
      await handleSearch(query, {
        ...(options.tier && { tier: options.tier }),
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
  .action(async (path: string, options: { verbose?: boolean }) => {
    const verbose = options.verbose ?? false;
    await handleValidate({ targetPath: path, verbose });
  });

void program.parseAsync();
