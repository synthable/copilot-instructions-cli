/**
 * @module commands/inspect
 * @description CLI command for inspecting module conflicts and registry state
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import { handleError } from '../utils/error-handler.js';
import type { ModuleRegistry } from 'ums-lib';
import { createDiscoveryProgress } from '../utils/progress.js';
import { discoverAllModules } from '../utils/module-discovery.js';
import { getModuleMetadata } from '../types/cli-extensions.js';

export interface InspectOptions {
  verbose?: boolean;
  moduleId?: string;
  conflictsOnly?: boolean;
  sources?: boolean;
  format?: 'table' | 'json';
}

/**
 * Handles the inspect command
 */
export async function handleInspect(
  options: InspectOptions = {}
): Promise<void> {
  const {
    verbose = false,
    moduleId,
    conflictsOnly = false,
    sources = false,
    format = 'table',
  } = options;

  const progress = createDiscoveryProgress('inspect', verbose);

  try {
    progress.start('Discovering modules and analyzing conflicts...');

    // Discover all modules using the registry
    const moduleDiscoveryResult = await discoverAllModules();
    const registry = moduleDiscoveryResult.registry;

    progress.succeed('Module discovery completed');

    if (moduleId) {
      // Inspect specific module
      inspectSpecificModule(registry, moduleId, format, verbose);
    } else if (conflictsOnly) {
      // Show only conflicting modules
      inspectConflicts(registry, format, verbose);
    } else if (sources) {
      // Show source summary
      inspectSources(registry, format, verbose);
    } else {
      // Show registry overview
      inspectRegistryOverview(registry, format, verbose);
    }

    // Show discovery warnings if any
    if (moduleDiscoveryResult.warnings.length > 0 && verbose) {
      console.log(chalk.yellow('\nModule Discovery Warnings:'));
      for (const warning of moduleDiscoveryResult.warnings) {
        console.log(chalk.yellow(`  - ${warning}`));
      }
    }
  } catch (error) {
    progress.fail('Failed to inspect modules.');
    handleError(error, {
      command: 'inspect',
      context: 'module inspection',
      suggestion: 'check module paths and configuration files',
      ...(verbose && { verbose, timestamp: verbose }),
    });
    process.exit(1);
  }
}

/**
 * Inspect a specific module for conflicts
 */
function inspectSpecificModule(
  registry: ModuleRegistry,
  moduleId: string,
  format: string,
  verbose: boolean
): void {
  console.log(chalk.blue(`\n🔍 Inspecting Module: ${moduleId}\n`));

  const conflicts = registry.getConflicts(moduleId);
  const hasModule = registry.has(moduleId);

  if (!hasModule) {
    console.log(chalk.red(`Module '${moduleId}' not found in registry.`));
    return;
  }

  if (!conflicts) {
    console.log(chalk.green(`✅ No conflicts found for module '${moduleId}'.`));

    // Show the single module entry
    const resolvedModule = registry.resolve(moduleId);
    if (resolvedModule && verbose) {
      const metadata = getModuleMetadata(resolvedModule);
      console.log(chalk.gray('\nModule Details:'));
      console.log(chalk.gray(`  Name: ${metadata.name}`));
      console.log(chalk.gray(`  Description: ${metadata.description}`));
      console.log(chalk.gray(`  Version: ${resolvedModule.version}`));
      const filePath = (resolvedModule as { filePath?: string }).filePath;
      if (filePath) {
        console.log(chalk.gray(`  File: ${filePath}`));
      }
    }
    return;
  }

  // Show conflict details
  console.log(
    chalk.yellow(
      `⚠️  Found ${conflicts.length} conflicting entries for '${moduleId}':`
    )
  );

  if (format === 'json') {
    const conflictData = conflicts.map((entry, index) => {
      const metadata = getModuleMetadata(entry.module);
      const filePath = (entry.module as { filePath?: string }).filePath;
      return {
        index: index + 1,
        moduleId: entry.module.id,
        version: entry.module.version,
        source: `${entry.source.type}:${entry.source.path}`,
        addedAt: new Date(entry.addedAt).toISOString(),
        ...(verbose && {
          name: metadata.name,
          description: metadata.description,
          filePath,
        }),
      };
    });

    console.log(JSON.stringify(conflictData, null, 2));
  } else {
    const table = new Table({
      head: [
        chalk.cyan('#'),
        chalk.cyan('Version'),
        chalk.cyan('Source'),
        chalk.cyan('Added At'),
        ...(verbose ? [chalk.cyan('Name')] : []),
      ],
      colWidths: [4, 10, 30, 25, ...(verbose ? [30] : [])],
    });

    conflicts.forEach((entry, index) => {
      const addedAt = new Date(entry.addedAt).toLocaleString();
      const metadata = getModuleMetadata(entry.module);
      table.push([
        (index + 1).toString(),
        entry.module.version,
        `${entry.source.type}:${entry.source.path}`,
        addedAt,
        ...(verbose ? [metadata.name] : []),
      ]);
    });

    console.log(table.toString());
  }

  // Show current resolution strategy result
  console.log(chalk.blue('\nCurrent Resolution:'));
  const resolved = registry.resolve(moduleId, 'warn');
  if (resolved) {
    const resolvedEntry = conflicts.find(e => e.module === resolved);
    if (resolvedEntry) {
      const index = conflicts.indexOf(resolvedEntry) + 1;
      console.log(
        chalk.green(
          `  Using entry #${index} from ${resolvedEntry.source.type}:${resolvedEntry.source.path}`
        )
      );
    }
  }
}

