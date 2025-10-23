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
  verbose?: boolean;
}

/**
 * Sorts modules by metadata.name (Title Case) then id
 */
function sortModules(modules: Module[]): Module[] {
  return modules.sort((a, b) => {
    const metaA = getModuleMetadata(a);
    const metaB = getModuleMetadata(b);
    const nameCompare = metaA.name.localeCompare(metaB.name);
    if (nameCompare !== 0) return nameCompare;
    return a.id.localeCompare(b.id);
  });
}

/**
 * Renders the modules table with consistent styling
 */
function renderModulesTable(modules: Module[]): void {
  const table = new Table({
    head: ['ID', 'Name', 'Capabilities', 'Description'],
    style: {
      head: ['cyan', 'bold'],
      border: ['gray'],
      compact: false,
    },
    colWidths: [30, 30, 25],
    wordWrap: true,
  });

  modules.forEach(module => {
    const metadata = getModuleMetadata(module);
    const capabilities = module.capabilities.join(', ');

    table.push([
      chalk.green(module.id),
      chalk.white.bold(metadata.name),
      chalk.yellow(capabilities),
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

    progress.update('Sorting modules...');

    // Sort modules
    const sortedModules = sortModules(modules);

    progress.succeed('Module listing complete.');

    // Render results
    renderModulesTable(sortedModules);
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
