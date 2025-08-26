#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * This script automatically generates the README.md file for the
 * 'instructions-modules' directory. It scans all module files, reads their
 * frontmatter, and builds a nested list that matches the directory structure.
 *
 * This is designed to run on Node.js and is ideal for your development
 * environment on your MacBook Pro.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const TARGET_DIRECTORY = 'instructions-modules';
const README_FILENAME = 'README.md';
const README_PATH = path.join(TARGET_DIRECTORY, README_FILENAME);

/**
 * Parses a YAML frontmatter block from a file's content.
 * @param {string} fileContent - The full content of the file.
 * @returns {object|null} A key-value map of the frontmatter or null if not found.
 */
function parseFrontmatter(fileContent) {
  if (!fileContent.trim().startsWith('---')) return null;
  const endOfFrontmatter = fileContent.indexOf('\n---', 1);
  if (endOfFrontmatter === -1) return null;

  const frontmatterBlock = fileContent.substring(4, endOfFrontmatter);
  const data = {};
  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();
      // Check for and remove matching single or double quotes from the value
      if (
        (value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))
      ) {
        value = value.substring(1, value.length - 1);
      }
      if (key) data[key] = value;
    }
  });
  return data;
}

/**
 * Recursively scans for modules and builds a nested object structure.
 * @param {string} dir - The directory to scan.
 * @returns {object} A nested object representing the directory structure.
 */
function buildModuleTree(dir) {
  const tree = { modules: [], subcategories: {} };
  const list = fs.readdirSync(dir);

  list.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      tree.subcategories[item] = buildModuleTree(fullPath);
    } else if (path.extname(item) === '.md' && item !== README_FILENAME) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      if (frontmatter && frontmatter.name && frontmatter.description) {
        tree.modules.push({
          name: frontmatter.name,
          description: frontmatter.description,
          path: path.relative(TARGET_DIRECTORY, fullPath).replace(/\\/g, '/'),
        });
      }
    }
  });
  // Sort modules alphabetically by name
  tree.modules.sort((a, b) => a.name.localeCompare(b.name));
  return tree;
}

/**
 * Generates markdown for a category and its subcategories recursively.
 * @param {object} categoryNode - The node from the module tree.
 * @param {number} indentLevel - The current indentation level for the list.
 * @returns {string} The generated markdown string.
 */
function generateMarkdownForCategory(categoryNode, indentLevel = 0) {
  let markdown = '';
  const indent = '  '.repeat(indentLevel);

  // Render modules in the current category
  categoryNode.modules.forEach(module => {
    markdown += `${indent}- [${module.name}](${module.path}) - ${module.description}\n`;
  });

  // Render subcategories
  const sortedSubcategories = Object.keys(categoryNode.subcategories).sort();
  sortedSubcategories.forEach(subCategoryName => {
    const subCategoryNode = categoryNode.subcategories[subCategoryName];
    if (
      subCategoryNode.modules.length > 0 ||
      Object.keys(subCategoryNode.subcategories).length > 0
    ) {
      const formattedName = subCategoryName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      markdown += `${indent}- **${formattedName}**\n`;
      markdown += generateMarkdownForCategory(subCategoryNode, indentLevel + 1);
    }
  });

  return markdown;
}

/**
 * Main execution function.
 */
function main() {
  console.log(`🚀 Generating README.md for '${TARGET_DIRECTORY}'...`);

  if (!fs.existsSync(TARGET_DIRECTORY)) {
    console.error(`❌ Error: Directory "${TARGET_DIRECTORY}" not found.`);
    process.exit(1);
  }

  const moduleTree = buildModuleTree(TARGET_DIRECTORY);

  // --- Static Header ---
  let readmeContent = `# Instruction Modules

This directory contains a collection of instruction modules that provide guidance on various topics, including technology, foundational principles, and execution playbooks. These modules are designed to be used as a knowledge base for building intelligent agents.

The modules are organized into a hierarchical structure. Below is a list of all available modules.

---
`;

  // --- Dynamic Content ---
  const sortedTiers = Object.keys(moduleTree.subcategories).sort();
  sortedTiers.forEach(tierName => {
    const tierNode = moduleTree.subcategories[tierName];
    const formattedTierName =
      tierName.charAt(0).toUpperCase() + tierName.slice(1);

    // You can add descriptions for top-level tiers here if you want
    let tierDescription = '';
    if (formattedTierName === 'Execution')
      tierDescription = 'Playbooks for executing common tasks.';
    if (formattedTierName === 'Foundation')
      tierDescription =
        'Core principles and concepts for reasoning, problem-solving, and decision-making.';
    if (formattedTierName === 'Principle')
      tierDescription =
        'Guiding principles for software development, architecture, and process.';
    if (formattedTierName === 'Technology')
      tierDescription =
        'Guidance on specific technologies, languages, and platforms.';

    readmeContent += `\n## ${formattedTierName}\n\n${tierDescription}\n\n`;
    readmeContent += generateMarkdownForCategory(tierNode);
  });

  fs.writeFileSync(README_PATH, readmeContent, 'utf8');
  console.log(`✅ Successfully updated ${README_PATH}`);
}

main();
