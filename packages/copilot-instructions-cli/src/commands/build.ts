/**
 * @module commands/ums-build
 * @description UMS v1.0 build command implementation
 */

import chalk from 'chalk';
import { handleError } from '../utils/error-handler.js';
import {
  parsePersona,
  renderMarkdown,
  generateBuildReport,
  ConflictError,
  type UMSPersona,
  type UMSModule,
  type BuildReport,
  type ModuleRegistry,
} from 'ums-lib';
import { createBuildProgress } from '../utils/progress.js';
import { writeOutputFile, readFromStdin } from '../utils/file-operations.js';
import { discoverAllModules } from '../utils/module-discovery.js';

/**
 * Options for the build command
 */
export interface BuildOptions {
  /** Path to persona file, or undefined for stdin */
  persona?: string;
  /** Output file path, or undefined for stdout */
  output?: string;
  /** Enable verbose output */
  verbose?: boolean;
}

/**
 * Handles the 'build' command
 */
export async function handleBuild(options: BuildOptions): Promise<void> {
  const { verbose } = options;
  const progress = createBuildProgress('build', verbose);

  try {
    progress.start('Starting UMS v1.0 build process...');

    // Setup build environment
    const buildEnvironment = await setupBuildEnvironment(options, progress);

    // Process persona and modules
    const result = processPersonaAndModules(buildEnvironment, progress);

    // Generate output files
    await generateOutputFiles(result, buildEnvironment, verbose);

    progress.succeed('Build completed successfully');

    // Log success summary in verbose mode
    if (verbose) {
      console.log(
        chalk.gray(
          `[INFO] build: Successfully built persona '${result.persona.name}' with ${result.modules.length} modules`
        )
      );
      if (result.persona.moduleGroups.length > 1) {
        console.log(
          chalk.gray(
            `[INFO] build: Organized into ${result.persona.moduleGroups.length} module groups`
          )
        );
      }
    }
  } catch (error) {
    progress.fail('Build failed');
    handleError(error, {
      command: 'build',
      context: 'build process',
      suggestion: 'check persona file syntax and module references',
      ...(verbose && { verbose, timestamp: verbose }),
    });
    process.exit(1);
  }
}

/**
 * Build environment configuration
 */
interface BuildEnvironment {
  registry: ModuleRegistry;
  persona: UMSPersona;
  outputPath?: string | undefined;
  warnings: string[];
}

/**
 * Sets up the build environment and validates inputs
 */
async function setupBuildEnvironment(
  options: BuildOptions,
  progress: ReturnType<typeof createBuildProgress>
): Promise<BuildEnvironment> {
  const { persona: personaPath, output: outputPath, verbose } = options;

  // Discover modules and populate registry
  progress.update('Discovering modules...');
  const moduleDiscoveryResult = await discoverAllModules();

  if (verbose) {
    const totalModules = moduleDiscoveryResult.registry.size();
    const conflictingIds = moduleDiscoveryResult.registry.getConflictingIds();

    console.log(
      chalk.gray(`[INFO] build: Discovered ${totalModules} unique module IDs`)
    );

    if (conflictingIds.length > 0) {
      console.log(
        chalk.yellow(
          `[INFO] build: Found ${conflictingIds.length} modules with conflicts`
        )
      );
    }

    if (moduleDiscoveryResult.warnings.length > 0) {
      console.log(chalk.yellow('\nModule Discovery Warnings:'));
      for (const warning of moduleDiscoveryResult.warnings) {
        console.log(chalk.yellow(`  - ${warning}`));
      }
    }
  }

  // Load persona
  progress.update('Loading persona...');
  let personaContent: string;

  if (personaPath) {
    progress.update(`Reading persona file: ${personaPath}`);
    const { readFile } = await import('fs/promises');
    personaContent = await readFile(personaPath, 'utf-8');

    if (verbose) {
      console.log(
        chalk.gray(`[INFO] build: Reading persona from ${personaPath}`)
      );
    }
  } else {
    progress.update('Reading persona from stdin...');

    if (process.stdin.isTTY) {
      progress.fail('No persona file specified and stdin is not available');
      throw new Error(
        'No persona file specified and stdin is not available. ' +
          'Use --persona <file> to specify a persona file or pipe YAML content to stdin.'
      );
    }

    personaContent = await readFromStdin();

    if (!personaContent.trim()) {
      progress.fail('No persona content provided via stdin');
      throw new Error(
        'No persona content received from stdin. ' +
          'Ensure YAML content is piped to stdin or use --persona <file>.'
      );
    }

    if (verbose) {
      console.log(chalk.gray('[INFO] build: Reading persona from stdin'));
    }
  }

  // Parse persona
  const persona = parsePersona(personaContent);

  if (verbose) {
    console.log(chalk.gray(`[INFO] build: Loaded persona '${persona.name}'`));
  }

  const allWarnings = [...moduleDiscoveryResult.warnings];

  return {
    registry: moduleDiscoveryResult.registry,
    persona,
    outputPath,
    warnings: allWarnings,
  };
}

