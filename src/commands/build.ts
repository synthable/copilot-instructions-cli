/**
 * Build command for the Copilot Instructions Builder CLI
 *
 * Compiles instruction modules according to persona configuration
 * and outputs the final instruction set.
 */

import { Command } from 'commander';
import { readFile, writeFile } from 'fs/promises';
import {
  createResolver,
  type TierOrderedResolutionResult,
} from '../core/resolver.js';
import type { PersonaFile } from '../types/index.js';

/**
 * Interface for the build command options
 */
interface BuildOptions {
  output?: string;
  modulesPath?: string;
  includeAttribution?: boolean;
  header?: string;
  footer?: string;
  foundation?: string[];
  principle?: string[];
  technology?: string[];
  execution?: string[];
  modules?: string[];
  optionalModules?: string[];
}

/**
 * Interface for the final merged configuration
 */
interface FinalConfig {
  output?: string | undefined;
  modulesPath?: string | undefined;
  includeAttribution?: boolean | undefined;
  header?: string | undefined;
  footer?: string | undefined;
  foundation?: string[] | undefined;
  principle?: string[] | undefined;
  technology?: string[] | undefined;
  execution?: string[] | undefined;
  modules?: string[] | undefined;
  optionalModules?: string[] | undefined;
}

/**
 * Loads and parses a persona file from the given path
 */
export async function loadPersonaFile(
  personaFilePath: string
): Promise<PersonaFile | null> {
  try {
    const fileContent = await readFile(personaFilePath, 'utf-8');
    const personaData = JSON.parse(fileContent) as PersonaFile;
    console.log(`✅ Loaded persona file: ${personaFilePath}`);
    return personaData;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.warn(`⚠️  Persona file not found: ${personaFilePath}`);
    } else if (error instanceof SyntaxError) {
      console.warn(
        `⚠️  Invalid JSON in persona file: ${personaFilePath} - ${error.message}`
      );
    } else {
      console.warn(
        `⚠️  Failed to load persona file: ${personaFilePath} - ${error instanceof Error ? error.message : String(error)}`
      );
    }
    return null;
  }
}

/**
 * Converts persona file configuration to build options format
 */
export function personaToOptions(persona: PersonaFile): Partial<BuildOptions> {
  const options: Partial<BuildOptions> = {};

  // Map output configuration
  if (persona.output?.file) {
    options.output = persona.output.file;
  }

  // Map format configuration
  if (persona.output?.format) {
    if (persona.output.format.includeAttribution !== undefined) {
      options.includeAttribution = persona.output.format.includeAttribution;
    }
    if (persona.output.format.header) {
      options.header = persona.output.format.header;
    }
    if (persona.output.format.footer) {
      options.footer = persona.output.format.footer;
    }
  }

  // Map modules
  if (persona.modules && persona.modules.length > 0) {
    options.modules = persona.modules;
  }

  // Map optional modules
  if (persona.optional_modules && persona.optional_modules.length > 0) {
    options.optionalModules = persona.optional_modules;
  }

  return options;
}

/**
 * Merges persona file options with CLI options, giving precedence to CLI options
 */
export function mergeConfigurations(
  personaOptions: Partial<BuildOptions>,
  cliOptions: BuildOptions
): FinalConfig {
  const merged: FinalConfig = {};

  // Merge scalar values (CLI options take precedence)
  merged.output = cliOptions.output ?? personaOptions.output;
  merged.modulesPath = cliOptions.modulesPath ?? personaOptions.modulesPath;
  merged.includeAttribution =
    cliOptions.includeAttribution ?? personaOptions.includeAttribution;
  merged.header = cliOptions.header ?? personaOptions.header;
  merged.footer = cliOptions.footer ?? personaOptions.footer;

  // Merge array values (CLI options take precedence, but combine if both exist)
  merged.foundation = cliOptions.foundation?.length
    ? cliOptions.foundation
    : personaOptions.foundation;
  merged.principle = cliOptions.principle?.length
    ? cliOptions.principle
    : personaOptions.principle;
  merged.technology = cliOptions.technology?.length
    ? cliOptions.technology
    : personaOptions.technology;
  merged.execution = cliOptions.execution?.length
    ? cliOptions.execution
    : personaOptions.execution;
  merged.modules = cliOptions.modules?.length
    ? cliOptions.modules
    : personaOptions.modules;
  merged.optionalModules = cliOptions.optionalModules?.length
    ? cliOptions.optionalModules
    : personaOptions.optionalModules;

  return merged;
}

