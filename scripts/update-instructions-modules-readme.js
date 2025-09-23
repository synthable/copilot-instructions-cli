#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * Generate instructions-modules/README.md from UMS v1.0 modules.
 *
 * Changes for UMS v1.0:
 * - Scan .module.yml files instead of Markdown with frontmatter
 * - Parse YAML and read meta.name, meta.description
 * - Build hierarchy from module id: <tier>/<subject>/<module-name>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const TARGET_DIRECTORY = 'instructions-modules';
const README_FILENAME = 'README.md';
const README_PATH = path.join(TARGET_DIRECTORY, README_FILENAME);
const VALID_TIERS = new Set([
  'foundation',
  'principle',
  'technology',
  'execution',
]);

// --- Helpers ---
/**
 * Parse a .module.yml file and return minimal metadata for listing.
 * @param {string} fullPath
 * @returns {{id:string, name:string, description:string}|null}
 */
function parseModuleYaml(fullPath) {
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const doc = YAML.parse(raw);
    if (!doc || typeof doc !== 'object') return null;
    const id = doc.id;
    const meta = doc.meta || {};
    const name = meta.name;
    const description = meta.description;
    if (
      typeof id !== 'string' ||
      typeof name !== 'string' ||
      typeof description !== 'string'
    ) {
      return null; // skip invalid/incomplete modules
    }
    return { id, name, description };
  } catch (err) {
    console.warn(`⚠️ Failed to parse ${fullPath}: ${err.message}`);
    return null;
  }
}

/**
 * Recursively collect all modules under a directory.
 * @param {string} dir
 * @returns {Array<{id:string,name:string,description:string,path:string}>}
 */
function collectModules(dir) {
  const acc = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      acc.push(...collectModules(fullPath));
    } else if (item.endsWith('.module.yml')) {
      const parsed = parseModuleYaml(fullPath);
      if (!parsed) continue;
      const relPath = path
        .relative(TARGET_DIRECTORY, fullPath)
        .replace(/\\/g, '/');
      acc.push({ ...parsed, path: relPath });
    }
  }
  return acc;
}

/**
 * Build a hierarchical tree from module ids.
 * @param {Array<{id:string,name:string,description:string,path:string}>} modules
 */
function buildTreeFromModules(modules) {
  const root = { modules: [], subcategories: {} };
  for (const mod of modules) {
    const segments = mod.id.split('/');
    const startIdx = segments[0].startsWith('@') ? 1 : 0;
    const rel = segments.slice(startIdx);
    const tier = rel[0];
    if (!VALID_TIERS.has(tier)) continue;
    const subjectSegments = rel.slice(1, rel.length - 1);
    let node =
      root.subcategories[tier] ||
      (root.subcategories[tier] = { modules: [], subcategories: {} });
    for (const seg of subjectSegments) {
      node =
        node.subcategories[seg] ||
        (node.subcategories[seg] = { modules: [], subcategories: {} });
    }
    node.modules.push({
      name: mod.name,
      description: mod.description,
      path: mod.path,
    });
  }
  sortTree(root);
  return root;
}

function sortTree(node) {
  if (node.modules) node.modules.sort((a, b) => a.name.localeCompare(b.name));
  const keys = Object.keys(node.subcategories || {});
  for (const k of keys) sortTree(node.subcategories[k]);
}

/**
 * Render a node (modules + subcategories) into nested markdown list.
 * @param {{modules:Array, subcategories:object}} categoryNode
 * @param {number} indentLevel
 * @returns {string}
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
  console.log(
    `🚀 Generating README.md for '${TARGET_DIRECTORY}' (UMS v1.0)...`
  );

  if (!fs.existsSync(TARGET_DIRECTORY)) {
    console.error(`❌ Error: Directory "${TARGET_DIRECTORY}" not found.`);
    process.exit(1);
  }

  const collected = collectModules(TARGET_DIRECTORY);
  const moduleTree = buildTreeFromModules(collected);

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

try {
  main();
} catch (err) {
  console.error('❌ Error generating README:', err);
  process.exit(1);
}
