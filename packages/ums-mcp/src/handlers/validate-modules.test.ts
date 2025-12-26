/**
 * Validate Modules Handler Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createValidateModulesHandler } from './validate-modules.js';
import type { ValidationService } from '../services/validation-service.js';
import type { ValidationReport } from 'ums-sdk';

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

describe('createValidateModulesHandler', () => {
  let mockService: ValidationService;
  let handler: ReturnType<typeof createValidateModulesHandler>;

  beforeEach(() => {
    mockService = {
      validateAll: vi.fn(),
    } as unknown as ValidationService;
    handler = createValidateModulesHandler(mockService);
  });

  it('calls service.validateAll with options', async () => {
    vi.mocked(mockService.validateAll).mockResolvedValue(createMockValidationReport());

    await handler({
      includePersonas: false,
      includeStandard: false,
    });

    expect(mockService.validateAll).toHaveBeenCalledWith({
      includePersonas: false,
      includeStandard: false,
    });
  });

  it('returns MCP response with text content', async () => {
    vi.mocked(mockService.validateAll).mockResolvedValue(createMockValidationReport());

    const response = await handler({
      includePersonas: true,
      includeStandard: true,
    });

    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.content[0].text).toContain('# Validation Report');
    expect(response.content[0].text).toContain('**Total Modules**: 10');
  });

  it('returns structured content with validation results', async () => {
    vi.mocked(mockService.validateAll).mockResolvedValue(createMockValidationReport());

    const response = await handler({
      includePersonas: true,
      includeStandard: true,
    });

    expect(response.structuredContent).toBeDefined();
    expect(response.structuredContent.success).toBe(true);
    expect(response.structuredContent.totalModules).toBe(10);
    expect(response.structuredContent.validModules).toBe(10);
    expect(response.structuredContent.hasErrors).toBe(false);
  });

  it('handles validation errors', async () => {
    const errors = new Map<string, { message: string; path?: string }[]>();
    errors.set('mod-1', [{ message: 'Invalid schema' }]);

    vi.mocked(mockService.validateAll).mockResolvedValue(
      createMockValidationReport({
        validModules: 9,
        errors,
      })
    );

    const response = await handler({
      includePersonas: true,
      includeStandard: true,
    });

    expect(response.content[0].text).toContain('## Errors');
    expect(response.content[0].text).toContain('Invalid schema');
    expect(response.structuredContent.hasErrors).toBe(true);
    expect(response.structuredContent.invalidModules).toBe(1);
  });

  it('handles validation warnings', async () => {
    const warnings = new Map<string, { code: string; message: string; path?: string }[]>();
    warnings.set('mod-1', [{ code: 'WARN', message: 'Deprecated field' }]);

    vi.mocked(mockService.validateAll).mockResolvedValue(
      createMockValidationReport({ warnings })
    );

    const response = await handler({
      includePersonas: true,
      includeStandard: true,
    });

    expect(response.content[0].text).toContain('## Warnings');
    expect(response.structuredContent.hasWarnings).toBe(true);
  });

  it('propagates errors from service', async () => {
    vi.mocked(mockService.validateAll).mockRejectedValue(new Error('Validation failed'));

    await expect(
      handler({
        includePersonas: true,
        includeStandard: true,
      })
    ).rejects.toThrow('Validation failed');
  });
});
