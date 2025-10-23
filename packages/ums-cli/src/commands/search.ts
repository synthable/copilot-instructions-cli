/**
 * @module commands/search
 * @description Command to search for UMS v1.0 modules (M6).
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { handleError } from '../utils/error-handler.js';
import type { Module } from 'ums-lib';
import { createDiscoveryProgress } from '../utils/progress.js';
import { discoverAllModules } from '../utils/module-discovery.js';
import { getModuleMetadata } from '../types/cli-extensions.js';

interface SearchOptions {
  tag?: string;
  verbose?: boolean;
}

/**
 * Searches modules by query across name, description, and tags
 */
function searchModules(modules: Module[], query: string): Module[] {
  const lowerCaseQuery = query.toLowerCase();

  return modules.filter(module => {
    const metadata = getModuleMetadata(module);

    // Search in metadata.name
    if (metadata.name.toLowerCase().includes(lowerCaseQuery)) {
      return true;
    }

    // Search in metadata.description
    if (metadata.description.toLowerCase().includes(lowerCaseQuery)) {
      return true;
    }

    // Search in metadata.tags if present
    if (metadata.tags && Array.isArray(metadata.tags)) {
      return metadata.tags.some(tag =>
        tag.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return false;
  });
}

/**
 * Filters and sorts modules according to M6 requirements (same as M5)
 */
function filterAndSortModules(
  modules: Module[],
  tagFilter?: string
): Module[] {
  let filteredModules = modules;

  if (tagFilter) {
    filteredModules = modules.filter(m => {
      const metadata = getModuleMetadata(m);
      return metadata.tags?.includes(tagFilter);
    });
  }

  // M6 sorting: same as M5 - metadata.name then id
  filteredModules.sort((a, b) => {
    const metaA = getModuleMetadata(a);
    const metaB = getModuleMetadata(b);
    const nameCompare = metaA.name.localeCompare(metaB.name);
    if (nameCompare !== 0) return nameCompare;
    return a.id.localeCompare(b.id);
  });

  return filteredModules;
}

/**
 * Renders the search results table with consistent styling
 */
function renderSearchResults(modules: Module[], query: string): void {
  const table = new Table({
    head: ['ID', 'Name', 'Description', 'Tags'],
    style: {
      head: ['cyan', 'bold'],
      border: ['gray'],
      compact: false,
    },
    colWidths: [30, 30, 40],
    wordWrap: true,
  });

  modules.forEach(module => {
    const metadata = getModuleMetadata(module);
    const tags = metadata.tags?.join(', ') || 'none';

    table.push([
      chalk.green(module.id),
      chalk.white.bold(metadata.name),
      chalk.gray(metadata.description),
      chalk.yellow(tags),
    ]);
  });

  console.log(chalk.cyan.bold(`\nSearch results for "${query}":\n`));
  console.log(table.toString());
  console.log(
    chalk.cyan(
      `\nFound ${chalk.bold(modules.length.toString())} matching modules`
    )
  );
}

/**
 * Handles the 'search' command for UMS v1.0 modules (M6).
 * @param query - The search query.
 * @param options - The command options.
 * @param options.tag - The tag to filter by.
 */
export async function handleSearch(
  query: string,
  options: SearchOptions
): Promise<void> {
  const progress = createDiscoveryProgress('search', options.verbose);

  try {
    progress.start('Discovering UMS v1.0 modules...');

    // Use UMS v1.0 module discovery
    const moduleDiscoveryResult = await discoverAllModules();
    const modulesMap = moduleDiscoveryResult.registry.resolveAll('warn');
    const modules = Array.from(modulesMap.values());

    if (modules.length === 0) {
      progress.succeed('Module discovery complete.');
      console.log(chalk.yellow('No UMS v1.0 modules found.'));
      return;
    }

    progress.update(`Processing ${modules.length} modules...`);

    // Show warnings if any
    if (moduleDiscoveryResult.warnings.length > 0 && options.verbose) {
      console.log(chalk.yellow('\nModule Discovery Warnings:'));
      for (const warning of moduleDiscoveryResult.warnings) {
        console.log(chalk.yellow(`  - ${warning}`));
      }
    }

    progress.update(`Searching for "${query}"...`);

    // M6: Query substring case-insensitive across meta.name, meta.description, meta.tags
    const searchResults = searchModules(modules, query);

    progress.update('Filtering and sorting results...');

    // Filter by tag and sort (same as M5)
    const filteredResults = filterAndSortModules(searchResults, options.tag);

    progress.succeed('Module search complete.');

    // M6: no-match case
    if (filteredResults.length === 0) {
      const filterMsg = options.tag ? ` with tag '${options.tag}'` : '';
      console.log(
        chalk.yellow(`No modules found matching "${query}"${filterMsg}.`)
      );
      return;
    }

    // Render results
    renderSearchResults(filteredResults, query);
  } catch (error) {
    progress.fail('Failed to search modules.');
    handleError(error, {
      command: 'search',
      context: 'search operation',
      suggestion: 'check module directory and permissions',
      ...(options.verbose && {
        verbose: options.verbose,
        timestamp: options.verbose,
      }),
    });
  }
}
