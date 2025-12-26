/**
 * Validate Modules Handler
 *
 * Handles the ums_validate_modules MCP tool.
 */

import type { ValidationService } from '../services/validation-service.js';
import type { ValidateModulesInput } from '../schemas/index.js';
import {
  formatValidationReportMarkdown,
  formatValidationReportStructured,
} from '../formatters/index.js';

/**
 * Create a handler for the validate-modules tool
 * @param validationService - ValidationService instance
 * @returns Handler function
 */
export function createValidateModulesHandler(
  validationService: ValidationService
) {
  return async (params: ValidateModulesInput) => {
    const report = await validationService.validateAll({
      includePersonas: params.includePersonas,
      includeStandard: params.includeStandard,
    });

    const text = formatValidationReportMarkdown(report);
    const structuredContent = formatValidationReportStructured(report);

    return {
      content: [{ type: 'text' as const, text }],
      structuredContent,
    };
  };
}