/**
 * Inspect all conflicts in the registry
 */
function inspectConflicts(
  registry: ModuleRegistry,
  format: string,
  verbose: boolean
): void {
  const conflictingIds = registry.getConflictingIds();

  console.log(chalk.blue(`\n⚠️  Module Conflicts Overview\n`));

  if (conflictingIds.length === 0) {
    console.log(chalk.green('✅ No module conflicts found in the registry.'));
    return;
  }

  console.log(
    chalk.yellow(`Found ${conflictingIds.length} modules with conflicts:\n`)
  );

  if (format === 'json') {
    const conflictsData = conflictingIds.map(moduleId => {
      const conflicts = registry.getConflicts(moduleId);
      return {
        moduleId,
        conflictCount: conflicts?.length ?? 0,
        sources: conflicts?.map(e => `${e.source.type}:${e.source.path}`) ?? [],
        ...(verbose && {
          entries:
            conflicts?.map(entry => {
              const metadata = getModuleMetadata(entry.module);
              return {
                version: entry.module.version,
                source: `${entry.source.type}:${entry.source.path}`,
                name: metadata.name,
                addedAt: new Date(entry.addedAt).toISOString(),
              };
            }) ?? [],
        }),
      };
    });

    console.log(JSON.stringify(conflictsData, null, 2));
  } else {
    const table = new Table({
      head: [
        chalk.cyan('Module ID'),
        chalk.cyan('Conflicts'),
        chalk.cyan('Sources'),
        ...(verbose ? [chalk.cyan('Current Resolution')] : []),
      ],
      colWidths: [40, 10, 50, ...(verbose ? [30] : [])],
    });

    conflictingIds.forEach(moduleId => {
      const conflicts = registry.getConflicts(moduleId);
      const sources =
        conflicts?.map(e => `${e.source.type}:${e.source.path}`).join(', ') ??
        '';

      const row: string[] = [
        moduleId,
        (conflicts?.length ?? 0).toString(),
        sources.length > 47 ? sources.substring(0, 44) + '...' : sources,
      ];

      if (verbose) {
        const resolved = registry.resolve(moduleId, 'warn');
        const resolvedEntry = conflicts?.find(e => e.module === resolved);
        const resolution = resolvedEntry
          ? `${resolvedEntry.source.type}:${resolvedEntry.source.path}`
          : 'None';
        row.push(
          resolution.length > 27
            ? resolution.substring(0, 24) + '...'
            : resolution
        );
      }

      table.push(row);
    });

    console.log(table.toString());
  }
}

/**
 * Inspect registry sources summary
 */
