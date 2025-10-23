/**
 * @module commands/list
 * @description Command to list available UMS v1.0 modules (M5).
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
 * Filters and sorts modules according to M5 requirements
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

  // M5 sorting: metadata.name (Title Case) then id
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
    head: ['ID', 'Name', 'Description', 'Tags'],
    style: {
      head: ['cyan', 'bold'],
      border: ['gray'],
      compact: false,
    },
    colWidths: [30, 30, 40, 25],
    wordWrap: true,
  });

  modules.forEach(module => {
    const metadata = getModuleMetadata(module);
    const tags = metadata.tags?.join(', ') ?? 'none';

    table.push([
      chalk.green(module.id),
      chalk.white.bold(metadata.name),
      chalk.gray(metadata.description),
      chalk.yellow(tags),
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
 * @param options.tag - The tag to filter by.
 */
export async function handleList(options: ListOptions): Promise<void> {
  const progress = createDiscoveryProgress('list', options.verbose);

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

    progress.update('Filtering and sorting modules...');

    // Filter and sort modules
    const filteredModules = filterAndSortModules(modules, options.tag);

    progress.succeed('Module listing complete.');

    // M5 empty state
    if (filteredModules.length === 0) {
      const filterMsg = options.tag ? ` with tag '${options.tag}'` : '';
      console.log(chalk.yellow(`No UMS v1.0 modules found${filterMsg}.`));
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
