#!/usr/bin/env node
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */

import { Argument, Command, Option } from 'commander';
import { handleBuild } from './commands/build.js';
import { handleUMSBuild, validatePersonaFile } from './commands/ums-build.js';
import { handleList } from './commands/list.js';
import { handleSearch } from './commands/search.js';
import { handleValidate } from './commands/validate.js';
import { handleCreateModule } from './commands/create-module.js';
import { handleCreatePersona } from './commands/create-persona.js';
import pkg from '../package.json' with { type: 'json' };

const program = new Command();

program
  .name('copilot-instructions')
  .description(
    'A CLI for building and managing AI persona instructions from modular files.'
  )
  .version(pkg.version) // Dynamically derived version, fixed for TypeScript/ESLint
  .option('-v, --verbose', 'Enable verbose output');

program
  .command('build')
  .description(
    'Builds a persona instruction file from a .persona.yml configuration (UMS v1.0) or legacy .persona.jsonc'
  )
  .option(
    '-p, --persona <file>',
    'Path to the persona configuration file (.persona.yml for UMS v1.0, or .persona.jsonc for legacy)'
  )
  .option(
    '--name <name>',
    '[Legacy only] Override the persona name in the output file.'
  )
  .option(
    '--description <description>',
    '[Legacy only] Override the persona description in the output file.'
  )
  .option(
    '--no-attributions',
    '[Legacy only] Exclude attributions in the output file.'
  )
  .option('-o, --output <file>', 'Specify the output file for the build.')
  .option(
    '-m, --modules <path...>',
    '[Legacy only] A list of instruction modules.',
    []
  )
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `  Examples:
    UMS v1.0 (recommended):
    $ copilot-instructions build --persona ./personas/my-persona.persona.yml
    $ copilot-instructions build --persona ./personas/my-persona.persona.yml --output ./dist/my-persona.md
    $ cat persona.yml | copilot-instructions build --output ./dist/my-persona.md

    Legacy format:
    $ copilot-instructions build --persona ./personas/my-persona.persona.jsonc
    $ copilot-instructions build --output ./dist/my-persona.md --modules foundation/logic/reasoning principle/ethics/ethical-considerations
    `
  )
  .showHelpAfterError()
  .action((options, cmd) => {
    const verbose = options.verbose ?? program.opts().verbose;

    // Determine if this is a UMS v1.0 build or legacy build
    if (options.persona) {
      if (options.persona.endsWith('.persona.yml')) {
        // UMS v1.0 build
        try {
          validatePersonaFile(options.persona);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          cmd.error(message);
          return;
        }

        handleUMSBuild({
          persona: options.persona,
          output: options.output,
          verbose,
        });
        return;
      } else if (
        options.persona.endsWith('.persona.jsonc') ||
        options.persona.endsWith('.persona.json')
      ) {
        // Legacy build
        const stdout = !options.output && !options.persona;
        handleBuild({
          personaFilePath: options.persona,
          modules: options.modules,
          name: options.name,
          description: options.description,
          output: options.output,
          stdout,
          noAttributions: options.attributions === false,
          verbose,
        });
        return;
      } else {
        cmd.error(
          'Persona file must have either .persona.yml extension (UMS v1.0) or .persona.jsonc/.persona.json extension (legacy)'
        );
        return;
      }
    }

    // Check for stdin input (UMS v1.0 only)
    if (!process.stdin.isTTY) {
      // Reading from stdin - assume UMS v1.0 format
      handleUMSBuild({
        output: options.output,
        verbose,
      });
      return;
    }

    // Legacy fallback for modules-only build
    if (options.modules.length > 0) {
      const stdout = !options.output && !options.persona;
      handleBuild({
        personaFilePath: options.persona,
        modules: options.modules,
        name: options.name,
        description: options.description,
        output: options.output,
        stdout,
        noAttributions: options.attributions === false,
        verbose,
      });
      return;
    }

    cmd.error(
      'You must specify either:\n' +
        '  - A UMS v1.0 persona file with --persona <file.persona.yml>\n' +
        '  - A legacy persona file with --persona <file.persona.jsonc>\n' +
        '  - A legacy modules list with --modules <module-ids...>\n' +
        '  - UMS v1.0 persona YAML content via stdin (pipe or redirect)'
    );
  });

