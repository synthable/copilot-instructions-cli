/**
 * @module commands/ums-build
 * @description UMS v1.0 build command implementation
 */

import { writeFile } from 'fs/promises';
import chalk from 'chalk';
import { handleError } from '../utils/error-handler.js';
import { formatError } from '../utils/error-formatting.js';
import { BuildEngine, type BuildOptions as EngineBuildOptions } from 'ums-lib';
import { createBuildProgress } from '../utils/progress.js';

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
  const { persona: personaPath, output: outputPath, verbose } = options;
  const progress = createBuildProgress('build', verbose);

  try {
    progress.start('Starting UMS v1.0 build process...');

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
        console.error(
          formatError({
            command: 'build',
            context: 'input validation',
            issue: 'no persona file specified and stdin is not available',
            suggestion:
              'use --persona <file> to specify a persona file or pipe YAML content to stdin',
          })
        );
        process.exit(1);
      }

      personaContent = await readFromStdin();

      if (!personaContent.trim()) {
        progress.fail('No persona content provided via stdin');
        console.error(
          formatError({
            command: 'build',
            context: 'input validation',
            issue: 'no persona content received from stdin',
            suggestion:
              'ensure YAML content is piped to stdin or use --persona <file>',
          })
        );
        process.exit(1);
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

    progress.update('Building persona...');
    const result = await buildEngine.build(buildOptions);

    progress.succeed('Build completed successfully');

    // Show warnings if any
    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      for (const warning of result.warnings) {
        console.log(chalk.yellow(`  • ${warning}`));
      }
      console.log();
    }

    // Output the result
    if (outputPath) {
      // Write markdown file
      await writeFile(outputPath, result.markdown, 'utf8');
      console.log(
        chalk.green(`✓ Persona instructions written to: ${outputPath}`)
      );

      // Write build report JSON file (M4 requirement)
      const buildReportPath = outputPath.replace(/\.md$/, '.build.json');
      await writeFile(
        buildReportPath,
        JSON.stringify(result.buildReport, null, 2),
        'utf8'
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
 * Reads content from stdin
 */
async function readFromStdin(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];

    process.stdin.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    process.stdin.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    process.stdin.on('error', reject);

    // Start reading
    process.stdin.resume();
  });
}

/**
 * Checks if a file path has a .persona.yml extension
 */
export function isPersonaFile(filePath: string): boolean {
  return filePath.endsWith('.persona.yml');
}

/**
 * Validates that the persona file has the correct extension
 */
export function validatePersonaFile(filePath: string): void {
  if (!isPersonaFile(filePath)) {
    throw new Error(
      `Persona file must have .persona.yml extension, got: ${filePath}\n` +
        'UMS v1.0 requires persona files to use YAML format with .persona.yml extension.'
    );
  }
}
