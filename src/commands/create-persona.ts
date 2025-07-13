/**
 * @module commands/create-persona
 * @description Command to create a new persona configuration file.
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import { handleError } from '../utils/error-handler.js';
import type { PersonaConfig } from '../types/index.js';
import { parse } from 'jsonc-parser';

interface CreatePersonaOptions {
  buildOutput?: string;
  personaOutput?: string;
  attributions?: boolean;
  template?: string;
}

/**
 * Handles the 'create-persona' command.
 * @param name - The name of the new persona.
 * @param description - The description for the new persona.
 * @param options - The command options.
 */
async function getPersonaConfig(
  name: string,
  description: string,
  slugifiedName: string,
  options: CreatePersonaOptions,
  spinner: Ora
): Promise<PersonaConfig> {
  if (options.template) {
    const templatePath = path.resolve(
      process.cwd(),
      'templates',
      'persona',
      `${options.template}.persona.jsonc`
    );
    try {
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      spinner.text = `Using template: ${options.template}`;
      return parse(templateContent) as PersonaConfig;
    } catch (templateError: unknown) {
      if (
        templateError instanceof Error &&
        (templateError as NodeJS.ErrnoException).code === 'ENOENT'
      ) {
        spinner.fail(chalk.red(`Template file not found: ${templatePath}`));
      } else if (templateError instanceof Error) {
        spinner.fail(
          chalk.red(`Error reading template file: ${templateError.message}`)
        );
      } else {
        spinner.fail(
          chalk.red('An unknown error occurred reading the template.')
        );
      }
      process.exit(1);
    }
  } else {
    return {
      name,
      description,
      output: options.buildOutput || `${slugifiedName}.md`,
      attributions: options.attributions ?? true,
      modules: [],
    };
  }
}

async function prepareFileSystem(
  filePath: string,
  spinner: Ora
): Promise<void> {
  try {
    await fs.access(filePath);
    spinner.fail(chalk.red(`Persona file already exists at: ${filePath}`));
    process.exit(1);
  } catch {
    // File does not exist, which is what we want.
  }
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });
}

export async function handleCreatePersona(
  name: string,
  description: string = 'No description provided.',
  options: CreatePersonaOptions
): Promise<void> {
  const spinner = ora('Creating new persona...').start();

  try {
    const slugifiedName = name.toLowerCase().replace(/\s+/g, '-');
    const defaultFileName = `${slugifiedName}.persona.jsonc`;
    const filePath = options.personaOutput
      ? path.resolve(process.cwd(), options.personaOutput)
      : path.resolve(process.cwd(), defaultFileName);

    await prepareFileSystem(filePath, spinner);

    spinner.text = 'Generating persona configuration...';
    const personaConfig = await getPersonaConfig(
      name,
      description,
      slugifiedName,
      options,
      spinner
    );

    // Override with provided values
    personaConfig.name = name;
    personaConfig.description = description;
    personaConfig.output = options.buildOutput || `${slugifiedName}.md`;
    if (options.attributions !== undefined) {
      personaConfig.attributions = options.attributions;
    }

    const fileContent = JSON.stringify(personaConfig, null, 2);

    spinner.text = `Writing persona to: ${filePath}`;
    await fs.writeFile(filePath, fileContent);

    spinner.succeed(
      chalk.green(`Successfully created new persona at: ${filePath}`)
    );
    console.log(
      chalk.yellow(
        `\nRemember to edit the "modules" array in the new file to customize your persona.`
      )
    );
  } catch (error) {
    handleError(error, spinner);
  }
}
