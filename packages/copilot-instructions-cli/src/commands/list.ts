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
  tier?: string;
  verbose?: boolean;
}

/**
 * Filters and sorts modules according to M5 requirements
 */
function filterAndSortModules(
  modules: Module[],
  tierFilter?: string
): Module[] {
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
    const metadata = getModuleMetadata(module);

    table.push([
      chalk.green(module.id),
      chalk.yellow(tierSubject),
      chalk.white.bold(metadata.name),
      chalk.gray(metadata.description),
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
