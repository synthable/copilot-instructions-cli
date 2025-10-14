/**
 * Performance benchmarks for UMS ModuleRegistry
 * Run with: npm run benchmark
 */

import { ModuleRegistry } from '../core/registry/module-registry.js';
import type { Module, ModuleSource } from '../types/index.js';

// Create mock modules for benchmarking
function createMockModule(id: string): Module {
  return {
    id,
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['specification'],
    metadata: {
      name: `Module ${id}`,
      description: `Test module ${id}`,
      semantic: `test module ${id}`,
    },
  };
}

function benchmark(name: string, fn: () => void, iterations = 1000): number {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(
    `${name}: ${totalTime.toFixed(2)}ms total, ${avgTime.toFixed(4)}ms avg (${iterations} iterations)`
  );
  return avgTime;
}

function runBenchmarks(): void {
  console.log('🏃 Running ModuleRegistry Performance Benchmarks\n');

  const registry = new ModuleRegistry('warn');
  const source: ModuleSource = { type: 'standard', path: 'benchmark' };

  // Pre-populate with some modules
  const modules: Module[] = [];
  for (let i = 0; i < 100; i++) {
    const module = createMockModule(`module-${i}`);
    modules.push(module);
    registry.add(module, source);
  }

  console.log('📊 Registry Operations:');

  // Benchmark add operation
  benchmark(
    'Add module',
    () => {
      const module = createMockModule(`temp-${Math.random()}`);
      registry.add(module, source);
    },
    1000
  );

  // Benchmark resolve operation (no conflicts)
  benchmark(
    'Resolve module (no conflict)',
    () => {
      registry.resolve('module-50');
    },
    1000
  );

  // Add conflicting modules for conflict resolution benchmarks
  for (let i = 0; i < 10; i++) {
    const conflictModule = createMockModule('conflict-test');
    registry.add(conflictModule, { type: 'local', path: `path-${i}` });
  }

  // Benchmark resolve operation (with conflicts)
  benchmark(
    'Resolve module (with conflicts)',
    () => {
      registry.resolve('conflict-test', 'warn');
    },
    1000
  );

  // Benchmark bulk operations
  benchmark(
    'Resolve all modules',
    () => {
      registry.resolveAll('warn');
    },
    100
  );

  // Benchmark conflict inspection
  benchmark(
    'Get conflicts',
    () => {
      registry.getConflicts('conflict-test');
    },
    1000
  );

  benchmark(
    'Get conflicting IDs',
    () => {
      registry.getConflictingIds();
    },
    1000
  );

  console.log('\n📈 Performance Summary:');
  console.log(`Registry size: ${registry.size()} unique module IDs`);
  console.log(`Conflicting modules: ${registry.getConflictingIds().length}`);
  console.log('✅ All benchmarks completed successfully!');
}

// Run benchmarks if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmarks();
}

export { runBenchmarks };
