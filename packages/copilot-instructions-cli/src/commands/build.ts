/**
 * @module commands/ums-build
 * @description UMS v1.0 build command implementation
 */

import chalk from 'chalk';
import { handleError } from '../utils/error-handler.js';
import { BuildEngine, type BuildOptions as EngineBuildOptions } from 'ums-lib';
import { createBuildProgress } from '../utils/progress.js';
import { writeOutputFile, readFromStdin } from '../utils/file-operations.js';

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
    const result = await processPersonaAndModules(buildEnvironment, progress);

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
  buildEngine: BuildEngine;
  buildOptions: EngineBuildOptions;
  outputPath?: string | undefined;
}

/**
 * Sets up the build environment and validates inputs
 */
async function setupBuildEnvironment(
  options: BuildOptions,
  progress: ReturnType<typeof createBuildProgress>
): Promise<BuildEnvironment> {
  const { persona: personaPath, output: outputPath, verbose } = options;

  const buildEngine = new BuildEngine();
  let personaContent: string | undefined;

  // Determine persona source
  let personaSource: string;
  if (personaPath) {
    personaSource = personaPath;
    progress.update(`Reading persona file: ${personaPath}`);

    if (verbose) {
      console.log(
        chalk.gray(`[INFO] build: Reading persona from ${personaPath}`)
      );
    }
  } else {
    // Read from stdin
    personaSource = 'stdin';
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
  }

  // Determine output target
  const outputTarget = outputPath ?? 'stdout';

  // Prepare build options
  const buildOptions: EngineBuildOptions = {
    personaSource,
    outputTarget,
  };

  if (personaContent) {
    buildOptions.personaContent = personaContent;
  }

  if (verbose) {
    buildOptions.verbose = verbose;
  }

  return {
    buildEngine,
    buildOptions,
    outputPath,
  };
}

/**
 * Processes persona and modules to generate build result
 */
async function processPersonaAndModules(
  environment: BuildEnvironment,
  progress: ReturnType<typeof createBuildProgress>
): Promise<Awaited<ReturnType<BuildEngine['build']>>> {
  progress.update('Building persona...');
  const result = await environment.buildEngine.build(environment.buildOptions);

  // Show warnings if any
  if (result.warnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    for (const warning of result.warnings) {
      console.log(chalk.yellow(`  • ${warning}`));
    }
    console.log();
  }

  return result;
}

/**
 * Generates output files (Markdown and build report)
 */
async function generateOutputFiles(
  result: Awaited<ReturnType<BuildEngine['build']>>,
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
