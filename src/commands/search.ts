/**
 * Search command for the Copilot Instructions Builder CLI
 *
 * Searches modules from the index by query, optionally filtered by tier flags.
 * Performs case-insensitive search on module name and description fields.
 * Uses console.table() for clean tabular output of search results.
 */

import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { IndexedModule, ModuleTier } from '../types/index.js';

/**
 * Interface for the search command options
 */
interface SearchOptions {
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
function getSelectedTiers(options: SearchOptions): ModuleTier[] {
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
function filterModulesByTiers(
  modules: IndexedModule[],
  selectedTiers: ModuleTier[]
): IndexedModule[] {
  return modules.filter(module => selectedTiers.includes(module.tier));
}

/**
 * Performs case-insensitive search on module name and description
 */
function searchModules(
  modules: IndexedModule[],
  query: string
): IndexedModule[] {
  const normalizedQuery = query.toLowerCase();

  return modules.filter(module => {
    const name = module.metadata.name.toLowerCase();
    const description = module.metadata.description.toLowerCase();

    return (
      name.includes(normalizedQuery) || description.includes(normalizedQuery)
    );
  });
}

/**
 * Prepares module data for console.table() display
 */
function prepareTableData(modules: IndexedModule[]): Record<string, any>[] {
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
 * Displays summary statistics for search results
 */
function displaySearchSummary(
  query: string,
  totalModules: number,
  filteredModules: IndexedModule[],
  searchResults: IndexedModule[],
  selectedTiers: ModuleTier[]
): void {
  const tierCounts = searchResults.reduce(
    (counts, module) => {
      counts[module.tier] = (counts[module.tier] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  console.log(
    `\n🔍 Found ${searchResults.length} module(s) matching "${query}"`
  );

  if (selectedTiers.length < 4) {
    console.log(
      `📋 Searched in ${filteredModules.length} of ${totalModules} total modules (filtered by tiers: ${selectedTiers.join(', ')})`
    );
  } else {
    console.log(`📋 Searched in ${filteredModules.length} total modules`);
  }

  if (searchResults.length > 0) {
    console.log('\n📊 Results breakdown by tier:');
    selectedTiers.forEach(tier => {
      const count = tierCounts[tier] || 0;
      if (count > 0) {
        console.log(`   • ${tier}: ${count} module(s)`);
      }
    });
  }
}

/**
 * Main execution function for the search command
 */
async function executeSearchOperation(
  query: string,
  options: SearchOptions
): Promise<void> {
  console.log(`🔍 Searching for "${query}" in module index...`);

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

  const searchResults = searchModules(filteredModules, query);

  if (searchResults.length === 0) {
    console.log(`\n⚠️  No modules found matching "${query}"`);
    if (selectedTiers.length < 4) {
      console.log(
        `   Searched in ${filteredModules.length} modules from tiers: ${selectedTiers.join(', ')}`
      );
    } else {
      console.log(`   Searched in ${filteredModules.length} total modules`);
    }
    return;
  }

  // Display the search results in a table
  const tableData = prepareTableData(searchResults);
  console.log('\n📦 Search Results:');
  console.table(tableData);

  // Display summary
  displaySearchSummary(
    query,
    allModules.length,
    filteredModules,
    searchResults,
    selectedTiers
  );
}

/**
 * Creates and configures the search command.
 *
 * The search command reads the module index and searches for modules containing
 * the specified query in their name or description fields. It supports filtering
 * by tier using boolean flags for each of the four tiers.
 *
 * @returns Configured Commander.js command instance
 */
export function createSearchCommand(): Command {
  const command = new Command('search');

  command
    .description(
      'Search modules by keyword in their name and description fields, with optional tier filtering.'
    )
    .argument(
      '<query>',
      'search query to match against module name and description'
    )
    .option('-f, --foundation', 'include foundation tier modules')
    .option('-p, --principle', 'include principle tier modules')
    .option('-t, --technology', 'include technology tier modules')
    .option('-e, --execution', 'include execution tier modules')
    .addHelpText(
      'after',
      `
Examples:
  $ instructions-builder search authentication
  $ instructions-builder search "test coverage" --technology
  $ instructions-builder search async --foundation --principle
  $ instructions-builder search error --modules-path ./custom-modules
`
    )
    .action(async (query: string, options: SearchOptions) => {
      try {
        await executeSearchOperation(query, options);
      } catch (error) {
        console.error(
          `❌ Unexpected error during search operation: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        process.exit(1);
      }
    });

  return command;
}
