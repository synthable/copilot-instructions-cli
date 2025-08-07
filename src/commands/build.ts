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

    // Process synergistic pairs - prepend implemented modules before implementing modules
    if (verbose === true) {
      console.log(
        chalk.gray(
          '[verbose] Processing synergistic pairs and reordering modules'
        )
      );
    }

    const finalModules: typeof resolvedModules = [];
    const processedModules = new Set<string>();

    for (const module of resolvedModules) {
      if (processedModules.has(module.id)) {
        continue; // Skip if already processed
      }

      if (module.implement && module.implement.length > 0) {
        if (verbose === true) {
          console.log(
            chalk.gray(
              `[verbose] Module '${module.id}' implements: ${module.implement.join(', ')}`
            )
          );
        }

        // Validate all implemented modules exist in the persona
        const moduleIds = new Set(resolvedModules.map(m => m.id));
        for (const implementedId of module.implement) {
          if (!moduleIds.has(implementedId)) {
            console.warn(
              chalk.yellow(
                `Warning: Module '${module.id}' implements '${implementedId}', but it is not included in the persona modules list.`
              )
            );
          }
        }

        // Add implemented modules first (prepend)
        for (const implementedId of module.implement) {
          const implementedModule = resolvedModules.find(
            m => m.id === implementedId
          );
          if (implementedModule && !processedModules.has(implementedId)) {
            finalModules.push(implementedModule);
            processedModules.add(implementedId);
            if (verbose === true) {
              console.log(
                chalk.gray(
                  `[verbose] Prepended implemented module: ${implementedId}`
                )
              );
            }
          }
        }
      }

      // Add the implementing module (or regular module)
      if (!processedModules.has(module.id)) {
        finalModules.push(module);
        processedModules.add(module.id);
        if (
          verbose === true &&
          module.implement &&
          module.implement.length > 0
        ) {
          console.log(
            chalk.gray(`[verbose] Added implementing module: ${module.id}`)
          );
        }
      }
    }

    // Update resolvedModules with the reordered array
    resolvedModules.splice(0, resolvedModules.length, ...finalModules);

    if (verbose === true) {
      console.log(
        chalk.gray(
          `[verbose] Final module order: ${resolvedModules.map(m => m.id).join(', ')}`
        )
      );
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
