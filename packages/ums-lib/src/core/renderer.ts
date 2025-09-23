/**
 * UMS v1.0 Markdown Renderer - Pure Functions
 * Implements Markdown rendering according to UMS v1.0 specification Section 7.1
 */

import { RENDER_ORDER, type DirectiveKey } from '../constants.js';
import type {
  UMSModule,
  UMSPersona,
  DataDirective,
  ExampleDirective,
} from '../types/index.js';

/**
 * Renders a complete persona with modules to Markdown
 * @param persona - The persona configuration
 * @param modules - Array of resolved modules in correct order
 * @returns Rendered Markdown content
 */
export function renderMarkdown(
  persona: UMSPersona,
  modules: UMSModule[]
): string {
  const sections: string[] = [];

  // Render persona identity if present and not empty (Section 7.1)
  if (persona.identity.trim()) {
    sections.push('## Identity\n');
    sections.push(`${persona.identity}\n`);
  }

  // Group modules by their moduleGroups for proper ordering
  let moduleIndex = 0;

  for (const group of persona.moduleGroups) {
    // Optional group heading (non-normative)
    if (group.groupName) {
      sections.push(`# ${group.groupName}\n`);
    }

    for (const module of group.modules.map(() => modules[moduleIndex++])) {
      // Render module content
      sections.push(renderModule(module));

      // Add attribution if enabled
      if (persona.attribution) {
        sections.push(`[Attribution: ${module.id}]\n`);
      }

      // Add separator between modules (but not after the last one)
      if (moduleIndex < modules.length) {
        sections.push('---\n');
      }
    }
  }

  return sections.join('\n').trim() + '\n';
}

/**
 * Renders a single module to Markdown
 * @param module - The module to render
 * @returns Rendered module content
 */
export function renderModule(module: UMSModule): string {
  const sections: string[] = [];

  // Render directives in stable order (Section 7.1)
  for (const directive of RENDER_ORDER) {
    if (directive in module.body) {
      sections.push(renderDirective(directive, module.body[directive]));
    }
  }

  return sections.join('\n');
}

/**
 * Renders a single directive to Markdown
 * @param directive - The directive type
 * @param content - The directive content
 * @returns Rendered directive content
 */
export function renderDirective(
  directive: DirectiveKey,
  content: unknown
): string {
  switch (directive) {
    case 'goal':
      return renderGoal(content as string);
    case 'principles':
      return renderPrinciples(content as string[]);
    case 'constraints':
      return renderConstraints(content as string[]);
    case 'process':
      return renderProcess(content as string[]);
    case 'criteria':
      return renderCriteria(content as string[]);
    case 'data':
      return renderData(content as DataDirective);
    case 'examples':
      return renderExamples(content as ExampleDirective[]);
    default:
      return '';
  }
}

/**
 * Renders goal directive as paragraph
 * @param content - Goal text content
 * @returns Rendered goal section
 */
export function renderGoal(content: string): string {
  return `## Goal\n\n${content}\n`;
}

/**
 * Renders principles directive as bullet list
 * @param content - Array of principle strings
 * @returns Rendered principles section
 */
export function renderPrinciples(content: string[]): string {
  const items = content.map(item => `- ${item}`).join('\n');
  return `## Principles\n\n${items}\n`;
}

/**
 * Renders constraints directive as bullet list
 * @param content - Array of constraint strings
 * @returns Rendered constraints section
 */
export function renderConstraints(content: string[]): string {
  const items = content.map(item => `- ${item}`).join('\n');
  return `## Constraints\n\n${items}\n`;
}

/**
 * Renders process directive as ordered list
 * @param content - Array of process step strings
 * @returns Rendered process section
 */
export function renderProcess(content: string[]): string {
  const items = content
    .map((item, index) => `${index + 1}. ${item}`)
    .join('\n');
  return `## Process\n\n${items}\n`;
}

/**
 * Renders criteria directive as task list
 * @param content - Array of criteria strings
 * @returns Rendered criteria section
 */
export function renderCriteria(content: string[]): string {
  const items = content.map(item => `- [ ] ${item}`).join('\n');
  return `## Criteria\n\n${items}\n`;
}

/**
 * Renders data directive as fenced code block
 * @param content - Data directive with mediaType and value
 * @returns Rendered data section
 */
export function renderData(content: DataDirective): string {
  // Infer language from mediaType
  const language = inferLanguageFromMediaType(content.mediaType);
  const codeBlock = language
    ? `\`\`\`${language}\n${content.value}\n\`\`\``
    : `\`\`\`\n${content.value}\n\`\`\``;
  return `## Data\n\n${codeBlock}\n`;
}

/**
 * Renders examples directive with subheadings
 * @param content - Array of example directives
 * @returns Rendered examples section
 */
export function renderExamples(content: ExampleDirective[]): string {
  const sections = ['## Examples\n'];

  for (const example of content) {
    sections.push(`### ${example.title}\n`);
    sections.push(`${example.rationale}\n`);

    const language = example.language ?? '';
    const codeBlock = language
      ? `\`\`\`${language}\n${example.snippet}\n\`\`\``
      : `\`\`\`\n${example.snippet}\n\`\`\``;
    sections.push(`${codeBlock}\n`);
  }

  return sections.join('\n');
}

/**
 * Infers code block language from IANA media type
 * @param mediaType - The IANA media type string
 * @returns Language identifier for code block syntax highlighting
 */
export function inferLanguageFromMediaType(mediaType: string): string {
  const mediaTypeMap: Record<string, string> = {
    'application/json': 'json',
    'application/javascript': 'javascript',
    'application/xml': 'xml',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'javascript',
    'text/x-python': 'python',
    'text/x-java': 'java',
    'text/x-csharp': 'csharp',
    'text/x-go': 'go',
    'text/x-rust': 'rust',
    'text/x-typescript': 'typescript',
    'text/x-yaml': 'yaml',
    'text/x-toml': 'toml',
    'text/markdown': 'markdown',
    'text/x-sh': 'bash',
    'text/x-shellscript': 'bash',
  };

  return mediaTypeMap[mediaType.toLowerCase()] || '';
}
