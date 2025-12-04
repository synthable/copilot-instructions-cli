/**
 * Rendering domain exports for UMS v2.0/v2.1
 * Handles markdown rendering of personas and modules
 */

export {
  renderMarkdown,
  renderModule,
  renderComponent,
  renderInstructionComponent,
  renderKnowledgeComponent,
  renderConcept,
  renderExample,
  renderPattern,
} from './markdown-renderer.js';

export {
  generateBuildReport,
  generatePersonaDigest,
  generateModuleDigest,
  type ModuleReportMetadata,
} from './report-generator.js';
