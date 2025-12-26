/**
 * Validation Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationService } from './validation-service.js';

// Mock ums-sdk
vi.mock('ums-sdk', () => ({
  validateAll: vi.fn(),
}));

import { validateAll } from 'ums-sdk';
import type { ValidationReport } from 'ums-sdk';

const mockValidateAll = vi.mocked(validateAll);

const createMockValidationReport = (
  overrides: Partial<ValidationReport> = {}
): ValidationReport => ({
  totalModules: 10,
  validModules: 10,
  totalPersonas: 2,
  validPersonas: 2,
  errors: new Map(),
  warnings: new Map(),
  ...overrides,
});

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ValidationService();
  });

  describe('validateAll', () => {
    it('delegates to validateAll without options', async () => {
      const mockReport = createMockValidationReport();
      mockValidateAll.mockResolvedValue(mockReport);

      const result = await service.validateAll();

      expect(mockValidateAll).toHaveBeenCalledWith(undefined);
      expect(result).toBe(mockReport);
    });

    it('passes options to validateAll', async () => {
      const mockReport = createMockValidationReport();
      mockValidateAll.mockResolvedValue(mockReport);

      const options = { includePersonas: false, includeStandard: false };
      await service.validateAll(options);

      expect(mockValidateAll).toHaveBeenCalledWith(options);
    });

    it('propagates errors from validateAll', async () => {
      mockValidateAll.mockRejectedValue(new Error('Validation failed'));

      await expect(service.validateAll()).rejects.toThrow('Validation failed');
    });

    it('returns report with errors', async () => {
      const errors = new Map<string, { message: string; path?: string }[]>();
      errors.set('mod-1', [{ message: 'Invalid' }]);

      const mockReport = createMockValidationReport({
        validModules: 9,
        errors,
      });
      mockValidateAll.mockResolvedValue(mockReport);

      const result = await service.validateAll();

      expect(result.errors.size).toBe(1);
      expect(result.errors.get('mod-1')).toEqual([{ message: 'Invalid' }]);
    });

    it('returns report with warnings', async () => {
      const warnings = new Map<string, { code: string; message: string; path?: string }[]>();
      warnings.set('mod-1', [{ code: 'WARN', message: 'Deprecated' }]);

      const mockReport = createMockValidationReport({ warnings });
      mockValidateAll.mockResolvedValue(mockReport);

      const result = await service.validateAll();

      expect(result.warnings.size).toBe(1);
    });
  });
});
