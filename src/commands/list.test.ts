import { vi, describe, it, expect } from 'vitest';
import {
  getSelectedTiers,
  filterModulesByTiers,
  prepareTableData,
} from './list.js';
import type { IndexedModule } from '../types/index.js';

vi.mock('fs/promises');

const mockModules: IndexedModule[] = [
  {
    id: 'f1',
    tier: 'foundation',
    subject: 's',
    path: '',
    metadata: { name: 'n', description: 'd', tier: 'foundation', subject: 's' },
  },
  {
    id: 'p1',
    tier: 'principle',
    subject: 's',
    path: '',
    metadata: { name: 'n', description: 'd', tier: 'principle', subject: 's' },
  },
];

describe('list command', () => {
  describe('getSelectedTiers', () => {
    it('should return all tiers if no options are provided', () => {
      const tiers = getSelectedTiers({});
      expect(tiers).toEqual([
        'foundation',
        'principle',
        'technology',
        'execution',
      ]);
    });

    it('should return selected tiers', () => {
      const tiers = getSelectedTiers({ foundation: true, technology: true });
      expect(tiers).toEqual(['foundation', 'technology']);
    });
  });

  describe('filterModulesByTiers', () => {
    it('should filter modules by tier', () => {
      const filtered = filterModulesByTiers(mockModules, ['foundation']);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.id).toBe('f1');
    });
  });

  describe('prepareTableData', () => {
    it('should format module data for table', () => {
      const tableData = prepareTableData(mockModules);
      expect(tableData[0]).toHaveProperty('ID', 'f1');
      expect(tableData[1]).toHaveProperty('Tier', 'principle');
    });

    it('should truncate long descriptions', () => {
      const longDescModule: IndexedModule = {
        id: 'f1',
        tier: 'foundation',
        subject: 's',
        path: '',
        metadata: {
          name: 'n',
          description: 'a'.repeat(100),
          tier: 'foundation',
          subject: 's',
        },
      };
      const tableData = prepareTableData([longDescModule]);
      expect(tableData[0]?.['Description'].length).toBeLessThan(61);
      expect(tableData[0]?.['Description']).toMatch(/\.\.\.$/);
    });
  });
});
