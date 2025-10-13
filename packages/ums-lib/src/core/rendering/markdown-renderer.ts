/**
 * UMS v2.0 Markdown Renderer - Pure Functions
 * Implements Markdown rendering according to UMS v2.0 specification Section 7.1
 */

import type {
  Module,
  Persona,
  Component,
  InstructionComponent,
  KnowledgeComponent,
  DataComponent,
  Example,
  Pattern,
  Concept,
} from '../../types/index.js';
import { ComponentType } from '../../types/index.js';

/**
 * Renders a complete persona with modules to Markdown
 * @param persona - The persona configuration
 * @param modules - Array of resolved modules in correct order
 * @returns Rendered Markdown content
 */
export function renderMarkdown(persona: Persona, modules: Module[]): string {
  const sections: string[] = [];

  // Render persona identity if present and not empty (Section 7.1)
  if (persona.identity?.trim()) {
    sections.push('## Identity\n');
    sections.push(`${persona.identity}\n`);
  }

  // Group modules by their module entries for proper ordering
  let moduleIndex = 0;

  for (const entry of persona.modules) {
    // Handle grouped modules
    if (typeof entry === 'object' && 'ids' in entry) {
      // Optional group heading (non-normative)
      if (entry.group) {
        sections.push(`# ${entry.group}\n`);
      }

      const moduleBlocks: string[] = [];
      // Process each module ID in the group
      entry.ids.forEach(() => {
        const module = modules[moduleIndex++];
        let block = renderModule(module);
        if (persona.attribution) {
          block += `\n[Attribution: ${module.id}]\n`;
        }
        moduleBlocks.push(block);
      });
      if (moduleBlocks.length > 0) {
        sections.push(moduleBlocks.join('---\n'));
      }
    } else {
      // Single module ID
      const module = modules[moduleIndex++];
      let block = renderModule(module);
      if (persona.attribution) {
        block += `\n[Attribution: ${module.id}]\n`;
      }
      sections.push(block);
    }
  }

  return sections.join('\n').trim() + '\n';
}

/**
 * Renders a single module to Markdown
 * @param module - The module to render
 * @returns Rendered module content
 */
export function renderModule(module: Module): string {
  const sections: string[] = [];

  // Render shorthand properties first (single component)
  if (module.instruction) {
    sections.push(renderInstructionComponent(module.instruction));
  } else if (module.knowledge) {
    sections.push(renderKnowledgeComponent(module.knowledge));
  } else if (module.data) {
    sections.push(renderDataComponent(module.data));
  } else if (module.components) {
    // Render multiple components
    for (const component of module.components) {
      sections.push(renderComponent(component));
    }
  }

  return sections.join('\n');
}

/**
 * Renders a single component to Markdown
 * @param component - The component to render
 * @returns Rendered component content
 */
export function renderComponent(component: Component): string {
  // Use discriminated union with ComponentType enum for type-safe matching
  if (component.type === ComponentType.Instruction) {
    return renderInstructionComponent(component);
  } else if (component.type === ComponentType.Knowledge) {
    return renderKnowledgeComponent(component);
  } else {
    // Must be Data component (type system guarantees this)
    return renderDataComponent(component);
  }
}

/**
 * Renders an instruction component to Markdown
 * @param component - The instruction component
 * @returns Rendered instruction content
 */
export function renderInstructionComponent(
  component: InstructionComponent
): string {
  const sections: string[] = [];
  const { instruction } = component;

  // Purpose
  if (instruction.purpose) {
    sections.push(`## Purpose\n\n${instruction.purpose}\n`);
  }

  // Process
  if (instruction.process && instruction.process.length > 0) {
    sections.push('## Process\n');
    const steps = instruction.process.map((step, index) => {
      if (typeof step === 'string') {
        return `${index + 1}. ${step}`;
      }
      let stepText = `${index + 1}. ${step.step}`;
      if (step.detail) {
        stepText += `\n   ${step.detail}`;
      }
      return stepText;
    });
    sections.push(steps.join('\n') + '\n');
  }

  // Constraints
  if (instruction.constraints && instruction.constraints.length > 0) {
    sections.push('## Constraints\n');
    const constraints = instruction.constraints.map(constraint => {
      if (typeof constraint === 'string') {
        return `- ${constraint}`;
      }
      return `- ${constraint.rule}`;
    });
    sections.push(constraints.join('\n') + '\n');
  }

  // Principles
  if (instruction.principles && instruction.principles.length > 0) {
    sections.push('## Principles\n');
    const principles = instruction.principles.map(p => `- ${p}`);
    sections.push(principles.join('\n') + '\n');
  }

  // Criteria
  if (instruction.criteria && instruction.criteria.length > 0) {
    sections.push('## Criteria\n');
    const criteria = instruction.criteria.map(criterion => {
      if (typeof criterion === 'string') {
        return `- [ ] ${criterion}`;
      }
      return `- [ ] ${criterion.item}`;
    });
    sections.push(criteria.join('\n') + '\n');
  }

  return sections.join('\n');
}

