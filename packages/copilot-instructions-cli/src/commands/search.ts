/**
 * @module commands/search
 * @description Command to search for UMS v1.0 modules (M6).
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { handleError } from '../utils/error-handler.js';
import type { UMSModule } from 'ums-lib';
import { createDiscoveryProgress } from '../utils/progress.js';
import { discoverAllModules } from '../utils/module-discovery.js';

interface SearchOptions {
  tier?: string;
  verbose?: boolean;
}

/**
 * Searches modules by query across name, description, and tags
 */
function searchModules(modules: UMSModule[], query: string): UMSModule[] {
  const lowerCaseQuery = query.toLowerCase();

  return modules.filter(module => {
    // Search in meta.name
    if (module.meta.name.toLowerCase().includes(lowerCaseQuery)) {
      return true;
    }

    // Search in meta.description
    if (module.meta.description.toLowerCase().includes(lowerCaseQuery)) {
      return true;
    }

    // Search in meta.tags if present
    if (module.meta.tags && Array.isArray(module.meta.tags)) {
      return module.meta.tags.some(tag =>
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
  modules: UMSModule[],
  tierFilter?: string
): UMSModule[] {
  let filteredModules = modules;

  if (tierFilter) {
    const validTiers = ['foundation', 'principle', 'technology', 'execution'];
    if (!validTiers.includes(tierFilter)) {
      throw new Error(
        `Invalid tier '${tierFilter}'. Must be one of: ${validTiers.join(', ')}`
      );
    }

    filteredModules = modules.filter(m => {
      const tier = m.id.split('/')[0];
      return tier === tierFilter;
    });
  }

  // M6 sorting: same as M5 - meta.name then id
  filteredModules.sort((a, b) => {
    const nameCompare = a.meta.name.localeCompare(b.meta.name);
    if (nameCompare !== 0) return nameCompare;
    return a.id.localeCompare(b.id);
  });

  return filteredModules;
}

/**
 * Renders the search results table with consistent styling
 */
function renderSearchResults(modules: UMSModule[], query: string): void {
  const table = new Table({
    head: ['ID', 'Tier/Subject', 'Name', 'Description'],
    style: {
      head: ['cyan', 'bold'],
      border: ['gray'],
      compact: false,
    },
    colWidths: [30, 25, 30],
    wordWrap: true,
  });

  modules.forEach(module => {
    const idParts = module.id.split('/');
    const tier = idParts[0];
    const subject = idParts.slice(1).join('/');
    const tierSubject = subject ? `${tier}/${subject}` : tier;

    table.push([
      chalk.green(module.id),
      chalk.yellow(tierSubject),
      chalk.white.bold(module.meta.name),
      chalk.gray(module.meta.description),
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
 * @param options.tier - The tier to filter by (foundation|principle|technology|execution).
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
    const modules = moduleDiscoveryResult.modules;

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

    // Filter by tier and sort (same as M5)
    const filteredResults = filterAndSortModules(searchResults, options.tier);

    progress.succeed('Module search complete.');

    // M6: no-match case
    if (filteredResults.length === 0) {
      const filterMsg = options.tier ? ` in tier '${options.tier}'` : '';
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
