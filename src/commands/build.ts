/**
 * @module commands/build
 * @description Command to build a persona from a configuration file.
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { handleError } from '../utils/error-handler.js';
import type { PersonaConfig } from '../types/index.js';
import { scanModules, validatePersona } from '../core/module-service.js';

/**
 * Handles the 'build' command.
 * @param personaFilePath - The path to the persona configuration file.
 */
export async function handleBuild(personaFilePath: string) {
  const spinner = ora('Starting build process...').start();
  try {
    // 1. Read and parse persona file
    spinner.text = `Reading persona file: ${personaFilePath}`;
    const personaFileContent = await fs.readFile(personaFilePath, 'utf8');
    const personaConfig: PersonaConfig = JSON.parse(personaFileContent);

    // 2. Validate persona file
    spinner.text = 'Validating persona file...';
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
    const allModules = await scanModules();
    spinner.succeed('Module scan complete.');

    // 4. Resolve and assemble modules
    spinner.start('Assembling persona instructions...');
    const resolvedModules = personaConfig.modules.map(id => {
      const module = allModules.get(id);
      if (!module) {
        throw new Error(`Module with ID '${id}' not found.`);
      }
      return module;
    });

    const outputParts: string[] = [];
    resolvedModules.forEach((module, index) => {
      outputParts.push(module.content);
      if (index < resolvedModules.length - 1) {
        outputParts.push('\n---\n');
        if (personaConfig.attributions) {
          outputParts.push(`[Attribution: ${module.id}]\n`);
        }
      }
    });
    const finalContent = outputParts.join('');

    // 5. Write to output file
    const defaultOutput = `${path.basename(
      personaFilePath,
      '.persona.json'
    )}.md`;
    const outputPath = path.resolve(
      process.cwd(),
      personaConfig.output || defaultOutput
    );
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, finalContent);

    spinner.succeed(
      chalk.green(
        `Successfully built persona '${personaConfig.name}' to ${outputPath}`
      )
    );
  } catch (error) {
    handleError(error, spinner);
  }
}
