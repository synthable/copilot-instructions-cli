// tsx-execution.module.ts
import {
  Module,
  ComponentType,
} from '../../../../../packages/ums-lib/src/types/index.js';

export const tsxExecution: Module = {
  id: 'technology/typescript/tsx-execution',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: [
    'typescript-execution',
    'dynamic-loading',
    'runtime-transpilation',
    'module-loading',
  ],
  domain: ['typescript', 'nodejs', 'tooling'],

  metadata: {
    name: 'tsx TypeScript Execution',
    description:
      'On-the-fly TypeScript execution with tsx for dynamic module loading and development workflows',
    semantic: `
      tsx typescript ts-node runtime-execution dynamic-loading transpilation JIT
      just-in-time typescript-execution on-the-fly development-tools esbuild loader
      typescript-loader dynamic-imports esm modules node-loader typescript-without-compilation
      development-mode rapid-iteration typescript-runtime hot-loading module-resolution
    `,
    tags: [
      'typescript',
      'tsx',
      'runtime',
      'loader',
      'dynamic-loading',
      'development',
    ],
    relationships: {
      requires: ['principle/architecture/separation-of-concerns'],
      recommends: [
        'typescript-best-practices',
        'esm-modules',
        'dependency-management',
      ],
    },
    quality: {
      maturity: 'stable',
      confidence: 0.95,
      lastVerified: '2025-10-17',
    },
    license: 'MIT',
  },

  components: [
    {
      type: ComponentType.Instruction,
      instruction: {
        purpose:
          'Execute TypeScript files directly at runtime without pre-compilation using tsx for development workflows and dynamic module loading',
        process: [
          {
            step: 'Use tsx for development and dynamic TypeScript loading',
            detail:
              'Install tsx as optional dependency for runtime TypeScript execution',
            validate: {
              check: 'tsx installed as optionalDependency or devDependency',
              severity: 'important',
            },
          },
          {
            step: 'Load TypeScript modules with dynamic import and pathToFileURL',
            detail:
              'Convert file paths to file URLs and use dynamic import for ESM-compatible loading',
            examples: [
              {
                code: 'const fileUrl = pathToFileURL(filePath).href; const module = await import(fileUrl);',
                description: 'Standard pattern for loading .ts files with tsx',
              },
            ],
          },
          {
            step: 'Extract exports from dynamically loaded modules',
            detail:
              'Handle both named and default exports, filter out __esModule',
            validate: {
              check: 'Export extraction handles missing exports gracefully',
              severity: 'critical',
            },
          },
          {
            step: 'Use pre-compilation for production deployments',
            detail:
              'Compile TypeScript to JavaScript with tsc for production, use tsx only in development',
            when: 'Deploying to production or performance-critical environments',
          },
        ],
        constraints: [
          {
            rule: 'tsx must be available for TypeScript file loading',
            severity: 'error',
            rationale:
              'Dynamic TypeScript imports require tsx or similar loader',
            examples: {
              valid: [
                'optionalDependencies: { "tsx": "^4.0.0" }',
                'devDependencies: { "tsx": "^4.0.0" }',
              ],
              invalid: ['Attempting to import .ts files without tsx'],
            },
          },
          {
            rule: 'Use pathToFileURL for cross-platform file path handling',
            severity: 'error',
            rationale:
              'Dynamic import requires file:// URLs, not raw file paths',
            examples: {
              valid: [
                "import { pathToFileURL } from 'node:url'; const url = pathToFileURL(path).href;",
              ],
              invalid: [
                'await import("/absolute/path.ts"); // fails on Windows',
              ],
            },
          },
          {
            rule: 'Handle import errors gracefully with file path context',
            severity: 'error',
            rationale:
              'TypeScript syntax errors or missing files should provide clear error messages',
          },
          {
            rule: 'Filter __esModule from export extraction',
            severity: 'important',
            rationale:
              '__esModule is internal metadata, not a user-defined export',
            examples: {
              valid: [
                "const exports = Object.keys(moduleExports).filter(k => k !== '__esModule');",
              ],
            },
          },
        ],
        principles: [
          'Use tsx for development, tsc for production',
          'Always convert file paths to file URLs before dynamic import',
          'Provide clear error messages with file path context',
          'Handle both named and default exports flexibly',
          'Gracefully degrade if tsx is not available',
          'Validate module structure after loading',
        ],
        criteria: [
          {
            item: 'Does the loader convert file paths to file:// URLs?',
            severity: 'critical',
          },
          {
            item: 'Are import errors wrapped with file path context?',
            severity: 'critical',
          },
          {
            item: 'Does export extraction filter __esModule?',
            severity: 'important',
          },
          {
            item: 'Is tsx documented as optional/dev dependency?',
            severity: 'important',
          },
        ],
      },
    },
    {
      type: ComponentType.Knowledge,
      metadata: {
        purpose: 'Understand tsx execution model and usage patterns',
        context: [
          'typescript-runtime',
          'dynamic-loading',
          'development-workflow',
        ],
      },
      knowledge: {
        explanation:
          'tsx enables on-the-fly TypeScript execution by transpiling .ts files at runtime using esbuild, providing rapid development iteration without separate compilation steps',
        concepts: [
          {
            name: 'tsx vs ts-node vs tsc',
            description: 'Three approaches to TypeScript execution',
            comparison: {
              tsx: {
                transpiler: 'esbuild (ultra-fast)',
                speed: 'Fastest (20-100x faster than ts-node)',
                type_checking: 'None (transpile only)',
                use_case: 'Development, dynamic loading, rapid iteration',
                esm_support: 'Native ESM support',
                production_ready: 'No - development tool only',
              },
              ts_node: {
                transpiler: 'TypeScript compiler',
                speed: 'Slow (full type checking)',
                type_checking: 'Full type checking',
                use_case: 'Development with type safety',
                esm_support: 'Limited ESM support',
                production_ready: 'No - development tool only',
              },
              tsc: {
                transpiler: 'TypeScript compiler',
                speed: 'Build-time compilation',
                type_checking: 'Full type checking and validation',
                use_case: 'Production builds, CI/CD',
                esm_support: 'Full ESM output support',
                production_ready: 'Yes - production standard',
              },
            },
            recommendation:
              'Use tsx for development/dynamic loading, tsc for production builds',
          },
          {
            name: 'Dynamic Import with tsx',
            description:
              'Loading TypeScript modules at runtime using dynamic import',
            rationale:
              'Enables plugin systems, configuration loading, and modular architectures',
            examples: [
              {
                pattern:
                  "import { pathToFileURL } from 'node:url';\nconst fileUrl = pathToFileURL(filePath).href;\nconst module = await import(fileUrl);",
                validity: 'valid',
                reason:
                  'pathToFileURL handles cross-platform file path conversion',
              },
              {
                pattern: 'const module = await import("./file.ts");',
                validity: 'invalid',
                reason: 'Relative paths fail with dynamic import in Node.js',
              },
              {
                pattern: 'const module = await import("/absolute/path.ts");',
                validity: 'invalid',
                reason: 'Raw paths fail on Windows, need file:// protocol',
              },
            ],
            common_issues: [
              {
                issue: 'Import fails on Windows',
                cause: 'Using raw file paths instead of file:// URLs',
                detection: 'Error: Cannot find module on Windows only',
                solution:
                  'Use pathToFileURL() for cross-platform compatibility',
              },
              {
                issue: 'Module caching prevents hot reload',
                cause: 'Node.js caches dynamic imports',
                detection: 'Changes to .ts file not reflected',
                solution:
                  'Add cache-busting query parameter: import(`${url}?t=${Date.now()}`)',
              },
              {
                issue: 'TypeScript errors not caught',
                cause: 'tsx transpiles without type checking',
                detection: 'Runtime errors from type mismatches',
                solution: 'Run tsc --noEmit separately for type checking',
              },
            ],
          },
          {
            name: 'Export Extraction Pattern',
            description:
              'Safely extracting named or default exports from dynamically loaded modules',
            rationale:
              'Modules may export different structures; robust extraction prevents errors',
            patterns: [
              {
                pattern_name: 'Named Export Extraction',
                code: "const moduleObject = moduleExports['exportName'];\nif (!moduleObject) throw new Error('Export not found');",
                use_case: 'When export name is known (e.g., from module ID)',
                validation: 'Check export exists before accessing',
              },
              {
                pattern_name: 'Default Export Fallback',
                code: 'const obj = moduleExports.default || moduleExports[namedExport];',
                use_case: 'Support both default and named exports',
                validation: 'Prefer default, fallback to named',
              },
              {
                pattern_name: 'Available Exports Discovery',
                code: "const exports = Object.keys(moduleExports).filter(k => k !== '__esModule');",
                use_case: 'Finding available exports for error messages',
                validation: 'Filter out __esModule metadata',
              },
            ],
            best_practices: [
              'Always filter __esModule from export lists',
              'Provide clear error messages listing available exports',
              'Validate export structure after extraction',
              'Handle missing exports gracefully',
            ],
          },
          {
            name: 'UMS SDK Usage Pattern',
            description:
              'How tsx is used in UMS SDK for loading .module.ts and .persona.ts files',
            architecture: {
              layer: 'SDK (ums-sdk)',
              responsibility: 'File I/O and TypeScript execution',
              delegation: 'Parsing and validation delegated to ums-lib',
            },
            implementation_details: {
              module_loader: {
                file: 'ModuleLoader.ts',
                pattern: 'pathToFileURL + dynamic import',
                export_extraction: 'Named export using moduleIdToExportName()',
                validation:
                  'Delegates to ums-lib parseModule() and validateModule()',
                error_handling:
                  'Wraps errors with file path context (ModuleLoadError)',
              },
              persona_loader: {
                file: 'PersonaLoader.ts',
                pattern: 'pathToFileURL + dynamic import',
                export_extraction:
                  'Default export preferred, fallback to first named export',
                validation:
                  'Delegates to ums-lib parsePersona() and validatePersona()',
                error_handling: 'Wraps errors with file path context',
              },
            },
            key_insights: [
              'tsx enables plugin-like architecture for modules',
              'File organization drives module ID extraction',
              'SDK layer handles I/O, ums-lib handles domain logic',
              'Optional dependency pattern allows graceful degradation',
            ],
          },
        ],
      },
    },
    {
      type: ComponentType.Data,
      metadata: {
        purpose: 'Practical templates and checklists for tsx integration',
        context: ['implementation', 'troubleshooting', 'setup'],
      },
      data: {
        format: 'json',
        description:
          'Implementation templates, error handling patterns, and configuration examples for tsx-based TypeScript loading',
        value: {
          implementation_template: {
            basic_loader: {
              description: 'Minimal TypeScript file loader with tsx',
              code: `import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

async function loadTypescriptModule(filePath: string) {
  // Check file exists
  await readFile(filePath, 'utf-8');

  // Convert to file URL
  const fileUrl = pathToFileURL(filePath).href;

  // Dynamic import (tsx transpiles on-the-fly)
  const moduleExports = await import(fileUrl);

  // Extract exports
  const exportNames = Object.keys(moduleExports).filter(k => k !== '__esModule');

  return { moduleExports, exportNames };
}`,
              key_points: [
                'pathToFileURL ensures cross-platform compatibility',
                'File existence check provides early error detection',
                'Filter __esModule from export list',
              ],
            },
            named_export_loader: {
              description: 'Load specific named export with validation',
              code: `import { pathToFileURL } from 'node:url';

async function loadNamedExport<T>(
  filePath: string,
  exportName: string
): Promise<T> {
  const fileUrl = pathToFileURL(filePath).href;
  const moduleExports = await import(fileUrl);

  const exportValue = moduleExports[exportName];
  if (!exportValue) {
    const available = Object.keys(moduleExports).filter(k => k !== '__esModule');
    throw new Error(
      \`Export '\${exportName}' not found in \${filePath}. Available: \${available.join(', ')}\`
    );
  }

  return exportValue as T;
}`,
              validation: [
                'Checks export exists',
                'Provides helpful error with available exports',
                'Type-safe return value',
              ],
            },
            default_export_fallback: {
              description: 'Load with default export preference',
              code: `async function loadWithDefaultFallback<T>(
  filePath: string,
  namedExport?: string
): Promise<T> {
  const fileUrl = pathToFileURL(filePath).href;
  const moduleExports = await import(fileUrl);

  // Prefer default export
  if (moduleExports.default) {
    return moduleExports.default as T;
  }

  // Fallback to named export
  if (namedExport && moduleExports[namedExport]) {
    return moduleExports[namedExport] as T;
  }

  // Find first non-__esModule export
  const exports = Object.entries(moduleExports).filter(
    ([key]) => key !== '__esModule'
  );

  if (exports.length === 0) {
    throw new Error(\`No exports found in \${filePath}\`);
  }

  return exports[0][1] as T;
}`,
              use_case: 'Persona loading where both patterns are valid',
            },
          },
          error_handling_patterns: {
            file_not_found: {
              detection: "error.code === 'ENOENT'",
              handler: 'throw new ModuleNotFoundError(filePath);',
              message_pattern: 'File not found: {filePath}',
            },
            export_not_found: {
              detection: 'moduleExports[exportName] === undefined',
              handler: 'List available exports in error message for debugging',
              message_pattern:
                "Export '{exportName}' not found. Available: {availableExports}",
            },
            typescript_syntax_error: {
              detection: 'Import throws SyntaxError',
              handler: 'Wrap with context about file being loaded',
              message_pattern:
                'Failed to load {filePath}: {originalError.message}',
              recommendation:
                'Run tsc --noEmit to catch syntax errors before runtime',
            },
            type_mismatch: {
              detection: 'Runtime validation fails',
              handler:
                'Validate structure after import, throw descriptive error',
              message_pattern:
                'Module at {filePath} does not match expected structure',
              recommendation: 'Use Zod or similar for runtime validation',
            },
          },
          package_json_configuration: {
            optional_dependency: {
              description: 'tsx as optional dependency (recommended)',
              config: {
                optionalDependencies: {
                  tsx: '^4.0.0',
                },
              },
              rationale:
                'Allows package to work without tsx if files are pre-compiled',
              usage: 'Development and dynamic loading scenarios',
            },
            dev_dependency: {
              description: 'tsx as dev dependency',
              config: {
                devDependencies: {
                  tsx: '^4.0.0',
                },
              },
              rationale: 'Development-only tool, not needed in production',
              usage: 'Scripts and testing',
            },
            peer_dependency: {
              description: 'TypeScript as peer dependency',
              config: {
                peerDependencies: {
                  typescript: '>=5.0.0',
                },
                peerDependenciesMeta: {
                  typescript: {
                    optional: true,
                  },
                },
              },
              rationale:
                'Type checking is optional at runtime with tsx transpilation',
            },
          },
          workflow_checklist: {
            development: [
              {
                task: 'Install tsx',
                command: 'npm install tsx --save-dev',
                purpose: 'Enable TypeScript execution',
              },
              {
                task: 'Use dynamic import with pathToFileURL',
                validation: 'Test on Windows and Unix systems',
                purpose: 'Cross-platform compatibility',
              },
              {
                task: 'Run type checking separately',
                command: 'npm run typecheck (tsc --noEmit)',
                purpose: 'Catch type errors tsx does not detect',
              },
              {
                task: 'Test export extraction',
                validation: 'Verify both named and default exports work',
                purpose: 'Robust module loading',
              },
            ],
            production: [
              {
                task: 'Pre-compile TypeScript',
                command: 'tsc',
                purpose: 'Generate JavaScript files for production',
              },
              {
                task: 'Import .js files, not .ts',
                validation: 'Ensure import paths end with .js',
                purpose: 'Use compiled output, not source',
              },
              {
                task: 'Remove tsx from production dependencies',
                validation: 'Check dependencies vs devDependencies',
                purpose: 'Reduce production bundle size',
              },
              {
                task: 'Test production build',
                validation: 'Run without tsx installed',
                purpose: 'Verify no runtime tsx dependency',
              },
            ],
          },
          troubleshooting: {
            import_fails_windows: {
              symptom:
                'Module import fails on Windows but works on macOS/Linux',
              cause: 'Raw file path used instead of file:// URL',
              diagnostic: 'Check if pathToFileURL is used',
              fix: "Use pathToFileURL from 'node:url' module",
              code_example:
                "import { pathToFileURL } from 'node:url';\nconst url = pathToFileURL(absolutePath).href;\nawait import(url);",
            },
            changes_not_reflected: {
              symptom: 'Changes to .ts file not reflected after re-import',
              cause: 'Node.js module cache',
              diagnostic: 'Restart process or use cache-busting',
              fix: 'Add query parameter to import URL',
              code_example: 'await import(`${fileUrl}?t=${Date.now()}`);',
              note: 'Only use in development, not production',
            },
            type_errors_at_runtime: {
              symptom: 'Type errors only discovered at runtime',
              cause: 'tsx transpiles without type checking',
              diagnostic: 'Run tsc --noEmit to see type errors',
              fix: 'Integrate type checking into development workflow',
              code_example:
                '"scripts": { "typecheck": "tsc --noEmit", "pretest": "npm run typecheck" }',
            },
            tsx_not_installed: {
              symptom: 'Import fails with "Unknown file extension .ts"',
              cause: 'tsx not installed or not loaded',
              diagnostic: 'Check if tsx is in dependencies',
              fix: 'Install tsx or pre-compile TypeScript',
              code_example: 'npm install tsx --save-dev (or --save-optional)',
            },
          },
          ums_sdk_examples: {
            module_loader_pattern: {
              description: 'How ModuleLoader uses tsx in ums-sdk',
              file_location: 'packages/ums-sdk/src/loaders/module-loader.ts',
              key_code: `// Convert file path to file URL for dynamic import
const fileUrl = pathToFileURL(filePath).href;

// Dynamically import the TypeScript file (tsx handles compilation)
const moduleExports = (await import(fileUrl)) as Record<string, unknown>;

// Calculate expected export name from module ID
const exportName = moduleIdToExportName(moduleId);

// Extract the module object from exports
const moduleObject = moduleExports[exportName];

if (!moduleObject) {
  const availableExports = Object.keys(moduleExports).filter(
    key => key !== '__esModule'
  );
  throw new InvalidExportError(filePath, exportName, availableExports);
}`,
              insights: [
                'pathToFileURL ensures Windows compatibility',
                'moduleIdToExportName converts module ID to camelCase export name',
                'Provides helpful error with available exports',
                'Filters __esModule from export list',
              ],
            },
            persona_loader_pattern: {
              description: 'How PersonaLoader uses tsx in ums-sdk',
              file_location: 'packages/ums-sdk/src/loaders/persona-loader.ts',
              key_code: `// Convert file path to file URL for dynamic import
const fileUrl = pathToFileURL(filePath).href;

// Dynamically import the TypeScript file
const personaExports = (await import(fileUrl)) as Record<string, unknown>;

// Try to find a persona export - prefer default export, fall back to named
let candidateExport: unknown;

if (personaExports.default) {
  candidateExport = personaExports.default;
} else {
  // Try to find any non-__esModule export
  const namedExports = Object.entries(personaExports).filter(
    ([key]) => key !== '__esModule'
  );

  if (namedExports.length === 0) {
    throw new ModuleLoadError(
      'Persona file does not export anything.',
      filePath
    );
  }

  // Use first named export
  candidateExport = namedExports[0][1];
}`,
              insights: [
                'Flexible export detection: default or named',
                'Filters __esModule from consideration',
                'Provides clear error when no exports found',
                'Delegates validation to ums-lib',
              ],
            },
          },
        },
      },
    },
  ],
};