/**
 * Renders a knowledge component to Markdown
 * @param component - The knowledge component
 * @returns Rendered knowledge content
 */
export function renderKnowledgeComponent(
  component: KnowledgeComponent
): string {
  const sections: string[] = [];
  const { knowledge } = component;

  // Explanation
  if (knowledge.explanation) {
    sections.push(`## Explanation\n\n${knowledge.explanation}\n`);
  }

  // Concepts
  if (knowledge.concepts && knowledge.concepts.length > 0) {
    sections.push('## Concepts\n');
    for (const concept of knowledge.concepts) {
      sections.push(renderConcept(concept));
    }
  }

  // Examples
  if (knowledge.examples && knowledge.examples.length > 0) {
    sections.push('## Examples\n');
    for (const example of knowledge.examples) {
      sections.push(renderExample(example));
    }
  }

  // Patterns
  if (knowledge.patterns && knowledge.patterns.length > 0) {
    sections.push('## Patterns\n');
    for (const pattern of knowledge.patterns) {
      sections.push(renderPattern(pattern));
    }
  }

  return sections.join('\n');
}

/**
 * Renders a concept to Markdown
 * @param concept - The concept to render
 * @returns Rendered concept content
 */
export function renderConcept(concept: Concept): string {
  const sections: string[] = [];

  sections.push(`### ${concept.name}\n`);
  sections.push(`${concept.description}\n`);

  if (concept.rationale) {
    sections.push(`**Rationale:** ${concept.rationale}\n`);
  }

  if (concept.examples && concept.examples.length > 0) {
    sections.push('**Examples:**\n');
    for (const example of concept.examples) {
      sections.push(`- ${example}`);
    }
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Renders an example to Markdown
 * @param example - The example to render
 * @returns Rendered example content
 */
export function renderExample(example: Example): string {
  const sections: string[] = [];

  sections.push(`### ${example.title}\n`);
  sections.push(`${example.rationale}\n`);

  const language = example.language ?? '';
  const codeBlock = language
    ? `\`\`\`${language}\n${example.snippet}\n\`\`\``
    : `\`\`\`\n${example.snippet}\n\`\`\``;
  sections.push(`${codeBlock}\n`);

  return sections.join('\n');
}

/**
 * Renders a pattern to Markdown
 * @param pattern - The pattern to render
 * @returns Rendered pattern content
 */
export function renderPattern(pattern: Pattern): string {
  const sections: string[] = [];

  sections.push(`### ${pattern.name}\n`);
  sections.push(`**Use Case:** ${pattern.useCase}\n`);
  sections.push(`${pattern.description}\n`);

  if (pattern.advantages && pattern.advantages.length > 0) {
    sections.push('**Advantages:**\n');
    for (const advantage of pattern.advantages) {
      sections.push(`- ${advantage}`);
    }
    sections.push('');
  }

  if (pattern.disadvantages && pattern.disadvantages.length > 0) {
    sections.push('**Disadvantages:**\n');
    for (const disadvantage of pattern.disadvantages) {
      sections.push(`- ${disadvantage}`);
    }
    sections.push('');
  }

  if (pattern.example) {
    sections.push(renderExample(pattern.example));
  }

  return sections.join('\n');
}

/**
 * Renders a data component to Markdown
 * @param component - The data component
 * @returns Rendered data content
 */
export function renderDataComponent(component: DataComponent): string {
  const sections: string[] = [];
  const { data } = component;

  if (data.description) {
    sections.push(`## Data\n\n${data.description}\n`);
  } else {
    sections.push('## Data\n');
  }

  // Infer language from format
  const language = inferLanguageFromFormat(data.format);
  const value =
    typeof data.value === 'string'
      ? data.value
      : JSON.stringify(data.value, null, 2);
  const codeBlock = language
    ? `\`\`\`${language}\n${value}\n\`\`\``
    : `\`\`\`\n${value}\n\`\`\``;

  sections.push(`${codeBlock}\n`);

  return sections.join('\n');
}

/**
 * Infers code block language from format string
 * @param format - The format string (e.g., "json", "yaml", "xml")
 * @returns Language identifier for code block syntax highlighting
 */
export function inferLanguageFromFormat(format: string): string {
  const formatMap: Record<string, string> = {
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    html: 'html',
    css: 'css',
    javascript: 'javascript',
    js: 'javascript',
    typescript: 'typescript',
    ts: 'typescript',
    python: 'python',
    py: 'python',
    java: 'java',
    csharp: 'csharp',
    'c#': 'csharp',
    go: 'go',
    rust: 'rust',
    markdown: 'markdown',
    md: 'markdown',
    bash: 'bash',
    sh: 'bash',
    shell: 'bash',
    toml: 'toml',
  };

  return formatMap[format.toLowerCase()] || '';
}
