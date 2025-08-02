/* eslint-disable max-lines-per-function */
/**
 * @module commands/build
 * @description Command to build a persona from a configuration file.
 */

/**
 * Options for the build command.
 */
export interface BuildOptions {
  personaFilePath: string;
  /**
   * If true, enables verbose output.
   */
  verbose?: boolean;
}

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { handleError } from '../utils/error-handler.js';
import type { PersonaConfig } from '../types/index.js';
import { scanModules, validateModuleFile } from '../core/module-service.js';
import { validatePersona } from '../core/persona-service.js';
import { parse } from 'jsonc-parser';

/**
 * Handles the 'build' command.
 * @param options - The command options.
 * @param options.personaFilePath - The path to the persona configuration file.
 * @param options.verbose - If true, enables verbose output.
 */
export async function handleBuild(options: BuildOptions): Promise<void> {
  const { personaFilePath, verbose } = options;
  const spinner = ora('Starting build process...').start();
  try {
    if (verbose) {
      console.log(
        chalk.gray(`[verbose] Reading persona file: ${personaFilePath}`)
      );
    }
    // 1. Read and parse persona file
    spinner.text = `Reading persona file: ${personaFilePath}`;
    const personaFileContent = await fs.readFile(personaFilePath, 'utf8');
    const personaConfig: PersonaConfig = parse(
      personaFileContent
    ) as PersonaConfig;

    // 2. Validate persona file
    spinner.text = 'Validating persona file...';
    if (verbose) {
      console.log(chalk.gray('[verbose] Validating persona file...'));
    }
    const validationResult = validatePersona(personaConfig);
    if (!validationResult.isValid) {
      spinner.fail(chalk.red('Persona file validation failed.'));
      validationResult.errors.forEach(error =>
        console.error(chalk.yellow(`- ${error}`))
      );
      process.exit(1);
    }
    spinner.succeed('Persona file validated.');

    // 3. Scan for all available modules
    spinner.start('Scanning for available instruction modules...');
    if (verbose) {
      console.log(
        chalk.gray('[verbose] Scanning for modules required by persona...')
      );
    }
    const allModules = await scanModules(personaConfig.modules);
    spinner.succeed('Module scan complete.');

    // 4. Resolve and assemble modules
    spinner.start('Assembling persona instructions...');
    if (verbose) {
      console.log(chalk.gray('[verbose] Resolving and assembling modules...'));
    }
    const resolvedModules = await Promise.all(
      personaConfig.modules.map(async id => {
        const module = allModules.get(id);
        if (!module) {
          throw new Error(`Module with ID '${id}' not found.`);
        }
        const validationResult = await validateModuleFile(module.filePath);
        if (!validationResult.isValid) {
          spinner.fail(chalk.red(`Module validation failed for ${module.id}.`));
          validationResult.errors.forEach(error =>
            console.error(chalk.yellow(`- ${error}`))
          );
          process.exit(1);
        }
        return module;
      })
    );

    // Perform explicit positional validation for synergistic pairs
    if (verbose === true) {
      console.log(
        chalk.gray('[verbose] Performing synergistic pair validation')
      );
    }
    for (let i = 0; i < resolvedModules.length; i++) {
      const moduleA = resolvedModules[i];
      if (moduleA.implement) {
        const moduleB_id = moduleA.implement;
        if (verbose === true) {
          console.log(
            chalk.gray(
              `[verbose] Module '${moduleA.id}' implement '${moduleB_id}' - checking position`
            )
          );
        }

        // Check if there's a next module
        if (i + 1 >= resolvedModules.length) {
          console.warn(
            chalk.yellow(
              `Warning: Module '${moduleA.id}' implement '${moduleB_id}', but it is the last module in the list. The implemented module must follow immediately.`
            )
          );
        } else {
          const moduleB = resolvedModules[i + 1];
          if (moduleB.id !== moduleB_id) {
            console.warn(
              chalk.yellow(
                `Warning: Module '${moduleA.id}' implement '${moduleB_id}', but it is followed by '${moduleB.id}'. The implemented module must appear immediately after the implementing module.`
              )
            );
          } else if (verbose === true) {
            console.log(
              chalk.gray(
                `[verbose] Synergistic pair validated: '${moduleA.id}' → '${moduleB.id}'`
              )
            );
          }
        }
      }
    }

    const outputParts: string[] = [];
    resolvedModules.forEach((module, index) => {
      if (verbose) {
        console.log(
          chalk.gray(`[verbose] Adding module content: ${module.id}`)
        );
      }
      const filteredContent = module.content
        .split('\n')
        .map(line => line.replace(/\s*\/\/.*$/, ''))
        .join('\n');
      outputParts.push(filteredContent);

      if (personaConfig.attributions) {
        outputParts.push(`\n[Attribution: ${module.id}]`);
      }

      if (index < resolvedModules.length - 1) {
        outputParts.push('\n\n---\n');
      }
    });

    const finalContent = outputParts.join('').trim();

    // 5. Write to output file
    const defaultOutput = `${path.basename(
      personaFilePath,
      personaFilePath.endsWith('.persona.jsonc')
        ? '.persona.jsonc'
        : '.persona.json'
    )}.md`;
    const outputPath = path.resolve(
      process.cwd(),
      personaConfig.output || defaultOutput
    );
    if (verbose) {
      console.log(chalk.gray(`[verbose] Writing output to: ${outputPath}`));
    }
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, finalContent);

    spinner.succeed(
      chalk.green(
        `Successfully built persona '${personaConfig.name}' to ${outputPath}`
      )
    );
    if (verbose) {
      console.log(chalk.gray('[verbose] Build process complete.'));
    }
  } catch (error) {
    handleError(error, spinner);
  }
}
