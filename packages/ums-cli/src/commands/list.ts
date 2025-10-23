/**
 * @module commands/list
 * @description Command to list available UMS v2.0 modules.
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { handleError } from '../utils/error-handler.js';
import type { Module } from 'ums-lib';
import { createDiscoveryProgress } from '../utils/progress.js';
import { discoverAllModules } from '../utils/module-discovery.js';
import { getModuleMetadata } from '../types/cli-extensions.js';

interface ListOptions {
  tag?: string;
  verbose?: boolean;
}

/**
 * Filters and sorts modules by tag and metadata.name
 */
function filterAndSortModules(modules: Module[], tagFilter?: string): Module[] {
  let filteredModules = modules;

  if (tagFilter) {
    filteredModules = modules.filter(m => {
      const metadata = getModuleMetadata(m);
      return metadata.tags?.includes(tagFilter);
    });
  }

  // Sorting: metadata.name (Title Case) then id
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
 * Renders the modules table with consistent styling
 */
function renderModulesTable(modules: Module[]): void {
  const table = new Table({
    head: ['ID', 'Name', 'Capabilities', 'Tags', 'Description'],
    style: {
      head: ['cyan', 'bold'],
      border: ['gray'],
      compact: false,
    },
    colWidths: [28, 22, 20, 20, 30],
    wordWrap: true,
  });

  modules.forEach(module => {
    const metadata = getModuleMetadata(module);
    const capabilities = module.capabilities.join(', ');
    const tags = metadata.tags?.join(', ') ?? 'none';

    table.push([
      chalk.green(module.id),
      chalk.white.bold(metadata.name),
      chalk.cyan(capabilities),
      chalk.yellow(tags),
      chalk.gray(metadata.description),
    ]);
  });

  console.log(chalk.cyan.bold('\nAvailable UMS v2.0 modules:\n'));
  console.log(table.toString());
  console.log(
    chalk.cyan(`\nTotal modules: ${chalk.bold(modules.length.toString())}`)
  );
}

/**
 * Handles the 'list' command for UMS v2.0 modules.
 * @param options - The command options.
 * @param options.tag - The tag to filter by.
 */
export async function handleList(options: ListOptions): Promise<void> {
  const progress = createDiscoveryProgress('list', options.verbose);

  try {
    progress.start('Discovering UMS v2.0 modules...');

    // Use UMS v2.0 module discovery
    const moduleDiscoveryResult = await discoverAllModules();
    const modulesMap = moduleDiscoveryResult.registry.resolveAll('warn');
    const modules = Array.from(modulesMap.values());

    if (modules.length === 0) {
      progress.succeed('Module discovery complete.');
      console.log(chalk.yellow('No UMS v2.0 modules found.'));
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

    progress.update('Filtering and sorting modules...');

    // Filter and sort modules
    const filteredModules = filterAndSortModules(modules, options.tag);

    progress.succeed('Module listing complete.');

    // Empty state
    if (filteredModules.length === 0) {
      const filterMsg = options.tag ? ` with tag '${options.tag}'` : '';
      console.log(chalk.yellow(`No UMS v2.0 modules found${filterMsg}.`));
      return;
    }

    // Render results
    renderModulesTable(filteredModules);
  } catch (error) {
    progress.fail('Failed to discover modules.');
    handleError(error, {
      command: 'list',
      context: 'module discovery',
      suggestion:
        'check that instructions-modules directory exists and is readable',
      ...(options.verbose && {
        verbose: options.verbose,
        timestamp: options.verbose,
      }),
    });
  }
}
