import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  handleSearch,
  searchModules,
  filterAndSortModules,
} from './search.js';
import { discoverAllModules } from '../utils/module-discovery.js';
import { ModuleRegistry, CognitiveLevel } from 'ums-lib';
import { deductiveReasoning } from '../__fixtures__/modules/deductive-reasoning.module.js';
import { testingPrinciples } from '../__fixtures__/modules/testing-principles.module.js';
import { errorHandling } from '../__fixtures__/modules/error-handling.module.js';

// Mock dependencies
vi.mock('../utils/module-discovery.js', () => ({
  discoverAllModules: vi.fn(),
}));

vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

vi.mock('../utils/progress.js', () => ({
  createDiscoveryProgress: vi.fn(() => ({
    start: vi.fn(),
    update: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
  })),
}));

// Mock console to avoid test output noise
vi.spyOn(console, 'log').mockImplementation(() => {
  /* noop */
});

describe('searchModules', () => {
  // Test fixtures
  const mockModule1 = deductiveReasoning;
  const mockModule2 = testingPrinciples;
  const mockModule3 = errorHandling;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find modules by name', () => {
    const modules = [mockModule1, mockModule2];
    const results = searchModules(modules, 'Deductive');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('foundation/logic/deductive-reasoning');
  });

  it('should find modules by description', () => {
    const modules = [mockModule1, mockModule2];
    const results = searchModules(modules, 'quality');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(m => m.id === 'principle/quality/testing')).toBe(true);
  });

  it('should find modules by tags', () => {
    const modules = [mockModule1, mockModule2];
    const results = searchModules(modules, 'reasoning');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(m => m.id === 'foundation/logic/deductive-reasoning')).toBe(
      true
    );
  });

  it('should be case-insensitive', () => {
    const modules = [mockModule1];
    const results = searchModules(modules, 'DEDUCTIVE');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('foundation/logic/deductive-reasoning');
  });

  it('should return empty array when no matches', () => {
    const modules = [mockModule1, mockModule2];
    const results = searchModules(modules, 'nonexistent');

    expect(results).toHaveLength(0);
  });

  it('should handle modules without tags', () => {
    const modules = [mockModule3]; // errorHandling has no tags
    const results = searchModules(modules, 'handling');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('principle/resilience/error-handling');
  });

  it('should search across multiple fields', () => {
    const modules = [mockModule1, mockModule2, mockModule3];
    const results = searchModules(modules, 'testing'); // Matches name/description/tags

    expect(results.length).toBeGreaterThan(0);
  });
});

