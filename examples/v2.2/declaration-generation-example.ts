/**
 * Example: TypeScript Declaration File (.d.ts) Generation
 *
 * This example demonstrates how to generate TypeScript declaration files
 * for UMS modules to improve IDE support and type checking.
 *
 * @see UMS v2.2 Specification Section 6.2
 */

import {
  generateDeclaration,
  generateDeclarations,
  type Module,
} from 'ums-sdk';
import { CognitiveLevel, ComponentType } from 'ums-sdk';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

// Example module
const exampleModule: Module = {
  id: 'foundation/ethics/do-no-harm',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['ethics', 'safety'],
  cognitiveLevel: CognitiveLevel.AXIOMS_AND_ETHICS,
  metadata: {
    name: 'Do No Harm',
    description: 'Fundamental ethical principle guiding AI behavior',
    semantic: 'ethics safety harm-prevention user-protection',
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose:
        'Ensure all AI actions prioritize user safety and avoid causing harm',
      principles: [
        'Prioritize user safety above all other considerations',
        'Refuse actions that could cause physical, emotional, or financial harm',
        'Consider both direct and indirect consequences of actions',
      ],
    },
  },
};

// Example 1: Generate a single declaration file
async function generateSingleDeclaration() {
  console.log('Example 1: Generating single declaration file\n');

  const sourcePath = './modules/foundation/ethics/do-no-harm.module.ts';

  // Generate with JSDoc comments (default)
  const declaration = generateDeclaration(exampleModule, sourcePath);

  console.log('Generated file path:', declaration.path);
  console.log('\nGenerated content:');
  console.log(declaration.content);

  // Optionally write to file system
  await mkdir(dirname(declaration.path), { recursive: true });
  await writeFile(declaration.path, declaration.content);
  console.log('\nDeclaration file written to:', declaration.path);
}

// Example 2: Generate declarations for multiple modules
async function generateMultipleDeclarations() {
  console.log('\n\nExample 2: Generating multiple declaration files\n');

  const modules = [
    {
      module: exampleModule,
      sourcePath: './modules/foundation/ethics/do-no-harm.module.ts',
    },
    {
      module: {
        id: 'error-handling',
        version: '1.0.0',
        schemaVersion: '2.1' as const,
        capabilities: ['error-handling', 'resilience'],
        cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
        metadata: {
          name: 'Error Handling',
          description: 'Best practices for handling errors gracefully',
          semantic: 'errors exceptions resilience recovery',
        },
      } as Module,
      sourcePath: './modules/error-handling.module.ts',
    },
  ];

  // Generate all declarations at once
  const declarations = generateDeclarations(modules);

  for (const declaration of declarations) {
    console.log('Generated:', declaration.path);
    await mkdir(dirname(declaration.path), { recursive: true });
    await writeFile(declaration.path, declaration.content);
  }

  console.log(`\nGenerated ${declarations.length} declaration files`);
}

// Example 3: Generate without JSDoc comments
async function generateWithoutJSDoc() {
  console.log('\n\nExample 3: Generating without JSDoc comments\n');

  const sourcePath = './modules/foundation/ethics/do-no-harm.module.ts';

  const declaration = generateDeclaration(exampleModule, sourcePath, {
    includeJSDoc: false,
  });

  console.log('Generated content (no JSDoc):');
  console.log(declaration.content);
}

// Run examples
async function main() {
  try {
    await generateSingleDeclaration();
    await generateMultipleDeclarations();
    await generateWithoutJSDoc();

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
    process.exit(1);
  }
}

// Uncomment to run:
// main().catch(console.error);

export {
  generateSingleDeclaration,
  generateMultipleDeclarations,
  generateWithoutJSDoc,
};
