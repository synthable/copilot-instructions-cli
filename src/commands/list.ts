/**
 * @module commands/list
 * @description Command to list available modules.
 */

import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { handleError } from '../utils/error-handler.js';
import { scanModules } from '../core/module-service.js';

interface ListOptions {
  tier?: string;
}

/**
 * Handles the 'list' command.
 * @param options - The command options.
 * @param options.tier - The tier to filter by.
 */
export async function handleList(options: ListOptions): Promise<void> {
  const spinner = ora('Scanning for modules...').start();
  try {
    const allModules = await scanModules();
    spinner.succeed('Module scan complete.');
    let modules = Array.from(allModules.values());

    if (options.tier) {
      modules = modules.filter(m => m.tier === options.tier);
    }

    modules.sort((a, b) => {
      const aHasLayer = a.layer !== undefined;
      const bHasLayer = b.layer !== undefined;

      if (aHasLayer && bHasLayer) {
        if (a.layer! < b.layer!) return -1;
        if (a.layer! > b.layer!) return 1;
      } else if (aHasLayer) {
        return -1;
      } else if (bHasLayer) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });

    if (modules.length === 0) {
      console.log(chalk.yellow('No modules found.'));
      return;
    }

    const maxWidth = process.stdout.columns || 80;
    const table = new Table({
      head: ['Layer', 'Tier/Subject', 'Name', 'Description'],
      colWidths: [8, 40, 24, maxWidth - (8 + 40 + 24 + 6)], // 6 for table borders/padding
      wordWrap: true,
      style: { head: ['cyan'] },
    });

    modules.forEach(m => {
      const subjectPath = m.subject ? `${m.tier}/${m.subject}` : m.tier;
      const layer = m.layer !== undefined ? m.layer.toString() : 'N/A';
      table.push([layer, subjectPath, m.name, m.description]);
    });

    console.log(table.toString());
  } catch (error) {
    handleError(error, spinner);
  }
}
