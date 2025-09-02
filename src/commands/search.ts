/**
 * @module commands/search
 * @description Command to search for UMS v1.0 modules (M6).
 */

import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { handleError } from '../utils/error-handler.js';
import { ModuleRegistry } from '../core/ums-build-engine.js';
import { loadModule } from '../core/ums-module-loader.js';
import type { UMSModule } from '../types/ums-v1.js';

interface SearchOptions {
  tier?: string;
  verbose?: boolean;
}

/**
 * Loads all modules from the registry
 */
async function loadModulesFromRegistry(
  registry: ModuleRegistry,
  skipErrors: boolean
): Promise<UMSModule[]> {
  const moduleIds = registry.getAllModuleIds();
  const modules: UMSModule[] = [];

  for (const moduleId of moduleIds) {
    const filePath = registry.resolve(moduleId);
    if (filePath) {
      try {
        const module = await loadModule(filePath);
        modules.push(module);
      } catch (error) {
        if (skipErrors) {
          continue;
        }
        console.warn(
          chalk.yellow(
            `Warning: Failed to load module ${moduleId}: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    }
  }

  return modules;
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
        String(tag).toLowerCase().includes(lowerCaseQuery)
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
 * Renders the search results table
 */
function renderSearchResults(modules: UMSModule[], query: string): void {
  const table = new Table({
    head: ['ID', 'Tier/Subject', 'Name', 'Description'],
    style: {
      head: ['cyan'],
      border: ['gray'],
    },
    wordWrap: true,
  });

  modules.forEach(module => {
    const idParts = module.id.split('/');
    const tier = idParts[0];
    const subject = idParts.slice(1).join('/');
    const tierSubject = subject ? `${tier}/${subject}` : tier;

    table.push([
      module.id,
      tierSubject,
      module.meta.name,
      module.meta.description,
    ]);
  });

  console.log(`\nSearch results for "${query}":\n`);
  console.log(table.toString());
  console.log(`\nFound ${modules.length} matching modules`);
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
  const spinner = ora('Discovering UMS v1.0 modules...').start();
  try {
    // Use UMS v1.0 module discovery
    const registry = new ModuleRegistry();
    await registry.discover();

    const moduleIds = registry.getAllModuleIds();
    if (moduleIds.length === 0) {
      spinner.succeed('Module discovery complete.');
      console.log(chalk.yellow('No UMS v1.0 modules found.'));
      return;
    }

    // Load all modules
    const modules = await loadModulesFromRegistry(registry, !!options.tier);
    spinner.succeed('Module discovery complete.');

    // M6: Query substring case-insensitive across meta.name, meta.description, meta.tags
    const searchResults = searchModules(modules, query);

    // Filter by tier and sort (same as M5)
    const filteredResults = filterAndSortModules(searchResults, options.tier);

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
    spinner.fail('Failed to search modules.');
    handleError(error);
  }
}
