#!/usr/bin/env node
import { Command } from 'commander';
import { handleBuild } from './commands/build.js';
import { handleList } from './commands/list.js';
import { handleSearch } from './commands/search.js';
import { handleValidate } from './commands/validate.js';

const program = new Command();

program
  .name('copilot-instructions')
  .description(
    'A CLI for building and managing AI persona instructions from modular files.'
  )
  .version('0.1.0'); // Initial pre-release version

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
  .option('-t, --tier <name>', 'Filter the list by a specific tier')
  .action(handleList);

program
  .command('search')
  .description('Searches for modules by name or description.')
  .argument('<query>', 'The text to search for.')
  .option('-t, --tier <name>', 'Restrict the search to a specific tier.')
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

// Asynchronous execution wrapper
async function main() {
  await program.parseAsync(process.argv);
}

main();