/**
 * Result of build process
 */
interface BuildResult {
  markdown: string;
  modules: UMSModule[];
  persona: UMSPersona;
  warnings: string[];
  buildReport: BuildReport;
}

/**
 * Processes persona and modules to generate build result
 */
function processPersonaAndModules(
  environment: BuildEnvironment,
  progress: ReturnType<typeof createBuildProgress>
): BuildResult {
  progress.update('Resolving modules from registry...');

  // Resolve all required modules from registry using the registry's default strategy
  const requiredModuleIds = environment.persona.moduleGroups.flatMap(
    group => group.modules
  );

  const resolvedModules: UMSModule[] = [];
  const resolutionWarnings: string[] = [];
  const missingModules: string[] = [];

  for (const moduleId of requiredModuleIds) {
    try {
      const module = environment.registry.resolve(moduleId);
      if (module) {
        resolvedModules.push(module);
      } else {
        missingModules.push(moduleId);
      }
    } catch (error) {
      // Handle ConflictError specifically - these should fail the build
      if (error instanceof ConflictError) {
        throw error; // Re-throw ConflictError to fail the build
      }

      // Handle other errors as warnings
      if (error instanceof Error) {
        resolutionWarnings.push(error.message);
      }
      missingModules.push(moduleId);
    }
  }

  // Check for missing modules
  if (missingModules.length > 0) {
    throw new Error(`Missing modules: ${missingModules.join(', ')}`);
  }

  progress.update('Building persona...');

  // Generate Markdown
  const markdown = renderMarkdown(environment.persona, resolvedModules);

  // Generate Build Report
  const buildReport = generateBuildReport(environment.persona, resolvedModules);

  const allWarnings = [...environment.warnings, ...resolutionWarnings];

  // Show warnings if any
  if (allWarnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    for (const warning of allWarnings) {
      console.log(chalk.yellow(`  • ${warning}`));
    }
    console.log();
  }

  return {
    markdown,
    modules: resolvedModules,
    persona: environment.persona,
    warnings: allWarnings,
    buildReport,
  };
}

/**
 * Generates output files (Markdown and build report)
 */
async function generateOutputFiles(
  result: BuildResult,
  environment: BuildEnvironment,
  verbose?: boolean
): Promise<void> {
  if (environment.outputPath) {
    // Write markdown file
    await writeOutputFile(environment.outputPath, result.markdown);
    console.log(
      chalk.green(
        `✓ Persona instructions written to: ${environment.outputPath}`
      )
    );

    // Write build report JSON file (M4 requirement)
    const buildReportPath = environment.outputPath.replace(
      /\.md$/,
      '.build.json'
    );
    await writeOutputFile(
      buildReportPath,
      JSON.stringify(result.buildReport, null, 2)
    );
    console.log(chalk.green(`✓ Build report written to: ${buildReportPath}`));

    if (verbose) {
      console.log(
        chalk.gray(
          `[INFO] build: Generated ${result.markdown.length} characters of Markdown`
        )
      );
      console.log(
        chalk.gray(
          `[INFO] build: Used ${result.modules.length} modules from persona '${result.persona.name}'`
        )
      );
    }
  } else {
    // Write to stdout
    console.log(result.markdown);
  }
}
