import { vi, describe, it, expect } from 'vitest';
import { searchModules } from './search.js';
import type { IndexedModule } from '../types/index.js';

vi.mock('fs/promises');

const mockModules: IndexedModule[] = [
  {
    id: 'f1',
    tier: 'foundation',
    subject: 's',
    path: '',
    metadata: {
      name: 'Alpha',
      description: 'First module',
      tier: 'foundation',
      subject: 's',
    },
  },
  {
    id: 'p1',
    tier: 'principle',
    subject: 's',
    path: '',
    metadata: {
      name: 'Beta',
      description: 'Second module, about beta stuff',
      tier: 'principle',
      subject: 's',
    },
  },
];

describe('search command', () => {
  describe('searchModules', () => {
    it('should find modules by name', () => {
      const results = searchModules(mockModules, 'Alpha');
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('f1');
    });

    it('should find modules by description', () => {
      const results = searchModules(mockModules, 'beta stuff');
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('p1');
    });

    it('should be case-insensitive', () => {
      const results = searchModules(mockModules, 'alpha');
      expect(results).toHaveLength(1);
      expect(results[0]?.id).toBe('f1');
    });

    it('should return an empty array if no matches are found', () => {
      const results = searchModules(mockModules, 'gamma');
      expect(results).toHaveLength(0);
    });
  });
});
