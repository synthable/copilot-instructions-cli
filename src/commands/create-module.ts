/**
 * @module commands/create
 * @description Command to create a new instruction module.
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import { handleError } from '../utils/error-handler.js';

const MODULES_ROOT_DIR = path.resolve(process.cwd(), 'instructions-modules');

interface CreateOptions {
  order?: number;
}

/**
 * Generates the markdown content for a new instruction module, including frontmatter.
 *
 * @param name - The name of the module.
 * @param description - The description of the module.
 * @param tier - The tier for the module (e.g., 'foundation').
 * @param subject - The subject/category for the module.
 * @param options - Additional options (e.g., order for foundation tier).
 * @returns The markdown content for the module as a string.
 * @throws If the order is not provided or invalid for foundation tier modules.
 */
function generateModuleContent(
  name: string,
  description: string,
  tier: string,
  subject: string,
  options: CreateOptions
): string {
  const frontmatter: string[] = ['---', `name: "${name}"`];
  frontmatter.push(
    `description: "${description || 'A new instruction module.'}"`
  );

  if (tier === 'foundation') {
    const defaultOrders: { [key: string]: number } = {
      bias: 1,
      communication: 2,
      'decision-making': 3,
      epistemology: 4,
      ethics: 0,
      judgment: 2,
      logic: 0,
      metacognition: 4,
      'problem-solving': 1,
      reasoning: 1,
    };

    let order = options.order;
    if (order === undefined) {
      order = defaultOrders[subject];
      if (order === undefined) {
        throw new Error(
          `Foundation tier modules require a --order option or a recognized subject. Valid subjects with default orders are: ${Object.keys(defaultOrders).join(', ')}`
        );
      }
    }

    if (!Number.isInteger(order) || order < 0 || order > 5) {
      throw new Error('Order must be an integer between 0 and 5.');
    }
    frontmatter.push(`order: ${order}`);
  }

  frontmatter.push('---', '', 'Your content here...', '');
  return frontmatter.join('\n');
}

/**
 * Prepares the file path and module directory for a new instruction module.
 * Checks if the module file already exists and throws an error if it does.
 *
 * @param tier - The tier for the module (e.g., 'foundation').
 * @param subject - The subject/category for the module.
 * @param name - The name of the module (used for slugifying the filename).
 * @returns An object containing the file path and module directory.
 * @throws If the module file already exists or if an unexpected file system error occurs.
 */
async function prepareModulePath(
  tier: string,
  subject: string,
  name: string
): Promise<{ filePath: string; moduleDirectory: string }> {
  const slugifiedName = name.toLowerCase().replace(/\s+/g, '-');
  const fileName = `${slugifiedName}.md`;
  const moduleDirectory = path.join(MODULES_ROOT_DIR, tier, subject);
  const filePath = path.join(moduleDirectory, fileName);

  try {
    await fs.access(filePath);
    // If access does not throw, the file exists.
    throw new Error(`Module already exists at: ${filePath}`);
  } catch (error) {
    // If the error is anything other than "file not found", rethrow it.
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
    // Otherwise, the file does not exist, which is what we want.
  }

  return { filePath, moduleDirectory };
}

/**
 * Handles errors that occur during module creation.
 * Displays an error message using the spinner and exits the process.
 *
 * @param error - The error encountered during creation.
 * @param spinner - The Ora spinner instance for displaying status.
 */
function handleCreationError(error: unknown, spinner: Ora): void {
  if (error instanceof Error) {
    spinner.fail(chalk.red(error.message));
  } else {
    handleError(error, spinner);
  }
  process.exit(1);
}

/**
 * Handles the 'create' command.
 * @param tier - The tier for the new module (e.g., 'foundation').
 * @param subject - The subject/category for the new module.
 * @param name - The name of the new module (will be slugified for the filename).
 * @param description - The description for the new module.
 * @param options - The command options (e.g., order for foundation tier).
 */
export async function handleCreateModule(
  tier: string,
  subject: string,
  name: string,
  description: string,
  options: CreateOptions
): Promise<void> {
  const spinner = ora('Creating new module...').start();

  try {
    const { filePath, moduleDirectory } = await prepareModulePath(
      tier,
      subject,
      name
    );

    spinner.text = `Ensuring directory exists: ${moduleDirectory}`;
    await fs.mkdir(moduleDirectory, { recursive: true });

    spinner.text = 'Generating module content...';
    const fileContent = generateModuleContent(
      name,
      description,
      tier,
      subject,
      options
    );

    spinner.text = `Writing module to: ${filePath}`;
    await fs.writeFile(filePath, fileContent);

    spinner.succeed(
      chalk.green(`Successfully created new module at: ${filePath}`)
    );
  } catch (error) {
    handleCreationError(error, spinner);
  }
}
