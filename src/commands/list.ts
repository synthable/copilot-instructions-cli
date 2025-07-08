/**
 * List command for the Copilot Instructions Builder CLI
 *
 * Displays modules from the index, optionally filtered by tier flags.
 * Uses console.table() for clean tabular output of module information.
 */

import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { IndexedModule, ModuleTier } from '../types/index.js';

/**
 * Interface for the list command options
 */
interface ListOptions {
  foundation?: boolean;
  principle?: boolean;
  technology?: boolean;
  execution?: boolean;
}

/**
 * Gets the path to the index file
 */
function getIndexFilePath(): string {
  return resolve('instructions-modules.index.json');
}

/**
 * Reads and parses the index file
 */
async function readIndexFile(): Promise<IndexedModule[]> {
  const indexFile = getIndexFilePath();

  try {
    const fileContent = await readFile(indexFile, 'utf-8');
    const modules = JSON.parse(fileContent) as IndexedModule[];

    if (!Array.isArray(modules)) {
      throw new Error(
        'Invalid index file format: expected an array of modules'
      );
    }

    return modules;
  } catch (error) {
    if (error instanceof Error && error.message.includes('ENOENT')) {
      console.error(`❌ Error: Index file not found at "${indexFile}"`);
      console.error(
        '   Run "instructions-builder index" first to create the index.'
      );
      process.exit(1);
    }

    if (error instanceof SyntaxError) {
      console.error(`❌ Error: Invalid JSON in index file "${indexFile}"`);
      console.error(
        '   Run "instructions-builder index" to regenerate the index.'
      );
      process.exit(1);
    }

    throw error;
  }
}

/**
 * Determines which tiers to include based on the provided flags
 */
export function getSelectedTiers(options: ListOptions): ModuleTier[] {
  const selectedTiers: ModuleTier[] = [];

  if (options.foundation) selectedTiers.push('foundation');
  if (options.principle) selectedTiers.push('principle');
  if (options.technology) selectedTiers.push('technology');
  if (options.execution) selectedTiers.push('execution');

  // If no flags are specified, include all tiers
  if (selectedTiers.length === 0) {
    return ['foundation', 'principle', 'technology', 'execution'];
  }

  return selectedTiers;
}

/**
 * Filters modules by the selected tiers
 */
export function filterModulesByTiers(
  modules: IndexedModule[],
  selectedTiers: ModuleTier[]
): IndexedModule[] {
  return modules.filter(module => selectedTiers.includes(module.tier));
}

/**
 * Prepares module data for console.table() display
 */
export function prepareTableData(
  modules: IndexedModule[]
): Record<string, any>[] {
  return modules.map(module => ({
    ID: module.id,
    Tier: module.tier,
    Subject: module.subject,
    Name: module.metadata.name,
    Description:
      module.metadata.description.length > 60
        ? module.metadata.description.substring(0, 57) + '...'
        : module.metadata.description,
    Tags: module.metadata.tags ? module.metadata.tags.join(', ') : '',
  }));
}

/**
 * Displays summary statistics
 */
function displaySummary(
  allModules: IndexedModule[],
  filteredModules: IndexedModule[],
  selectedTiers: ModuleTier[]
): void {
  const tierCounts = filteredModules.reduce(
    (counts, module) => {
      counts[module.tier] = (counts[module.tier] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  console.log(
    `\n📊 Showing ${filteredModules.length} of ${allModules.length} total modules`
  );

  if (selectedTiers.length < 4) {
    console.log(`🔍 Filtered by tiers: ${selectedTiers.join(', ')}`);
  }

  console.log('\n📋 Module breakdown by tier:');
  selectedTiers.forEach(tier => {
    const count = tierCounts[tier] || 0;
    console.log(`   • ${tier}: ${count} module(s)`);
  });
}

/**
 * Main execution function for the list command
 */
async function executeListOperation(options: ListOptions): Promise<void> {
  console.log('📋 Loading module index...');

  const allModules = await readIndexFile();

  if (allModules.length === 0) {
    console.log('⚠️  No modules found in the index.');
    console.log('   The instructions-modules directory may be empty.');
    return;
  }

  const selectedTiers = getSelectedTiers(options);
  const filteredModules = filterModulesByTiers(allModules, selectedTiers);

  if (filteredModules.length === 0) {
    console.log(
      `⚠️  No modules found for the selected tier(s): ${selectedTiers.join(', ')}`
    );
    return;
  }

  // Display the modules in a table
  const tableData = prepareTableData(filteredModules);
  console.log('\n📦 Available Modules:');
  console.table(tableData);

  // Display summary
  displaySummary(allModules, filteredModules, selectedTiers);
}

/**
 * Creates and configures the list command.
 *
 * The list command reads the module index and displays modules in a table format.
 * It supports filtering by tier using boolean flags for each of the four tiers.
 *
 * @returns Configured Commander.js command instance
 */
export function createListCommand(): Command {
  const command = new Command('list');

  command
    .description(
      'Display a table of modules from the index, with optional filtering by tier.'
    )
    .option('-f, --foundation', 'include foundation tier modules')
    .option('-p, --principle', 'include principle tier modules')
    .option('-t, --technology', 'include technology tier modules')
    .option('-e, --execution', 'include execution tier modules')
    .addHelpText(
      'after',
      `
Examples:
  $ instructions-builder list
  $ instructions-builder list --foundation
  $ instructions-builder list --principle --technology
  $ instructions-builder list --modules-path ./custom-modules
`
    )
    .action(async (options: ListOptions) => {
      try {
        await executeListOperation(options);
      } catch (error) {
        console.error(
          `❌ Unexpected error during list operation: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        process.exit(1);
      }
    });

  return command;
}
