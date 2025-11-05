/**
 * @module commands/ums-build
 * @description UMS build command implementation
 * Supports UMS v2.0 (TypeScript) format only
 *
 * Uses SDK's buildPersona() for all build orchestration.
 */

import chalk from 'chalk';
import { handleError } from '../utils/error-handler.js';
import { buildPersona } from 'ums-sdk';
import { createBuildProgress } from '../utils/progress.js';
import { writeOutputFile } from '../utils/file-operations.js';

/**
 * Options for the build command
 */
export interface BuildOptions {
  /** Path to persona .ts file */
  persona: string;
  /** Output file path, or undefined for stdout */
  output?: string;
  /** Enable verbose output */
  verbose?: boolean;
}

/**
 * Handles the 'build' command
 */
export async function handleBuild(options: BuildOptions): Promise<void> {
  const { persona: personaPath, output: outputPath, verbose } = options;
  const progress = createBuildProgress('build', verbose);

  try {
    progress.start('Starting UMS build process...');

    if (verbose) {
      console.log(
        chalk.gray(`[INFO] build: Building persona from ${personaPath}`)
      );
    }

    progress.update('Building persona...');

    // Use SDK's buildPersona() for all orchestration
    const result = await buildPersona(personaPath, {
      includeStandard: true,
    });

    if (verbose) {
      console.log(
        chalk.gray(`[INFO] build: Discovered ${result.modules.length} modules`)
      );
    }

    // Show warnings if any
    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      for (const warning of result.warnings) {
        console.log(chalk.yellow(`  • ${warning}`));
      }
      console.log();
    }

    progress.update('Writing output files...');

    // Generate output files
    if (outputPath) {
      // Write markdown file
      await writeOutputFile(outputPath, result.markdown);
      console.log(
        chalk.green(`✓ Persona instructions written to: ${outputPath}`)
      );

      // Write build report JSON file
      const buildReportPath = outputPath.replace(/\.md$/, '.build.json');
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
      }
    } else {
      // Write to stdout
      console.log(result.markdown);
    }

    progress.succeed('Build completed successfully');

    // Log success summary in verbose mode
    if (verbose) {
      console.log(
        chalk.gray(
          `[INFO] build: Successfully built persona '${result.persona.name}' with ${result.modules.length} modules`
        )
      );

      // Count module groups (v2.0 format)
      const moduleGroups = result.persona.modules.filter(
        entry => typeof entry !== 'string'
      );
      const groupCount = moduleGroups.length;

      if (groupCount > 1) {
        console.log(
          chalk.gray(`[INFO] build: Organized into ${groupCount} module groups`)
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