/**
 * Compiles resolved modules into final output content.
 *
 * @param resolutionResult - The resolved modules organized by tier
 * @param config - Final configuration for compilation options
 * @returns Compiled instruction content as a string
 */
export function compileModules(
  resolutionResult: TierOrderedResolutionResult,
  config: FinalConfig
): string {
  const sections: string[] = [];

  // Add custom header if specified
  if (config.header) {
    sections.push(config.header);
    sections.push(''); // Empty line separator
  }

  // Process each tier in order
  const tierOrder: Array<keyof TierOrderedResolutionResult['byTier']> = [
    'foundation',
    'principle',
    'technology',
    'execution',
  ];

  for (const tier of tierOrder) {
    const modules = resolutionResult.byTier[tier];
    if (modules.length === 0) continue;

    // Add tier header
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
    sections.push(`## ${tierName} Tier`);
    sections.push('');

    // Add each module's content
    for (const module of modules) {
      // Add module attribution if enabled
      if (config.includeAttribution) {
        sections.push(`### ${module.metadata.name}`);
        sections.push(`*Source: ${module.id}*`);
        sections.push('');
      }

      // Add module content
      sections.push(module.content.trim());
      sections.push(''); // Empty line separator
    }
  }

  // Add custom footer if specified
  if (config.footer) {
    sections.push(config.footer);
  }

  return sections.join('\n');
}

/**
 * Loads and merges configuration from persona file and CLI options
 */
async function loadAndMergeConfiguration(
  personaFile?: string,
  cliOptions: BuildOptions = {}
): Promise<FinalConfig> {
  let finalConfig: FinalConfig;

  if (personaFile) {
    console.log(`📄 Loading persona file: ${personaFile}`);
    const personaData = await loadPersonaFile(personaFile);

    if (personaData) {
      const personaOptions = personaToOptions(personaData);
      finalConfig = mergeConfigurations(personaOptions, cliOptions);
      console.log(
        '🔧 Configuration merged successfully (CLI options take precedence)'
      );
    } else {
      finalConfig = { ...cliOptions };
      console.log('🔧 Using CLI options only (persona file unavailable)');
    }
  } else {
    finalConfig = { ...cliOptions };
    console.log('🔧 Using CLI options only (no persona file specified)');
  }

  console.log('📋 Final configuration:', JSON.stringify(finalConfig, null, 2));
  return finalConfig;
}

/**
 * Collects module patterns from tier-specific and general module configurations
 */
function collectModulePatterns(finalConfig: FinalConfig): string[] {
  const allPatterns: string[] = [];

  // Add tier-specific modules
  if (finalConfig.foundation?.length) {
    allPatterns.push(...finalConfig.foundation);
  }
  if (finalConfig.principle?.length) {
    allPatterns.push(...finalConfig.principle);
  }
  if (finalConfig.technology?.length) {
    allPatterns.push(...finalConfig.technology);
  }
  if (finalConfig.execution?.length) {
    allPatterns.push(...finalConfig.execution);
  }

  // Add general modules
  if (finalConfig.modules?.length) {
    allPatterns.push(...finalConfig.modules);
  }

  return allPatterns;
}

/**
 * Processes optional modules and adds existing ones to the patterns list
 */
async function processOptionalModules(
  finalConfig: FinalConfig,
  resolver: ReturnType<typeof createResolver>,
  allPatterns: string[]
): Promise<void> {
  if (!finalConfig.optionalModules?.length) {
    return;
  }

  for (const optionalPattern of finalConfig.optionalModules) {
    const moduleExists = await resolver.moduleExists(optionalPattern);
    if (moduleExists) {
      allPatterns.push(optionalPattern);
      console.log(`✅ Including optional module: ${optionalPattern}`);
    } else {
      console.log(
        `⚠️  Skipping optional module (not found): ${optionalPattern}`
      );
    }
  }
}

/**
 * Resolves modules and reports the results
 */
