#!/usr/bin/env node
import { Argument, Command, Option } from 'commander';
import { handleBuild } from './commands/build.js';
import { handleList } from './commands/list.js';
import { handleSearch } from './commands/search.js';
import { handleValidate } from './commands/validate.js';
import { handleCreateModule } from './commands/create-module.js';
import { handleCreatePersona } from './commands/create-persona.js';

const program = new Command();

program
  .name('copilot-instructions')
  .description(
    'A CLI for building and managing AI persona instructions from modular files.'
  )
  .version(require('../package.json').version); // Dynamically derived version

program
  .command('build')
  .description(
    'Builds a persona instruction file from a .persona.json configuration.'
  )
  .argument('<personaFile>', 'Path to the persona configuration file.')
  .action(handleBuild);

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
  .addHelpText(
    'after',
    `
  Examples:
    $ copilot-instructions list
    $ copilot-instructions list --tier foundation
  `
  )
  .action(handleList);

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
  .addHelpText(
    'after',
    `
  Examples:
    $ copilot-instructions validate
    $ copilot-instructions validate ./modules/my-module.md
    $ copilot-instructions validate ./personas/my-persona.persona.jsonc
  `
  )
  .action(handleValidate);

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
async function main() {
  await program.parseAsync(process.argv);
}

main();
