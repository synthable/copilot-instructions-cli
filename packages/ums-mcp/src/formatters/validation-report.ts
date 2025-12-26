/**
 * Validation Report Formatter
 *
 * Formats ValidationReport from ums-sdk to markdown for MCP responses.
 */

import type { ValidationReport } from 'ums-sdk';

/**
 * Format validation report as markdown for human-readable output
 */
export function formatValidationReportMarkdown(
  report: ValidationReport
): string {
  const lines: string[] = ['# Validation Report', ''];

  lines.push('## Summary');
  lines.push(`- **Total Modules**: ${report.totalModules}`);
  lines.push(`- **Valid Modules**: ${report.validModules}`);
  lines.push(
    `- **Invalid Modules**: ${report.totalModules - report.validModules}`
  );

  if (report.totalPersonas !== undefined) {
    lines.push(`- **Total Personas**: ${report.totalPersonas}`);
    lines.push(`- **Valid Personas**: ${report.validPersonas}`);
  }
  lines.push('');

  if (report.errors.size > 0) {
    lines.push('## Errors', '');
    for (const [id, errors] of report.errors) {
      lines.push(`### ${id}`);
      for (const error of errors) {
        lines.push(`- ${error.message}`);
      }
      lines.push('');
    }
  }

  if (report.warnings.size > 0) {
    lines.push('## Warnings', '');
    for (const [id, warnings] of report.warnings) {
      lines.push(`### ${id}`);
      for (const warning of warnings) {
        lines.push(`- ${warning.message}`);
      }
      lines.push('');
    }
  }

  if (report.errors.size === 0 && report.warnings.size === 0) {
    lines.push('All modules and personas passed validation.');
  }

  return lines.join('\n');
}

/**
 * Format validation report as structured output for programmatic access
 */
export function formatValidationReportStructured(report: ValidationReport) {
  // Convert Maps to plain objects for structured output
  const errorsObj: Record<string, { message: string; path?: string }[]> = {};
  for (const [id, errors] of report.errors) {
    errorsObj[id] = errors.map(e => ({
      message: e.message,
      ...(e.path && { path: e.path }),
    }));
  }

  const warningsObj: Record<
    string,
    { code: string; message: string; path?: string }[]
  > = {};
  for (const [id, warnings] of report.warnings) {
    warningsObj[id] = warnings.map(w => ({
      code: w.code,
      message: w.message,
      ...(w.path && { path: w.path }),
    }));
  }

  return {
    success: true,
    totalModules: report.totalModules,
    validModules: report.validModules,
    invalidModules: report.totalModules - report.validModules,
    totalPersonas: report.totalPersonas,
    validPersonas: report.validPersonas,
    hasErrors: report.errors.size > 0,
    hasWarnings: report.warnings.size > 0,
    errors: errorsObj,
    warnings: warningsObj,
  };
}
