/* eslint-disable max-lines-per-function */
/**
 * @module commands/search
 * @description Command to search for modules.
 */

import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { scanModules, formatImplementDisplay } from '../core/module-service.js';
import { handleError } from '../utils/error-handler.js';

interface SearchOptions {
  tier?: string;
}

/**
 * Handles the 'search' command.
 * @param query - The search query.
 * @param options - The command options.
 * @param options.tier - The tier to filter by.
 */
export async function handleSearch(
  query: string,
  options: SearchOptions
): Promise<void> {
  const spinner = ora('Scanning for modules...').start();
  try {
    const allModules = await scanModules();
    spinner.succeed('Module scan complete.');
    let modules = Array.from(allModules.values());
    const lowerCaseQuery = query.toLowerCase();

    if (options.tier) {
      modules = modules.filter(m => m.tier === options.tier);
    }

    const results = modules
      .filter(
        m =>
          m.name.toLowerCase().includes(lowerCaseQuery) ||
          m.description.toLowerCase().includes(lowerCaseQuery)
      )
      .sort((a, b) => {
        const aHasOrder = a.order !== undefined;
        const bHasOrder = b.order !== undefined;

        if (aHasOrder && bHasOrder) {
          if (a.order! < b.order!) return -1;
          if (a.order! > b.order!) return 1;
        } else if (aHasOrder) {
          return -1;
        } else if (bHasOrder) {
          return 1;
        }

        return a.name.localeCompare(b.name);
      });

    if (results.length === 0) {
      console.log(chalk.yellow('No modules found matching your query.'));
      return;
    }

    const maxWidth = process.stdout.columns || 80;
    const table = new Table({
      head: ['Order', 'Tier/Subject', 'Name', 'Description', 'Implement'],
      colWidths: [8, 32, 20, maxWidth - (8 + 32 + 20 + 16 + 10), 16], // 10 for table borders/padding
      wordWrap: true,
      style: { head: ['cyan'] },
    });

    results.forEach(m => {
      const subjectPath = m.subject ? `${m.tier}/${m.subject}` : m.tier;
      const order = m.order !== undefined ? m.order.toString() : 'N/A';
      const implement = formatImplementDisplay(m.implement);
      table.push([order, subjectPath, m.name, m.description, implement]);
    });

    console.log(table.toString());
  } catch (error) {
    handleError(error, spinner);
  }
}