program
  .command('list')
  .description('Lists all available instruction modules.')
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
    `
  Examples:
    $ copilot-instructions list
    $ copilot-instructions list --tier foundation
  `
  )
  .action(options => {
    const verbose = options.verbose ?? program.opts().verbose;
    void handleList({ ...options, verbose });
  });

program
  .command('search')
  .description('Searches for modules by name or description.')
  .argument('<query>', 'The text to search for.')
  .addOption(
    new Option(
      '-t, --tier <name>',
      'Restrict the search to a specific tier.'
    ).choices(['foundation', 'principle', 'technology', 'execution'])
  )
  .addHelpText(
    'after',
    `
  Examples:
    $ copilot-instructions search "logic"
    $ copilot-instructions search "reasoning" --tier foundation
  `
  )
  .action(handleSearch);

program
  .command('validate')
  .description(
    'Validates all modules and persona files, or a specific file/directory.'
  )
  .argument('[path]', 'Optional path to a specific file or directory.')
  .option('-v, --verbose', 'Enable verbose output')
  .addHelpText(
    'after',
    `
  Examples:
    $ copilot-instructions validate
    $ copilot-instructions validate ./modules/my-module.md
    $ copilot-instructions validate ./personas/my-persona.persona.jsonc
  `
  )
  .action((path, options) => {
    const verbose = options.verbose ?? program.opts().verbose;
    void handleValidate({ targetPath: path, verbose });
  });

program
  .command('create-module')
  .description('Creates a new instruction module file.')
  .addArgument(
    new Argument(
      '<tier>',
      'The tier for the new module (e.g., foundation).'
    ).choices(['foundation', 'principle', 'technology', 'execution'])
  )
  .argument(
    '<subject>',
    'The subject path within the tier (e.g., logic/reasoning).'
  )
  .argument('<name>', 'The name for the new module (e.g., "My New Module").')
  .argument(
    '[description]',
    'A short description for the module.',
    name => `A module description for ${name}.`
  )
  .option(
    '-l, --layer <number>',
    'The layer for foundation modules (0-5).',
    value => parseInt(value, 10)
  )
  .action(handleCreateModule);

program
  .command('create-persona')
  .description('Creates a new persona configuration file.')
  .argument('<name>', 'The name for the new persona.')
  .argument(
    '[description]',
    'A short description for the persona.',
    name => `A persona description for ${name}.`
  )
  .option(
    '--no-attributions',
    'Do not include attributions in the persona file.'
  )
  .option(
    '-p, --persona-output <path>',
    'The path where the persona file will be saved.',
    name => `./${name}.persona.jsonc`
  )
  .option(
    '-b, --build-output <file>',
    'The file name for the generated persona markdown (sets the "output" property).',
    name => `./dist/${name}.md`
  )
  .option(
    '-t, --template <name>',
    'The name of a template file (e.g., "code-critic") from ./templates/persona to use as a base.'
  )
  .addHelpText(
    'after',
    `
  Examples:
    $ copilot-instructions create-persona "My New Persona"
    $ copilot-instructions create-persona "My New Persona" "A description of my persona."
    $ copilot-instructions create-persona "My New Persona" --persona-output ./personas/my-new-persona.persona.jsonc --build-output ./dist/my-new-persona.md
    $ copilot-instructions create-persona "My New Persona" --no-attributions
    $ copilot-instructions create-persona "My New Persona" --template code-critic
  `
  )
  .action(handleCreatePersona);

// Asynchronous execution wrapper
async function main(): Promise<void> {
  await program.parseAsync(process.argv);
}

void main();
