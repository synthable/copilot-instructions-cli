/**
 * Module Service
 *
 * Thin facade over ums-sdk listModules functionality.
 * Provides dependency injection point for handlers.
 */

import {
  listModules,
  type ListOptions,
  type ModuleInfo,
} from 'ums-sdk';

/**
 * Options for searching modules
 */
export interface SearchOptions extends ListOptions {
  /** Maximum number of results to return */
  limit?: number;
}

/**
 * Service for listing and searching modules
 */
export class ModuleService {
  /**
   * List all available modules with optional filtering
   * @param options - List options
   * @returns Array of module metadata
   */
  async list(options?: ListOptions): Promise<ModuleInfo[]> {
    return listModules(options);
  }

  /**
   * Search for modules by query string
   * @param query - Search query to match against module names, descriptions, and IDs
   * @param options - Search options
   * @returns Array of matching module metadata
   */
  async search(query: string, options?: SearchOptions): Promise<ModuleInfo[]> {
    const modules = await listModules(options);
    const lowerQuery = query.toLowerCase();

    // Filter by query matching against name, description, and ID
    const matched = modules.filter(module =>
      module.name.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery) ||
      module.id.toLowerCase().includes(lowerQuery)
    );

    // Apply limit if specified
    if (options?.limit && options.limit > 0) {
      return matched.slice(0, options.limit);
    }

    return matched;
  }
}
