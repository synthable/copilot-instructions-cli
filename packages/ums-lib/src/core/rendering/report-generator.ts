/**
 * UMS v1.0 Build Report Generator - Pure Functions
 * Implements build report generation per UMS v1.0 specification Section 9.3
 */

import { createHash } from 'node:crypto';
import pkg from '../../../package.json' with { type: 'json' };
import type {
  UMSModule,
  UMSPersona,
  BuildReport,
  BuildReportGroup,
  BuildReportModule,
} from '../../types/index.js';

/**
 * Generates a build report with UMS v1.0 spec compliance (Section 9.3)
 * @param persona - The persona configuration
 * @param modules - Array of resolved modules in correct order
 * @param moduleFileContents - Map of module ID to file content for digest generation
 * @returns Complete build report
 */
export function generateBuildReport(
  persona: UMSPersona,
  modules: UMSModule[],
  moduleFileContents = new Map<string, string>()
): BuildReport {
  // Create build report groups following UMS v1.0 spec
  const moduleGroups: BuildReportGroup[] = [];

  for (const group of persona.moduleGroups) {
    const reportModules: BuildReportModule[] = [];

    for (const moduleId of group.modules) {
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
          name: module.meta.name,
          version: module.version,
          source: 'Local', // TODO: Distinguish between Standard Library and Local
          digest: moduleDigest ? `sha256:${moduleDigest}` : '',
          shape: module.shape,
          deprecated: module.meta.deprecated ?? false,
        };

        if (module.meta.replacedBy) {
          reportModule.replacedBy = module.meta.replacedBy;
        }

        reportModules.push(reportModule);
      }
    }

    moduleGroups.push({
      groupName: group.groupName ?? '',
      modules: reportModules,
    });
  }

  // Generate SHA-256 digest of persona content
  const personaContent = JSON.stringify({
    name: persona.name,
    description: persona.description,
    semantic: persona.semantic,
    identity: persona.identity,
    moduleGroups: persona.moduleGroups,
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
export function generatePersonaDigest(persona: UMSPersona): string {
  const personaContent = JSON.stringify({
    name: persona.name,
    description: persona.description,
    semantic: persona.semantic,
    identity: persona.identity,
    moduleGroups: persona.moduleGroups,
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
