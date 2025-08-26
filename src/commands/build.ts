/* eslint-disable max-lines-per-function */
/**
 * @module commands/build
 * @description Command to build a persona from a configuration file.
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { parse } from 'jsonc-parser';
import { handleError } from '../utils/error-handler.js';
import type { PersonaConfig } from '../types/index.js';
import { scanModules, validateModuleFile } from '../core/module-service.js';
import { validatePersona } from '../core/persona-service.js';

/**
 * Options for the build command.
 */
export interface BuildOptions {
  personaFilePath?: string;
  modules?: string[];
  name?: string;
  description?: string;
  output?: string;
  stdout?: boolean;
  noAttributions?: boolean;
  verbose?: boolean;
}

async function loadPersonaConfig(
  personaFilePath: string,
  verbose?: boolean
): Promise<PersonaConfig> {
  if (verbose === true) {
    console.log(
      chalk.gray(`[verbose] Reading persona file: ${personaFilePath}`)
    );
  }
  const personaFileContent = await fs.readFile(personaFilePath, 'utf8');
  return parse(personaFileContent) as PersonaConfig;
}

/**
 * Handles the 'build' command.
 * @param options - The command options.
 */
export async function handleBuild(options: BuildOptions): Promise<void> {
  const {
    personaFilePath,
    modules,
    name,
    description,
    output,
    stdout,
    noAttributions,
    verbose,
  } = options;
  const spinner = ora('Starting build process...').start();

  try {
    let personaConfig: PersonaConfig;

    if (personaFilePath) {
      spinner.text = `Reading persona file: ${personaFilePath}`;
      personaConfig = await loadPersonaConfig(personaFilePath, verbose);
    } else {
      spinner.text = 'Creating persona from modules...';
      personaConfig = {
        name: name || 'Unnamed Persona',
        description: description || 'A persona built from modules.',
        modules: modules || [],
        attributions: !noAttributions,
        output: output,
      };
    }

    // Override with command-line options
    if (name) personaConfig.name = name;
    if (description) personaConfig.description = description;
    if (output) personaConfig.output = output;
    if (noAttributions) personaConfig.attributions = false;

    spinner.text = 'Validating persona configuration...';
    if (verbose === true) {
      console.log(chalk.gray('[verbose] Starting persona validation'));
      console.log(chalk.gray(`[verbose] Persona name: ${personaConfig.name}`));
      console.log(
        chalk.gray(
          `[verbose] Persona description: ${personaConfig.description}`
        )
      );
      console.log(
        chalk.gray(
          `[verbose] Modules to include: ${personaConfig.modules.join(', ')}`
        )
      );
      console.log(
        chalk.gray(
          `[verbose] Attributions enabled: ${personaConfig.attributions}`
        )
      );
    }
    const validationResult = validatePersona(personaConfig);
    if (!validationResult.isValid) {
      spinner.fail(chalk.red('Persona configuration validation failed.'));
      validationResult.errors.forEach(error =>
        console.error(chalk.yellow(`- ${error}`))
      );
      process.exit(1);
    }
    if (verbose === true) {
      console.log(
        chalk.gray('[verbose] Persona validation completed successfully')
      );
    }
    spinner.succeed('Persona configuration validated.');

    spinner.start('Scanning for available instruction modules...');
    if (verbose === true) {
      console.log(chalk.gray('[verbose] Starting module scan'));
      console.log(
        chalk.gray(
          `[verbose] Looking for modules: ${personaConfig.modules.join(', ')}`
        )
      );
    }
    const allModules = await scanModules(personaConfig.modules);
    if (verbose === true) {
      console.log(
        chalk.gray(`[verbose] Found ${allModules.size} total modules`)
      );
      for (const [id, module] of allModules) {
        console.log(
          chalk.gray(`[verbose] Module found: ${id} -> ${module.filePath}`)
        );
      }
    }
    spinner.succeed('Module scan complete.');

    spinner.start('Assembling persona instructions...');
    if (verbose === true) {
      console.log(
        chalk.gray('[verbose] Starting module validation and assembly')
      );
      console.log(
        chalk.gray(
          `[verbose] Processing ${personaConfig.modules.length} modules`
        )
      );
    }
    if (verbose === true) {
      console.log(chalk.gray('[verbose] Module validation order:'));
      personaConfig.modules.forEach((id, index) => {
        console.log(chalk.gray(`[verbose]   ${index + 1}. ${id}`));
      });
    }
    const resolvedModules = await Promise.all(
      personaConfig.modules.map(async (id, index) => {
        if (verbose === true) {
          console.log(
            chalk.gray(
              `[verbose] [Step ${index + 1}/${personaConfig.modules.length}] Validating module: ${id}`
            )
          );
        }
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
        if (verbose === true) {
          console.log(
            chalk.gray(
              `[verbose] [Step ${index + 1}/${personaConfig.modules.length}] Module ${id} validated successfully`
            )
          );
        }
        return module;
      })
    );

    // Process synergistic pairs - check for module order
    if (verbose === true) {
      console.log(
        chalk.gray(
          '[verbose] Processing synergistic pairs and checking module order'
        )
      );
    }

    const moduleIndexMap = new Map<string, number>();
    resolvedModules.forEach((module, index) => {
      moduleIndexMap.set(module.id, index);
    });

    for (const module of resolvedModules) {
      if (module.implement && module.implement.length > 0) {
        const moduleIndex = moduleIndexMap.get(module.id)!;
        for (const implementedId of module.implement) {
          const implementedIndex = moduleIndexMap.get(implementedId);
          if (implementedIndex === undefined) {
            console.warn(
              chalk.yellow(
                `Warning: Module '${module.id}' implements '${implementedId}', but it is not included in the persona modules list.`
              )
            );
          } else if (implementedIndex > moduleIndex) {
            console.warn(
              chalk.yellow(
                `Warning: Module '${module.id}' implements '${implementedId}', but it appears after it in the module list. For best results, '${implementedId}' should appear before '${module.id}'.`
              )
            );
          }
        }
      }
    }

    if (verbose === true) {
      console.log(
        chalk.gray(
          `[verbose] Final module order: ${resolvedModules.map(m => m.id).join(', ')}`
        )
      );
    }

    const outputParts: string[] = [];
    if (verbose === true) {
      console.log(chalk.gray('[verbose] Starting content assembly'));
      console.log(
        chalk.gray(
          `[verbose] Processing ${resolvedModules.length} resolved modules`
        )
      );
    }
    resolvedModules.forEach((module, index) => {
      if (verbose === true) {
        console.log(
          chalk.gray(
            `[verbose] Assembling content for module ${index + 1}/${resolvedModules.length}: ${module.id}`
          )
        );
      }
      const filteredContent = module.content
        .split('\n')
        .map(line => line.replace(/\s*\/\/.*$/, ''))
        .join('\n');
      outputParts.push(filteredContent);

      if (personaConfig.attributions === true) {
        if (verbose === true) {
          console.log(
            chalk.gray(`[verbose] Adding attribution for module: ${module.id}`)
          );
        }
        outputParts.push(`\n[Attribution: ${module.id}]`);
      }

      if (index < resolvedModules.length - 1) {
        outputParts.push('\n\n---\n');
      }
    });

    const finalContent = outputParts.join('').trim();

    if (verbose === true) {
      console.log(chalk.gray('[verbose] Content assembly completed'));
      console.log(
        chalk.gray(
          `[verbose] Final content length: ${finalContent.length} characters`
        )
      );
    }

    if (stdout === true) {
      if (verbose === true) {
        console.log(chalk.gray('[verbose] Writing output to stdout'));
      }
      process.stdout.write(finalContent);
      spinner.succeed(
        chalk.green(
          `Successfully built persona '${personaConfig.name}' to stdout.`
        )
      );
    } else {
      if (verbose === true) {
        console.log(chalk.gray('[verbose] Writing output to file'));
      }
      const defaultOutput =
        personaFilePath != null
          ? `${path.basename(
              personaFilePath,
              personaFilePath.endsWith('.persona.jsonc')
                ? '.persona.jsonc'
                : '.persona.json'
            )}.md`
          : 'persona.md';
      const outputPath = path.resolve(
        process.cwd(),
        personaConfig.output ?? defaultOutput
      );
      if (verbose === true) {
        console.log(chalk.gray(`[verbose] Output path: ${outputPath}`));
      }
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, finalContent);
      spinner.succeed(
        chalk.green(
          `Successfully built persona '${personaConfig.name}' to ${outputPath}`
        )
      );
    }

    if (verbose === true) {
      console.log(chalk.gray('[verbose] Build process complete.'));
    }
  } catch (error) {
    handleError(error, spinner);
  }
}
