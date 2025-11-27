/**
 * UMS v2.0/v2.1 Build Report Generator - Pure Functions
 * Implements build report generation per UMS v2.1 specification Section 7.3
 */

import { createHash } from 'node:crypto';
import pkg from '#package.json' with { type: 'json' };
import type {
  Module,
  Persona,
  BuildReport,
  BuildReportGroup,
  BuildReportModule,
  CompositionEvent,
  ModuleSource,
} from '../../types/index.js';

/**
 * Module metadata for build report generation
 */
export interface ModuleReportMetadata {
  /** The source of the module (standard library or local path) */
  source: ModuleSource;
  /** Composition history if this module was replaced or merged */
  composedFrom?: CompositionEvent[];
}

/**
 * Generates a build report with UMS v2.1 spec compliance (Section 7.3)
 * @param persona - The persona configuration
 * @param modules - Array of resolved modules in correct order
 * @param moduleFileContents - Map of module ID to file content for digest generation
 * @param moduleMetadata - Optional map of module ID to source/composition metadata
 * @returns Complete build report
 */
export function generateBuildReport(
  persona: Persona,
  modules: Module[],
  moduleFileContents = new Map<string, string>(),
  moduleMetadata = new Map<string, ModuleReportMetadata>()
): BuildReport {
  // Create build report groups following UMS v2.1 spec
  const moduleGroups: BuildReportGroup[] = [];

  for (const entry of persona.modules) {
    const reportModules: BuildReportModule[] = [];

    // Handle both string IDs and grouped modules
    const moduleIds = typeof entry === 'string' ? [entry] : entry.ids;

    for (const moduleId of moduleIds) {
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        // Generate module file digest (only if content is provided)
        let moduleDigest = '';
        const moduleContent = moduleFileContents.get(module.id);
        if (moduleContent) {
          moduleDigest = createHash('sha256')
            .update(moduleContent)
            .digest('hex');
        }

        // Get source from metadata, defaulting to 'Local' for backward compatibility
        const metadata = moduleMetadata.get(module.id);
        const source = metadata?.source
          ? metadata.source.type === 'standard'
            ? 'Standard Library'
            : metadata.source.path
          : 'Local';

        const reportModule: BuildReportModule = {
          id: module.id,
          name: module.metadata.name,
          version: module.version,
          source,
          digest: moduleDigest ? `sha256:${moduleDigest}` : '',
          deprecated: module.metadata.deprecated ?? false,
        };

        if (module.metadata.replacedBy) {
          reportModule.replacedBy = module.metadata.replacedBy;
        }

        // Add composition history if present
        if (metadata?.composedFrom && metadata.composedFrom.length > 0) {
          reportModule.composedFrom = metadata.composedFrom;
        }

        reportModules.push(reportModule);
      }
    }

    moduleGroups.push({
      groupName: typeof entry === 'string' ? '' : (entry.group ?? ''),
      modules: reportModules,
    });
  }

  // Generate SHA-256 digest of persona content
  const personaContent = JSON.stringify({
    name: persona.name,
    description: persona.description,
    semantic: persona.semantic,
    identity: persona.identity,
    modules: persona.modules,
  });

  const personaDigest = createHash('sha256')
    .update(personaContent)
    .digest('hex');

  return {
    personaName: persona.name,
    schemaVersion: persona.schemaVersion,
    toolVersion: pkg.version,
    personaDigest: `sha256:${personaDigest}`,
    buildTimestamp: new Date().toISOString(),
    moduleGroups,
  };
}

/**
 * Generates persona content digest for build reports
 * @param persona - The persona to generate digest for
 * @returns SHA-256 digest of persona content with sha256: prefix
 */
export function generatePersonaDigest(persona: Persona): string {
  const personaContent = JSON.stringify({
    name: persona.name,
    description: persona.description,
    semantic: persona.semantic,
    identity: persona.identity,
    modules: persona.modules,
  });

  const hex = createHash('sha256').update(personaContent).digest('hex');
  return `sha256:${hex}`;
}

/**
 * Generates module content digest for build reports
 * @param content - The module file content
 * @returns SHA-256 digest of module content with sha256: prefix
 */
export function generateModuleDigest(content: string): string {
  const hex = createHash('sha256').update(content).digest('hex');
  return `sha256:${hex}`;
}
