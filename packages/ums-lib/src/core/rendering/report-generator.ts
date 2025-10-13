/**
 * UMS v2.0 Build Report Generator - Pure Functions
 * Implements build report generation per UMS v2.0 specification Section 7.3
 */

import { createHash } from 'node:crypto';
import pkg from '#package.json' with { type: 'json' };
import type {
  Module,
  Persona,
  BuildReport,
  BuildReportGroup,
  BuildReportModule,
} from '../../types/index.js';

/**
 * Generates a build report with UMS v2.0 spec compliance (Section 7.3)
 * @param persona - The persona configuration
 * @param modules - Array of resolved modules in correct order
 * @param moduleFileContents - Map of module ID to file content for digest generation
 * @returns Complete build report
 */
export function generateBuildReport(
  persona: Persona,
  modules: Module[],
  moduleFileContents = new Map<string, string>()
): BuildReport {
  // Create build report groups following UMS v2.0 spec
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

        const reportModule: BuildReportModule = {
          id: module.id,
          name: module.metadata.name,
          version: module.version,
          source: 'Local', // TODO: Distinguish between Standard Library and Local
          digest: moduleDigest ? `sha256:${moduleDigest}` : '',
          deprecated: module.metadata.deprecated ?? false,
        };

        if (module.metadata.replacedBy) {
          reportModule.replacedBy = module.metadata.replacedBy;
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
    schemaVersion: '1.0',
    toolVersion: pkg.version,
    personaDigest,
    buildTimestamp: new Date().toISOString(),
    moduleGroups,
  };
}

/**
 * Generates persona content digest for build reports
 * @param persona - The persona to generate digest for
 * @returns SHA-256 digest of persona content
 */
export function generatePersonaDigest(persona: Persona): string {
  const personaContent = JSON.stringify({
    name: persona.name,
    description: persona.description,
    semantic: persona.semantic,
    identity: persona.identity,
    modules: persona.modules,
  });

  return createHash('sha256').update(personaContent).digest('hex');
}

/**
 * Generates module content digest for build reports
 * @param content - The module file content
 * @returns SHA-256 digest of module content
 */
export function generateModuleDigest(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}
