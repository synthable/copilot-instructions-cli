/**
 * Validation Report Formatter Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatValidationReportMarkdown,
  formatValidationReportStructured,
} from './validation-report.js';
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

describe('formatValidationReportMarkdown', () => {
  it('formats clean validation report', () => {
    const report = createMockValidationReport();
    const markdown = formatValidationReportMarkdown(report);

    expect(markdown).toContain('# Validation Report');
    expect(markdown).toContain('## Summary');
    expect(markdown).toContain('**Total Modules**: 10');
    expect(markdown).toContain('**Valid Modules**: 10');
    expect(markdown).toContain('**Invalid Modules**: 0');
    expect(markdown).toContain('**Total Personas**: 2');
    expect(markdown).toContain('**Valid Personas**: 2');
    expect(markdown).toContain('All modules and personas passed validation.');
  });

  it('formats report with errors', () => {
    const errors = new Map<string, { message: string; path?: string }[]>();
    errors.set('module-1', [
      { message: 'Invalid schema version', path: 'schemaVersion' },
      { message: 'Missing required field', path: 'metadata.name' },
    ]);
    errors.set('module-2', [{ message: 'Duplicate ID' }]);

    const report = createMockValidationReport({
      validModules: 8,
      errors,
    });
    const markdown = formatValidationReportMarkdown(report);

    expect(markdown).toContain('## Errors');
    expect(markdown).toContain('### module-1');
    expect(markdown).toContain('- Invalid schema version');
    expect(markdown).toContain('- Missing required field');
    expect(markdown).toContain('### module-2');
    expect(markdown).toContain('- Duplicate ID');
    expect(markdown).not.toContain('All modules and personas passed');
  });

  it('formats report with warnings', () => {
    const warnings = new Map<string, { code: string; message: string; path?: string }[]>();
    warnings.set('module-1', [
      { code: 'DEPRECATED', message: 'Using deprecated field' },
    ]);

    const report = createMockValidationReport({ warnings });
    const markdown = formatValidationReportMarkdown(report);

    expect(markdown).toContain('## Warnings');
    expect(markdown).toContain('### module-1');
    expect(markdown).toContain('- Using deprecated field');
  });

  it('handles report without personas', () => {
    const report = createMockValidationReport({
      totalPersonas: undefined,
      validPersonas: undefined,
    });
    const markdown = formatValidationReportMarkdown(report);

    expect(markdown).not.toContain('**Total Personas**');
    expect(markdown).not.toContain('**Valid Personas**');
  });

  it('calculates invalid modules correctly', () => {
    const report = createMockValidationReport({
      totalModules: 10,
      validModules: 7,
    });
    const markdown = formatValidationReportMarkdown(report);

    expect(markdown).toContain('**Invalid Modules**: 3');
  });
});

describe('formatValidationReportStructured', () => {
  it('returns success with counts', () => {
    const report = createMockValidationReport();
    const structured = formatValidationReportStructured(report);

    expect(structured.success).toBe(true);
    expect(structured.totalModules).toBe(10);
    expect(structured.validModules).toBe(10);
    expect(structured.invalidModules).toBe(0);
    expect(structured.totalPersonas).toBe(2);
    expect(structured.validPersonas).toBe(2);
  });

  it('includes hasErrors and hasWarnings flags', () => {
    const report = createMockValidationReport();
    const structured = formatValidationReportStructured(report);

    expect(structured.hasErrors).toBe(false);
    expect(structured.hasWarnings).toBe(false);
  });

  it('converts error Map to object', () => {
    const errors = new Map<string, { message: string; path?: string }[]>();
    errors.set('mod-1', [
      { message: 'Error 1', path: 'field.path' },
      { message: 'Error 2' },
    ]);

    const report = createMockValidationReport({
      validModules: 9,
      errors,
    });
    const structured = formatValidationReportStructured(report);

    expect(structured.hasErrors).toBe(true);
    expect(structured.errors['mod-1']).toEqual([
      { message: 'Error 1', path: 'field.path' },
      { message: 'Error 2' },
    ]);
  });

  it('converts warning Map to object', () => {
    const warnings = new Map<string, { code: string; message: string; path?: string }[]>();
    warnings.set('mod-1', [
      { code: 'WARN_1', message: 'Warning 1', path: 'some.path' },
    ]);

    const report = createMockValidationReport({ warnings });
    const structured = formatValidationReportStructured(report);

    expect(structured.hasWarnings).toBe(true);
    expect(structured.warnings['mod-1']).toEqual([
      { code: 'WARN_1', message: 'Warning 1', path: 'some.path' },
    ]);
  });

  it('handles empty errors and warnings', () => {
    const report = createMockValidationReport();
    const structured = formatValidationReportStructured(report);

    expect(structured.errors).toEqual({});
    expect(structured.warnings).toEqual({});
  });

  it('calculates invalidModules correctly', () => {
    const report = createMockValidationReport({
      totalModules: 15,
      validModules: 12,
    });
    const structured = formatValidationReportStructured(report);

    expect(structured.invalidModules).toBe(3);
  });
});