describe('filterAndSortModules', () => {
  const mockModule1 = deductiveReasoning; // cognitiveLevel: 1
  const mockModule2 = testingPrinciples; // cognitiveLevel: 2
  const mockModule3 = errorHandling; // cognitiveLevel: 2

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('cognitive level filtering', () => {
    it('should filter by single cognitive level', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const results = filterAndSortModules(modules, { level: '1' });

      expect(results).toHaveLength(1);
      expect(results[0].cognitiveLevel).toBe(CognitiveLevel.REASONING_FRAMEWORKS);
    });

    it('should filter by multiple cognitive levels', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const results = filterAndSortModules(modules, { level: '1,2' });

      expect(results).toHaveLength(3);
      expect(
        results.every(
          m =>
            m.cognitiveLevel === CognitiveLevel.REASONING_FRAMEWORKS ||
            m.cognitiveLevel === CognitiveLevel.UNIVERSAL_PATTERNS
        )
      ).toBe(true);
    });

    it('should support enum names for cognitive levels', () => {
      const modules = [mockModule1, mockModule2];
      const results = filterAndSortModules(modules, {
        level: 'REASONING_FRAMEWORKS',
      });

      expect(results).toHaveLength(1);
      expect(results[0].cognitiveLevel).toBe(CognitiveLevel.REASONING_FRAMEWORKS);
    });
  });

  describe('capability filtering', () => {
    it('should filter by single capability', () => {
      const modules = [mockModule1, mockModule2];
      const results = filterAndSortModules(modules, { capability: 'reasoning' });

      expect(results.every(m => m.capabilities.includes('reasoning'))).toBe(true);
    });

    it('should filter by multiple capabilities', () => {
      const modules = [mockModule1, mockModule2];
      const results = filterAndSortModules(modules, {
        capability: 'reasoning,testing',
      });

      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('domain filtering', () => {
    it('should filter by domain when present', () => {
      // Note: Test fixtures may not have domain set, so this tests the filter logic
      const modules = [mockModule1, mockModule2, mockModule3];
      const results = filterAndSortModules(modules, { domain: 'typescript' });

      // Should filter out modules without matching domain
      expect(results.every(m => {
        if (!m.domain) return false;
        const domains = Array.isArray(m.domain) ? m.domain : [m.domain];
        return domains.includes('typescript');
      })).toBe(true);
    });
  });

  describe('tag filtering', () => {
    it('should filter by single tag', () => {
      const modules = [mockModule1, mockModule2];
      const results = filterAndSortModules(modules, { tag: 'logic' });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('foundation/logic/deductive-reasoning');
    });

    it('should filter by multiple tags', () => {
      const modules = [mockModule1, mockModule2];
      const results = filterAndSortModules(modules, { tag: 'logic,best-practices' });

      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('sorting', () => {
    it('should sort by metadata.name then id', () => {
      const modules = [mockModule2, mockModule1, mockModule3];
      const results = filterAndSortModules(modules, {});

      // Verify sorted order (should be sorted alphabetically by name)
      for (let i = 0; i < results.length - 1; i++) {
        const current = results[i].metadata.name;
        const next = results[i + 1].metadata.name;
        expect(current.localeCompare(next)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe('combined filters', () => {
    it('should apply multiple filters together', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const results = filterAndSortModules(modules, {
        level: '2',
        capability: 'testing',
      });

      expect(
        results.every(m => m.cognitiveLevel === CognitiveLevel.UNIVERSAL_PATTERNS)
      ).toBe(true);
      expect(results.every(m => m.capabilities.includes('testing'))).toBe(true);
    });
  });
});

describe('handleSearch integration', () => {
  const mockDiscoverAllModules = vi.mocked(discoverAllModules);

  // Helper function to create registry with test modules
  function createMockRegistry(modules: typeof deductiveReasoning[]): ModuleRegistry {
    const registry = new ModuleRegistry('warn');
    for (const module of modules) {
      registry.add(module, { type: 'standard', path: 'test' });
    }
    return registry;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful search workflow', async () => {
    const registry = createMockRegistry([deductiveReasoning, testingPrinciples]);
    mockDiscoverAllModules.mockResolvedValue({
      registry,
      warnings: [],
    });

    // Should not throw
    await expect(handleSearch('Deductive', { verbose: false })).resolves.not.toThrow();
  });

  it('should handle empty module registry', async () => {
    const registry = createMockRegistry([]);
    mockDiscoverAllModules.mockResolvedValue({
      registry,
      warnings: [],
    });

    // Should not throw
    await expect(handleSearch('test', { verbose: false })).resolves.not.toThrow();
  });

  it('should handle no search results', async () => {
    const registry = createMockRegistry([deductiveReasoning, testingPrinciples]);
    mockDiscoverAllModules.mockResolvedValue({
      registry,
      warnings: [],
    });

    // Should not throw
    await expect(
      handleSearch('nonexistent', { verbose: false })
    ).resolves.not.toThrow();
  });

  it('should handle search with filters', async () => {
    const registry = createMockRegistry([deductiveReasoning, testingPrinciples]);
    mockDiscoverAllModules.mockResolvedValue({
      registry,
      warnings: [],
    });

    // Should not throw
    await expect(
      handleSearch('', { tag: 'logic', verbose: false })
    ).resolves.not.toThrow();
  });
});
