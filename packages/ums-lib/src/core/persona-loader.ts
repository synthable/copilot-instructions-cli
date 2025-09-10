/**
 * UMS v1.0 Persona loader and validator (M2)
 * Implements persona parsing and validation per UMS v1.0 specification
 */

import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { MODULE_ID_REGEX, UMS_SCHEMA_VERSION } from '../constants.js';
import {
  ID_VALIDATION_ERRORS,
  SCHEMA_VALIDATION_ERRORS,
} from '../utils/errors.js';
import type {
  UMSPersona,
  ModuleGroup,
  ValidationResult,
  ValidationWarning,
  ValidationError,
} from '../types/index.js';

// Raw parsed YAML structure before validation
interface RawPersonaData {
  name?: unknown;
  description?: unknown;
  semantic?: unknown;
  role?: unknown;
  attribution?: unknown;
  moduleGroups?: unknown;
  [key: string]: unknown;
}

function isValidRawPersonaData(data: unknown): data is RawPersonaData {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}

/**
 * Loads and validates a UMS v1.0 persona from file
 */
export async function loadPersona(filePath: string): Promise<UMSPersona> {
  try {
    // Read and parse YAML file
    const content = await readFile(filePath, 'utf-8');
    const parsed: unknown = parse(content);

    if (!isValidRawPersonaData(parsed)) {
      throw new Error('Invalid YAML: expected object at root');
    }

    // Validate the persona structure
    const validation = validatePersona(parsed);
    if (!validation.valid) {
      const errorMessages = validation.errors.map(e => e.message).join('\n');
      throw new Error(`Persona validation failed:\n${errorMessages}`);
    }

    // Return the validated persona with proper typing
    const validatedPersona: UMSPersona = {
      name: parsed.name as string,
      version: parsed.version as string,
      schemaVersion: parsed.schemaVersion as string,
      description: parsed.description as string,
      semantic: parsed.semantic as string,
      identity: parsed.identity as string,
      ...(parsed.attribution !== undefined && {
        attribution: parsed.attribution as boolean,
      }),
      moduleGroups: parsed.moduleGroups as ModuleGroup[],
    };

    // Add filePath as a dynamic property
    (validatedPersona as UMSPersona & { filePath: string }).filePath = filePath;
    return validatedPersona as UMSPersona & { filePath: string };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load persona from ${filePath}: ${message}`);
  }
}

/**
 * Validates a parsed UMS v1.0 persona object
 */
export function validatePersona(obj: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!obj || typeof obj !== 'object') {
    errors.push({
      path: '',
      message: 'Persona must be an object',
      section: 'Section 5',
    });
    return { valid: false, errors, warnings };
  }

  const persona = obj as Record<string, unknown>;

  // Validate required fields (Section 5.1 - UMS v1.0 compliant)
  const requiredFields = [
    'name',
    'version',
    'schemaVersion',
    'description',
    'semantic',
    'identity',
    'moduleGroups',
  ];
  for (const field of requiredFields) {
    if (!(field in persona)) {
      errors.push({
        path: field,
        message: SCHEMA_VALIDATION_ERRORS.missingField(field),
        section: 'Section 5.1',
      });
    }
  }

  // Validate required field types
  if ('name' in persona && typeof persona.name !== 'string') {
    errors.push({
      path: 'name',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'name',
        'string',
        typeof persona.name
      ),
      section: 'Section 5.1',
    });
  }

  if ('description' in persona && typeof persona.description !== 'string') {
    errors.push({
      path: 'description',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'description',
        'string',
        typeof persona.description
      ),
      section: 'Section 5.1',
    });
  }

  if ('semantic' in persona && typeof persona.semantic !== 'string') {
    errors.push({
      path: 'semantic',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'semantic',
        'string',
        typeof persona.semantic
      ),
      section: 'Section 5.1',
    });
  }

  // Validate version field
  if ('version' in persona && typeof persona.version !== 'string') {
    errors.push({
      path: 'version',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'version',
        'string',
        typeof persona.version
      ),
      section: 'Section 5.1',
    });
  }

  // Validate schemaVersion field
  if ('schemaVersion' in persona) {
    if (persona.schemaVersion !== UMS_SCHEMA_VERSION) {
      errors.push({
        path: 'schemaVersion',
        message: SCHEMA_VALIDATION_ERRORS.wrongSchemaVersion(
          String(persona.schemaVersion)
        ),
        section: 'Section 5.1',
      });
    }
  }

  // Validate identity field (renamed from role)
  if ('identity' in persona && typeof persona.identity !== 'string') {
    errors.push({
      path: 'identity',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'identity',
        'string',
        typeof persona.identity
      ),
      section: 'Section 5.1',
    });
  }

  // Validate optional fields when present
  if (
    'role' in persona &&
    persona.role !== undefined &&
    typeof persona.role !== 'string'
  ) {
    errors.push({
      path: 'role',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'role',
        'string',
        typeof persona.role
      ),
      section: 'Section 5.1',
    });
  }

  if (
    'attribution' in persona &&
    persona.attribution !== undefined &&
    typeof persona.attribution !== 'boolean'
  ) {
    errors.push({
      path: 'attribution',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'attribution',
        'boolean',
        typeof persona.attribution
      ),
      section: 'Section 5.1',
    });
  }

  // Validate moduleGroups (Section 5.2)
  if ('moduleGroups' in persona) {
    if (!Array.isArray(persona.moduleGroups)) {
      errors.push({
        path: 'moduleGroups',
        message: SCHEMA_VALIDATION_ERRORS.wrongType(
          'moduleGroups',
          'array',
          typeof persona.moduleGroups
        ),
        section: 'Section 5.2',
      });
    } else {
      const moduleGroupsValidation = validateModuleGroups(
        persona.moduleGroups as unknown[]
      );
      errors.push(...moduleGroupsValidation.errors);
      warnings.push(...moduleGroupsValidation.warnings);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates moduleGroups array
 */
function validateModuleGroups(moduleGroups: unknown[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (moduleGroups.length === 0) {
    warnings.push({
      path: 'moduleGroups',
      message: 'moduleGroups array is empty - persona will have no modules',
    });
    return { valid: true, errors, warnings };
  }

  const groupNames = new Set<string>();

  moduleGroups.forEach((group, index) => {
    if (!group || typeof group !== 'object') {
      errors.push({
        path: `moduleGroups[${index}]`,
        message: `Module group at index ${index} must be an object`,
        section: 'Section 5.2',
      });
      return;
    }

    const groupObj = group as Record<string, unknown>;

    // Validate required fields
    if (!('groupName' in groupObj)) {
      errors.push({
        path: `moduleGroups[${index}].groupName`,
        message: SCHEMA_VALIDATION_ERRORS.missingField('groupName'),
        section: 'Section 5.2',
      });
    }

    if (!('modules' in groupObj)) {
      errors.push({
        path: `moduleGroups[${index}].modules`,
        message: SCHEMA_VALIDATION_ERRORS.missingField('modules'),
        section: 'Section 5.2',
      });
    }

    // Validate groupName
    if ('groupName' in groupObj) {
      if (typeof groupObj.groupName !== 'string') {
        errors.push({
          path: `moduleGroups[${index}].groupName`,
          message: SCHEMA_VALIDATION_ERRORS.wrongType(
            'groupName',
            'string',
            typeof groupObj.groupName
          ),
          section: 'Section 5.2',
        });
      } else {
        const groupName = groupObj.groupName;

        // Check for duplicate group names
        if (groupNames.has(groupName)) {
          errors.push({
            path: `moduleGroups[${index}].groupName`,
            message: `Duplicate group name '${groupName}'. Group names must be unique.`,
            section: 'Section 5.2',
          });
        }
        groupNames.add(groupName);
      }
    }

    // Validate modules array
    if ('modules' in groupObj) {
      if (!Array.isArray(groupObj.modules)) {
        errors.push({
          path: `moduleGroups[${index}].modules`,
          message: SCHEMA_VALIDATION_ERRORS.wrongType(
            'modules',
            'array',
            typeof groupObj.modules
          ),
          section: 'Section 5.2',
        });
      } else {
        const modules = groupObj.modules as unknown[];
        const groupName =
          typeof groupObj.groupName === 'string'
            ? groupObj.groupName
            : `group-${index}`;

        if (modules.length === 0) {
          warnings.push({
            path: `moduleGroups[${index}].modules`,
            message: `Module group '${groupName}' has no modules`,
          });
        }

        // Validate each module ID and check for duplicates
        const moduleIds = new Set<string>();
        modules.forEach((moduleId, moduleIndex) => {
          if (typeof moduleId !== 'string') {
            errors.push({
              path: `moduleGroups[${index}].modules[${moduleIndex}]`,
              message: `Module ID at index ${moduleIndex} must be a string`,
              section: 'Section 5.2',
            });
            return;
          }

          // Validate module ID format
          if (!MODULE_ID_REGEX.test(moduleId)) {
            errors.push({
              path: `moduleGroups[${index}].modules[${moduleIndex}]`,
              message: ID_VALIDATION_ERRORS.invalidFormat(moduleId),
              section: 'Section 5.2',
            });
          }

          // Check for duplicate module IDs within group
          if (moduleIds.has(moduleId)) {
            errors.push({
              path: `moduleGroups[${index}].modules[${moduleIndex}]`,
              message: SCHEMA_VALIDATION_ERRORS.duplicateModuleId(
                moduleId,
                groupName
              ),
              section: 'Section 5.2',
            });
          }
          moduleIds.add(moduleId);
        });
      }
    }
  });

  return { valid: errors.length === 0, errors, warnings };
}
