/**
 * UMS v2.1 Markdown Renderer - Pure Functions
 * Implements Markdown rendering according to UMS v2.1 specification Section 7.1
 */

import type {
  Module,
  Persona,
  Component,
  InstructionComponent,
  KnowledgeComponent,
  Example,
  Pattern,
  Concept,
  ProcessStep,
  Criterion,
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
  } else {
    // Must be Knowledge component (type system guarantees this)
    return renderKnowledgeComponent(component);
  }
}

/**
 * Renders a single process step (v2.1 simplified format)
 * @param step - The process step (string or ProcessStep object)
 * @param index - The step number (0-based)
 * @returns Formatted markdown for the step
 */
export function renderProcessStep(
  step: string | ProcessStep,
  index: number
): string {
  // Handle simple string steps
  if (typeof step === 'string') {
    return `${index + 1}. ${step}`;
  }

  // Handle object with notes
  let stepText = `${index + 1}. **${step.step}**`;

  if (step.notes && step.notes.length > 0) {
    const notesList = step.notes.map(note => `   - ${note}`).join('\n');
    stepText += `\n${notesList}`;
  }

  return stepText;
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
    const steps = instruction.process.map((step, index) =>
      renderProcessStep(step, index)
    );
    sections.push(steps.join('\n') + '\n');
  }

  // Constraints
  if (instruction.constraints && instruction.constraints.length > 0) {
    sections.push('## Constraints\n');
    const constraints = instruction.constraints.map(constraint => {
      if (typeof constraint === 'string') {
        return `- ${constraint}`;
      }
      // Constraint with notes
      let text = `- **${constraint.rule}**`;
      if (constraint.notes && constraint.notes.length > 0) {
        const notesList = constraint.notes
          .map(note => `  - ${note}`)
          .join('\n');
        text += `\n${notesList}`;
      }
      return text;
    });
    sections.push(constraints.join('\n\n') + '\n');
  }

  // Principles
  if (instruction.principles && instruction.principles.length > 0) {
    sections.push('## Principles\n');
    const principles = instruction.principles.map(p => `- ${p}`);
    sections.push(principles.join('\n') + '\n');
  }

  // Criteria (v2.1 with category grouping and notes)
  if (instruction.criteria && instruction.criteria.length > 0) {
    sections.push('## Criteria\n');
    sections.push(renderCriteria(instruction.criteria) + '\n');
  }

  return sections.join('\n');
}

/**
 * Renders criteria with category grouping (v2.1)
 * @param criteria - Array of criteria (strings or Criterion objects)
 * @returns Formatted markdown for all criteria
 */
export function renderCriteria(criteria: (string | Criterion)[]): string {
  // Group criteria by category
  const uncategorized: (string | Criterion)[] = [];
  const categorized = new Map<string, (string | Criterion)[]>();

  for (const criterion of criteria) {
    if (typeof criterion === 'string' || !criterion.category) {
      uncategorized.push(criterion);
    } else {
      let categoryArray = categorized.get(criterion.category);
      if (!categoryArray) {
        categoryArray = [];
        categorized.set(criterion.category, categoryArray);
      }
      categoryArray.push(criterion);
    }
  }

  const sections: string[] = [];

  // Render uncategorized criteria first
  if (uncategorized.length > 0) {
    const items = uncategorized.map(c => renderCriterionItem(c));
    sections.push(items.join('\n\n'));
  }

  // Render categorized groups with subheadings
  Array.from(categorized.entries()).forEach(([category, items]) => {
    sections.push(`### ${category}\n`);
    const renderedItems = items.map(c => renderCriterionItem(c));
    sections.push(renderedItems.join('\n\n'));
  });

  return sections.join('\n\n');
}

/**
 * Renders a single criterion item (v2.1 simplified format)
 * @param criterion - The criterion (string or Criterion object)
 * @returns Formatted markdown for the criterion
 */
export function renderCriterionItem(criterion: string | Criterion): string {
  // Handle simple string criteria
  if (typeof criterion === 'string') {
    return `- [ ] ${criterion}`;
  }

  // Handle object with notes
  if (criterion.notes && criterion.notes.length > 0) {
    let text = `- [ ] **${criterion.item}**`;
    const notesList = criterion.notes.map(note => `  - ${note}`).join('\n');
    text += `\n${notesList}`;
    return text;
  }

  // Object without notes
  return `- [ ] ${criterion.item}`;
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

  sections.push(`#### Concept: ${concept.name}\n`);
  sections.push(`${concept.description}\n`);

  if (concept.rationale) {
    sections.push(`**Rationale:** ${concept.rationale}\n`);
  }

  // Per spec 6.3.4: examples come before trade-offs
  if (concept.examples && concept.examples.length > 0) {
    sections.push('**Examples:**\n');
    for (const example of concept.examples) {
      sections.push(`- ${example}`);
    }
    sections.push('');
  }

  if (concept.tradeoffs && concept.tradeoffs.length > 0) {
    sections.push('**Trade-offs:**\n');
    for (const tradeoff of concept.tradeoffs) {
      sections.push(`- ${tradeoff}`);
    }
    sections.push('');
  }

  return sections.join('\n');
}

/**
 * Renders an example to Markdown
 * Per spec 6.3.5: If rationale or snippet is empty/not present, omit that section
 * @param example - The example to render
 * @returns Rendered example content
 */
export function renderExample(example: Example): string {
  const sections: string[] = [];

  sections.push(`#### Example: ${example.title}\n`);

  // Per spec 6.3.5: Only render rationale if non-empty
  if (example.rationale.trim()) {
    sections.push(`**Rationale:** ${example.rationale}\n`);
  }

  // Per spec 6.3.5: Only render code block if snippet is non-empty
  if (example.snippet.trim()) {
    const language = example.language ?? '';
    const codeBlock = language
      ? `\`\`\`${language}\n${example.snippet}\n\`\`\``
      : `\`\`\`\n${example.snippet}\n\`\`\``;
    sections.push(`${codeBlock}\n`);
  }

  return sections.join('\n');
}

/**
 * Renders a pattern to Markdown
 * Per spec 6.3.6: If useCase, description, advantages, disadvantages, or example
 * are empty/not present, omit their corresponding sections
 * @param pattern - The pattern to render
 * @returns Rendered pattern content
 */
export function renderPattern(pattern: Pattern): string {
  const sections: string[] = [];

  sections.push(`#### Pattern: ${pattern.name}\n`);

  // Per spec 6.3.6: Only render useCase if non-empty
  if (pattern.useCase.trim()) {
    sections.push(`**Use Case:** ${pattern.useCase}\n`);
  }

  // Per spec 6.3.6: Only render description if non-empty
  if (pattern.description.trim()) {
    sections.push(`${pattern.description}\n`);
  }

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
