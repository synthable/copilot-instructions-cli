// src/index.ts
// Previous content might be here, or it might be a new file effectively.

console.log("Application starting...");

// Add example usage for ModuleLoader below

// --- ModuleLoader Example ---
import { ModuleLoader } from './core/module-loader';
import { ModuleDiscoveryError, ModuleLoadError } from './core/module-loader-errors';
import * as path from 'path';

async function main() {
  console.log('--- Running ModuleLoader Example ---');

  // Define a directory for example modules relative to src/
  // For a real application, this path would be more robustly determined.
  const exampleModulesPath = path.resolve(__dirname, 'modules'); // Assumes a 'modules' directory sibling to 'core'

  console.log(`Attempting to load modules from: ${exampleModulesPath}`);

  const loader = new ModuleLoader({
    baseDir: exampleModulesPath, // Or use default './src/modules' if that's where you'd put them
    moduleSuffix: '.example.ts', // Using a specific suffix for these examples
  });

  try {
    const discoveredModules = await loader.discoverModules();
    console.log(`Discovered ${discoveredModules.length} example module(s):`);
    discoveredModules.forEach(modPath => console.log(` - ${modPath}`));

    if (discoveredModules.length === 0) {
      console.log(`No example modules found. To test loading, create a file like:`);
      console.log(`${path.join(exampleModulesPath, 'myTest.example.ts')} with content like:`);
      console.log('export const message = "Hello from myTest module!";');
      console.log('export default function greet() { console.log("Greet from default export!"); }');
    }

    for (const modulePath of discoveredModules) {
      try {
        console.log(`Attempting to load module: ${modulePath}`);
        // Define an expected structure for the example modules if possible
        type ExampleModule = { message?: string; default?: () => void; value?: number };
        const module = await loader.loadModule<ExampleModule>(modulePath);

        console.log(`Successfully loaded: ${modulePath}`);
        if (module.default && typeof module.default === 'function') {
          module.default();
        }
        if (module.message) {
          console.log(`Message from module: ${module.message}`);
        }
        if (module.value !== undefined) {
          console.log(`Value from module: ${module.value}`);
        }
        console.log('---');
      } catch (e) {
        if (e instanceof ModuleLoadError) {
          console.error(`Error loading module ${e.modulePath}: ${e.message}`);
        } else {
          console.error(`An unexpected error occurred while loading ${modulePath}:`, e);
        }
      }
    }
  } catch (e) {
    if (e instanceof ModuleDiscoveryError) {
      console.error(`Error discovering modules from ${e.directoryPath}: ${e.message}`);
    } else {
      console.error('An unexpected error occurred during module discovery:', e);
    }
  }
  console.log('--- ModuleLoader Example Finished ---');
}

// Check if the application has a main execution block or if we should just call main()
// For a CLI tool, this might be part of a command execution.
// For a library, this main() might not be called directly in index.ts.
// For now, let's call it to demonstrate.
main().catch(error => {
  console.error("Unhandled error in main execution:", error);
});