async function resolveAndReportModules(
  resolver: ReturnType<typeof createResolver>,
  allPatterns: string[]
): Promise<TierOrderedResolutionResult> {
  console.log(`🔄 Resolving ${allPatterns.length} module patterns...`);

  const resolutionResult =
    await resolver.resolveWithGlobAndTierOrder(allPatterns);

  // Report resolution results
  const totalResolved = Object.values(resolutionResult.byTier).reduce(
    (sum, modules) => sum + modules.length,
    0
  );

  console.log(`✅ Resolved ${totalResolved} modules`);

  if (resolutionResult.failed.length > 0) {
    console.warn(
      `⚠️  Failed to resolve ${resolutionResult.failed.length} modules:`
    );
    resolutionResult.failed.forEach(({ id, error }) => {
      console.warn(`   - ${id}: ${error}`);
    });
  }

  if (resolutionResult.notFound.length > 0) {
    console.warn(`⚠️  ${resolutionResult.notFound.length} modules not found:`);
    resolutionResult.notFound.forEach(id => {
      console.warn(`   - ${id}`);
    });
  }

  return resolutionResult;
}

/**
 * Compiles modules and writes the output file
 */
async function compileAndWriteOutput(
  resolutionResult: TierOrderedResolutionResult,
  finalConfig: FinalConfig,
  outputPath: string
): Promise<void> {
  console.log('🔨 Compiling modules...');
  const compiledContent = compileModules(resolutionResult, finalConfig);

  console.log(`💾 Writing output to: ${outputPath}`);
  await writeFile(outputPath, compiledContent, 'utf-8');
}

/**
 * Main execution function for the build command
 */
async function executeBuildOperation(
  personaFile?: string,
  options?: BuildOptions
): Promise<void> {
  console.log('Build process started');

  try {
    // Load and merge configuration
    const finalConfig = await loadAndMergeConfiguration(personaFile, options);

    // Determine paths
    const modulesPath = finalConfig.modulesPath || './instructions-modules';
    const outputPath = finalConfig.output || './instructions.md';

    console.log(`🔍 Resolving modules from: ${modulesPath}`);

    // Create resolver instance
    const resolver = createResolver(modulesPath);

    // Collect module patterns
    const allPatterns = collectModulePatterns(finalConfig);

    // Process optional modules
    await processOptionalModules(finalConfig, resolver, allPatterns);

    if (allPatterns.length === 0) {
      console.warn('⚠️  No modules specified for compilation');
      return;
    }

    // Resolve modules and report results
    const resolutionResult = await resolveAndReportModules(
      resolver,
      allPatterns
    );

    // Compile and write output
    await compileAndWriteOutput(resolutionResult, finalConfig, outputPath);

    console.log('✅ Build process completed successfully');
  } catch (error) {
    throw new Error(
      `Module resolution failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Creates and configures the build command.
 *
 * The build command compiles instruction modules into a final output file
 * based on a persona configuration file and/or CLI options.
 *
 * @returns Configured Commander.js command instance
 */
export function createBuildCommand(): Command {
  const command = new Command('build');

  command
    .description(
      'Compile instruction modules into a single output file, using a persona config and/or CLI options.'
    )
    .argument('[personaFile]', 'optional persona configuration file (JSON)')
    .option('-o, --output <file>', 'output file path')
    .option('-m, --modules-path <path>', 'path to modules directory')
    .option(
      '--include-attribution',
      'include module source attribution in output'
    )
    .option('--header <text>', 'custom header content for the output')
    .option('--footer <text>', 'custom footer content for the output')
    .option('--foundation <modules...>', 'foundation tier modules to include')
    .option('--principle <modules...>', 'principle tier modules to include')
    .option('--technology <modules...>', 'technology tier modules to include')
    .option('--execution <modules...>', 'execution tier modules to include')
    .option('--modules <modules...>', 'specific modules to include')
    .option(
      '--optional-modules <modules...>',
      'optional modules to include if available'
    )
    .addHelpText(
      'after',
      `
Examples:
  $ instructions-builder build persona.json
  $ instructions-builder build -o output.md --modules-path ./custom-modules --foundation basics
  $ instructions-builder build --header "# Copilot Instructions" --footer "---"
  $ instructions-builder build --modules module1 module2 --optional-modules extra1 extra2
`
    )
    .action(async (personaFile: string | undefined, options: BuildOptions) => {
      try {
        await executeBuildOperation(personaFile, options);
      } catch (error) {
        console.error(
          `❌ Unexpected error during build operation: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        process.exit(1);
      }
    });

  return command;
}