function inspectSources(
  registry: ModuleRegistry,
  format: string,
  verbose: boolean
): void {
  const sourceSummary = registry.getSourceSummary();
  const sourceEntries = Object.entries(sourceSummary).sort(
    (a, b) => b[1] - a[1]
  );

  console.log(chalk.blue(`\n📊 Registry Sources Summary\n`));

  if (format === 'json') {
    const sourcesData = {
      totalSources: sourceEntries.length,
      totalModules: Object.values(sourceSummary).reduce(
        (sum, count) => sum + count,
        0
      ),
      sources: sourceEntries.map(([source, count]) => ({
        source,
        moduleCount: count,
      })),
    };

    console.log(JSON.stringify(sourcesData, null, 2));
  } else {
    const totalModules = Object.values(sourceSummary).reduce(
      (sum, count) => sum + count,
      0
    );
    console.log(chalk.gray(`Total sources: ${sourceEntries.length}`));
    console.log(chalk.gray(`Total module entries: ${totalModules}\n`));

    const table = new Table({
      head: [
        chalk.cyan('Source'),
        chalk.cyan('Module Count'),
        chalk.cyan('Percentage'),
      ],
      colWidths: [50, 15, 12],
    });

    sourceEntries.forEach(([source, count]) => {
      const percentage = ((count / totalModules) * 100).toFixed(1);
      table.push([source, count.toString(), `${percentage}%`]);
    });

    console.log(table.toString());
  }

  if (verbose) {
    const conflictingIds = registry.getConflictingIds();
    console.log(chalk.gray(`\nConflict Statistics:`));
    console.log(chalk.gray(`  Unique modules: ${registry.size()}`));
    console.log(chalk.gray(`  Conflicting modules: ${conflictingIds.length}`));
    console.log(
      chalk.gray(
        `  Conflict rate: ${((conflictingIds.length / registry.size()) * 100).toFixed(1)}%`
      )
    );
  }
}

/**
 * Show registry overview
 */
function inspectRegistryOverview(
  registry: ModuleRegistry,
  format: string,
  verbose: boolean
): void {
  const conflictingIds = registry.getConflictingIds();
  const sourceSummary = registry.getSourceSummary();

  console.log(chalk.blue(`\n📋 Registry Overview\n`));

  if (format === 'json') {
    const overviewData = {
      totalUniqueModules: registry.size(),
      totalModuleEntries: Object.values(sourceSummary).reduce(
        (sum, count) => sum + count,
        0
      ),
      conflictingModules: conflictingIds.length,
      sources: Object.keys(sourceSummary).length,
      conflictRate: parseFloat(
        ((conflictingIds.length / registry.size()) * 100).toFixed(1)
      ),
      ...(verbose && {
        sourceSummary,
        conflictingModuleIds: conflictingIds,
      }),
    };

    console.log(JSON.stringify(overviewData, null, 2));
  } else {
    const totalEntries = Object.values(sourceSummary).reduce(
      (sum, count) => sum + count,
      0
    );
    const conflictRate = (
      (conflictingIds.length / registry.size()) *
      100
    ).toFixed(1);

    console.log(
      `${chalk.green('✅ Total unique modules:')} ${registry.size()}`
    );
    console.log(`${chalk.blue('📦 Total module entries:')} ${totalEntries}`);
    console.log(
      `${chalk.yellow('⚠️  Conflicting modules:')} ${conflictingIds.length}`
    );
    console.log(
      `${chalk.cyan('📁 Sources:')} ${Object.keys(sourceSummary).length}`
    );
    console.log(`${chalk.magenta('📊 Conflict rate:')} ${conflictRate}%`);

    if (verbose && conflictingIds.length > 0) {
      console.log(chalk.yellow('\nConflicting Module IDs:'));
      conflictingIds.forEach(id => {
        const conflicts = registry.getConflicts(id);
        console.log(
          chalk.yellow(`  - ${id} (${conflicts?.length ?? 0} conflicts)`)
        );
      });
    }

    console.log(chalk.blue('\nUse specific commands for detailed inspection:'));
    console.log(chalk.gray(`  copilot-instructions inspect --conflicts-only`));
    console.log(chalk.gray(`  copilot-instructions inspect --sources`));
    console.log(
      chalk.gray(`  copilot-instructions inspect --module-id <module-id>`)
    );
  }
}
