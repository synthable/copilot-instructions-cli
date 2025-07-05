#!/usr/bin/env node

/**
 * CLI entry point for the Copilot Instructions Builder
 *
 * This file serves as the main command-line interface, registering all
 * available commands and handling global options.
 */

import { Command } from 'commander';
import { createIndexCommand } from './commands/index.js';
import { createBuildCommand } from './commands/build.js';
import { createListCommand } from './commands/list.js';
import { createSearchCommand } from './commands/search.js';

// Create the root program
const program = new Command();

// Configure the main program
program
  .name('instructions-builder')
  .description('Modular CLI for building GitHub Copilot instruction sets')
  .version('1.0.0')
  .option(
    '-m, --modules-path <path>',
    'path to modules directory',
    './instructions-modules'
  );

// Register all commands
program.addCommand(createIndexCommand());
program.addCommand(createListCommand());
program.addCommand(createSearchCommand());
program.addCommand(createBuildCommand());

// Parse command line arguments
program.parse(process.argv);
