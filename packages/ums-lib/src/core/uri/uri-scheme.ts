/**
 * UMS v2.2 URI Scheme Implementation
 * Format: ums://{module-id}#{component-id}/{primitive-type}
 * @see UMS v2.2 Specification Section 4
 */

import { PrimitiveType } from '../../types/index.js';
import { MODULE_ID_REGEX, COMPONENT_ID_REGEX } from '../../constants.js';

/**
 * Parsed UMS URI components
 */
export interface ParsedURI {
  /** The full URI string */
  uri: string;
  /** The module ID (authority segment) */
  moduleId: string;
  /** The component ID (optional, from fragment) */
  componentId?: string;
  /** The primitive type (optional, from fragment) */
  primitiveType?: PrimitiveType;
}

/**
 * URI validation result
 */
export interface URIValidationResult {
  valid: boolean;
  error?: string;
}

/** UMS URI protocol prefix */
export const UMS_PROTOCOL = 'ums://';

/** Valid primitive types */
const VALID_PRIMITIVE_TYPES = new Set(Object.values(PrimitiveType));

/**
 * Parse a UMS URI into its components.
 * @param uri - The URI to parse
 * @returns Parsed URI components or null if invalid
 */
export function parseURI(uri: string): ParsedURI | null {
  if (!uri.startsWith(UMS_PROTOCOL)) {
    return null;
  }

  const withoutProtocol = uri.slice(UMS_PROTOCOL.length);
  const [authority, fragment] = withoutProtocol.split('#');

  if (!authority || !MODULE_ID_REGEX.test(authority)) {
    return null;
  }

  const result: ParsedURI = {
    uri,
    moduleId: authority,
  };

  if (fragment) {
    const [componentId, primitiveType] = fragment.split('/');

    if (componentId && COMPONENT_ID_REGEX.test(componentId)) {
      result.componentId = componentId;
    }

    if (
      primitiveType &&
      VALID_PRIMITIVE_TYPES.has(primitiveType as PrimitiveType)
    ) {
      result.primitiveType = primitiveType as PrimitiveType;
    }
  }

  return result;
}

/**
 * Validate a UMS URI.
 * @param uri - The URI to validate
 * @returns Validation result
 */
export function validateURI(uri: string): URIValidationResult {
  if (!uri.startsWith(UMS_PROTOCOL)) {
    return { valid: false, error: `URI must start with "${UMS_PROTOCOL}"` };
  }

  const parsed = parseURI(uri);
  if (!parsed) {
    return { valid: false, error: 'Invalid URI format' };
  }

  return { valid: true };
}

/**
 * Build a UMS URI from components.
 * @param moduleId - The module ID
 * @param componentId - Optional component ID
 * @param primitiveType - Optional primitive type
 * @returns The constructed URI
 */
export function buildURI(
  moduleId: string,
  componentId?: string,
  primitiveType?: PrimitiveType
): string {
  let uri = `${UMS_PROTOCOL}${moduleId}`;

  if (componentId || primitiveType) {
    uri += '#';
    if (componentId) {
      uri += componentId;
    }
    if (primitiveType) {
      uri += `/${primitiveType}`;
    }
  }

  return uri;
}

/**
 * Check if a string is a valid UMS URI.
 * @param uri - The string to check
 * @returns True if valid UMS URI
 */
export function isValidURI(uri: string): boolean {
  return validateURI(uri).valid;
}
