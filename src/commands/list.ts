/**
 * @module commands/list
 * @description Command to list available UMS v1.0 modules (M5).
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { handleError } from '../utils/error-handler.js';
import { ModuleRegistry } from '../core/ums-build-engine.js';
import { loadModule } from '../core/ums-module-loader.js';
import { createDiscoveryProgress } from '../utils/progress.js';
import type { UMSModule } from '../types/ums-v1.js';

interface ListOptions {
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
 * Filters and sorts modules according to M5 requirements
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

  // M5 sorting: meta.name (Title Case) then id
  filteredModules.sort((a, b) => {
    const nameCompare = a.meta.name.localeCompare(b.meta.name);
    if (nameCompare !== 0) return nameCompare;
    return a.id.localeCompare(b.id);
  });

  return filteredModules;
}

/**
 * Renders the modules table with consistent styling
 */
function renderModulesTable(modules: UMSModule[]): void {
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

  console.log(chalk.cyan.bold('\nAvailable UMS v1.0 modules:\n'));
  console.log(table.toString());
  console.log(
    chalk.cyan(`\nTotal modules: ${chalk.bold(modules.length.toString())}`)
  );
}

/**
 * Handles the 'list' command for UMS v1.0 modules (M5).
 * @param options - The command options.
 * @param options.tier - The tier to filter by (foundation|principle|technology|execution).
 */
export async function handleList(options: ListOptions): Promise<void> {
  const progress = createDiscoveryProgress('list', options.verbose);

  try {
    progress.start('Discovering UMS v1.0 modules...');

    // Use UMS v1.0 module discovery
    const registry = new ModuleRegistry();
    await registry.discover();

    const moduleIds = registry.getAllModuleIds();
    if (moduleIds.length === 0) {
      progress.succeed('Module discovery complete.');
      console.log(chalk.yellow('No UMS v1.0 modules found.'));
      return;
    }

    progress.update(`Loading ${moduleIds.length} modules...`);

    // Load all modules
    const modules = await loadModulesFromRegistry(registry, !!options.tier);

    progress.update('Filtering and sorting modules...');

    // Filter and sort modules
    const filteredModules = filterAndSortModules(modules, options.tier);

    progress.succeed('Module listing complete.');

    // M5 empty state
    if (filteredModules.length === 0) {
      const filterMsg = options.tier ? ` in tier '${options.tier}'` : '';
      console.log(chalk.yellow(`No UMS v1.0 modules found${filterMsg}.`));
      return;
    }

    // Render results
    renderModulesTable(filteredModules);
  } catch (error) {
    progress.fail('Failed to discover modules.');
    handleError(error, {
      command: 'list',
      operation: 'discovery',
      ...(options.verbose && {
        verbose: options.verbose,
        timestamp: options.verbose,
      }),
    });
  }
}
