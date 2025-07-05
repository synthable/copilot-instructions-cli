/**
 * Index command for the Copilot Instructions Builder CLI
 *
 * Scans all module markdown files and creates a searchable index
 * for efficient module discovery and metadata lookup.
 */

import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { parseModuleMetadata } from '../core/parser.js';
import { findMarkdownFiles } from '../utils/file-system.js';
import type { IndexedModule } from '../types/index.js';

/**
 * Defines the default paths for modules directory and index file.
 */
function getIndexPaths(): { modulesDir: string; indexFile: string } {
  return {
    modulesDir: resolve('instructions-modules'),
    indexFile: resolve('instructions-modules.index.json'),
  };
}

/**
 * Scans for markdown files in the modules directory with proper error handling.
 */
async function scanMarkdownFiles(modulesDir: string): Promise<string[]> {
  try {
    return await findMarkdownFiles(modulesDir);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Failed to read directory')
    ) {
      console.error(
        `❌ Error: Could not access modules directory at "${modulesDir}"`
      );
      console.error(`   Make sure the instructions-modules directory exists.`);
      process.exit(1);
    }
    throw error;
  }
}

/**
 * Creates an empty index file when no markdown files are found.
 */
async function createEmptyIndex(
  indexFile: string,
  modulesDir: string
): Promise<void> {
  console.log('⚠️  No markdown files found in the modules directory.');
  console.log(`   Checked: ${modulesDir}`);

  await writeFile(indexFile, JSON.stringify([], null, 2), 'utf-8');
  console.log(`✅ Created empty index file: ${indexFile}`);
}

/**
 * Parses all markdown files and collects indexed modules and errors.
 */
async function parseAllModules(
  markdownFiles: string[],
  modulesDir: string
): Promise<{
  indexedModules: IndexedModule[];
  errors: Array<{ file: string; error: string }>;
}> {
  const indexedModules: IndexedModule[] = [];
  const errors: Array<{ file: string; error: string }> = [];

  for (const filePath of markdownFiles) {
    try {
      console.log(`   Parsing: ${filePath}`);
      const module = await parseModuleMetadata(filePath, modulesDir);
      indexedModules.push(module);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      errors.push({ file: filePath, error: errorMessage });
      console.error(`   ❌ Failed to parse ${filePath}: ${errorMessage}`);
    }
  }

  return { indexedModules, errors };
}

/**
 * Reports parsing errors and validates that at least some modules were parsed successfully.
 */
function validateParsingResults(
  indexedModules: IndexedModule[],
  errors: Array<{ file: string; error: string }>
): void {
  if (errors.length > 0) {
    console.log(`\n⚠️  Encountered ${errors.length} parsing error(s):`);
    errors.forEach(({ file, error }) => {
      console.log(`   • ${file}: ${error}`);
    });
  }

  if (indexedModules.length === 0) {
    console.error('\n❌ No modules could be parsed successfully.');
    console.error('   Please check the module files and try again.');
    process.exit(1);
  }
}

/**
 * Sorts modules by tier, then by subject, then by id for consistent ordering.
 */
function sortModules(indexedModules: IndexedModule[]): void {
  const tierOrder = {
    foundation: 0,
    principle: 1,
    technology: 2,
    execution: 3,
  } as const;

  indexedModules.sort((a, b) => {
    // Sort by tier priority
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
    if (tierDiff !== 0) return tierDiff;

    // Then by subject
    const subjectDiff = a.subject.localeCompare(b.subject);
    if (subjectDiff !== 0) return subjectDiff;

    // Finally by id
    return a.id.localeCompare(b.id);
  });
}

/**
 * Writes the indexed modules to the index file with error handling.
 */
async function writeIndexFile(
  indexFile: string,
  indexedModules: IndexedModule[]
): Promise<void> {
  try {
    await writeFile(
      indexFile,
      JSON.stringify(indexedModules, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error(
      `❌ Failed to write index file: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  }
}

/**
 * Displays success summary and tier breakdown statistics.
 */
function reportSuccess(
  indexedModules: IndexedModule[],
  indexFile: string,
  errors: Array<{ file: string; error: string }>
): void {
  console.log(`\n✅ Successfully indexed ${indexedModules.length} module(s)`);
  console.log(`📋 Index written to: ${indexFile}`);

  // Display tier summary
  const tierCounts = indexedModules.reduce(
    (counts, module) => {
      counts[module.tier] = (counts[module.tier] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>
  );

  console.log('\n📊 Module breakdown by tier:');
  Object.entries(tierCounts).forEach(([tier, count]) => {
    console.log(`   • ${tier}: ${count} module(s)`);
  });

  if (errors.length > 0) {
    console.log(
      `\n⚠️  Note: ${errors.length} file(s) had parsing errors and were skipped.`
    );
  }
}

/**
 * Main index operation that orchestrates the entire indexing process.
 */
async function executeIndexOperation(): Promise<void> {
  console.log('🔍 Scanning modules directory...');

  const { modulesDir, indexFile } = getIndexPaths();
  const markdownFiles = await scanMarkdownFiles(modulesDir);

  if (markdownFiles.length === 0) {
    await createEmptyIndex(indexFile, modulesDir);
    return;
  }

  console.log(`📄 Found ${markdownFiles.length} markdown file(s)`);

  const { indexedModules, errors } = await parseAllModules(
    markdownFiles,
    modulesDir
  );
  validateParsingResults(indexedModules, errors);
  sortModules(indexedModules);
  await writeIndexFile(indexFile, indexedModules);
  reportSuccess(indexedModules, indexFile, errors);
}

/**
 * Creates and configures the index command.
 *
 * The index command scans all module markdown files in the instructions-modules/
 * directory and its subdirectories, parses their metadata, and writes the
 * collected information to a JSON index file for fast lookup operations.
 *
 * @returns Configured Commander.js command instance
 */
export function createIndexCommand(): Command {
  const command = new Command('index');

  command
    .description(
      'Scan all instruction modules and generate a searchable index for fast lookup and discovery.'
    )
    .addHelpText(
      'after',
      `
Examples:
  $ instructions-builder index
  $ instructions-builder index --modules-path ./custom-modules
`
    )
    .action(async () => {
      try {
        await executeIndexOperation();
      } catch (error) {
        console.error(
          `❌ Unexpected error during indexing: ${error instanceof Error ? error.message : String(error)}`
        );
        process.exit(1);
      }
    });

  return command;
}
