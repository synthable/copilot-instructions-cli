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
  Constraint,
  ConstraintObject,
  Criterion,
  CriterionObject,
  CriterionGroup,
} from '../../types/index.js';
import {
  ComponentType,
  isConstraintGroup,
  isCriterionGroup,
} from '../../types/index.js';

/**
 * Renders an array of notes as indented sub-bullets
 * @param notes - Array of note strings
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Formatted markdown for notes
 */
function renderNotes(notes: string[], indent = 2): string {
  const indentStr = ' '.repeat(indent);
  return notes.map(note => `${indentStr}- ${note}`).join('\n');
}

/**
 * Renders an array of strings as a bullet list
 * @param items - Array of strings
 * @returns Formatted markdown bullet list
 */
function renderBulletList(items: string[]): string {
  return items.map(item => `- ${item}`).join('\n');
}

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
    stepText += `\n${renderNotes(step.notes, 3)}`;
  }

  return stepText;
}

/**
 * Renders a single constraint item (string or ConstraintObject)
 * @param constraint - The constraint to render
 * @returns Formatted markdown for the constraint
 */
function renderConstraintItem(constraint: string | ConstraintObject): string {
  if (typeof constraint === 'string') {
    return `- ${constraint}`;
  }
  let text = `- **${constraint.rule}**`;
  if (constraint.notes && constraint.notes.length > 0) {
    text += `\n${renderNotes(constraint.notes)}`;
  }
  return text;
}

/**
 * Renders constraints with optional grouping (v2.1)
 * @param constraints - Array of constraints (strings, ConstraintObject, or ConstraintGroup)
 * @returns Formatted markdown for all constraints
 */
export function renderConstraints(constraints: Constraint[]): string {
  const sections: string[] = [];

  for (const constraint of constraints) {
    if (isConstraintGroup(constraint)) {
      // Grouped constraints with subheading (H4 under ### Constraints)
      sections.push(`#### ${constraint.group}\n`);
      const groupItems = constraint.rules.map(rule =>
        renderConstraintItem(rule)
      );
      sections.push(groupItems.join('\n\n'));
    } else {
      sections.push(renderConstraintItem(constraint));
    }
  }

  return sections.join('\n\n');
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

  // Parent heading
  sections.push('## Instructions\n');

  // Purpose (inline bold label)
  if (instruction.purpose) {
    sections.push(`**Purpose**: ${instruction.purpose}\n`);
  }

  // Process
  if (instruction.process && instruction.process.length > 0) {
    sections.push('### Process\n');
    const steps = instruction.process.map((step, index) =>
      renderProcessStep(step, index)
    );
    sections.push(steps.join('\n') + '\n');
  }

  // Constraints
  if (instruction.constraints && instruction.constraints.length > 0) {
    sections.push('### Constraints\n');
    sections.push(renderConstraints(instruction.constraints) + '\n');
  }

  // Principles
  if (instruction.principles && instruction.principles.length > 0) {
    sections.push('### Principles\n');
    const principles = instruction.principles.map(p => `- ${p}`);
    sections.push(principles.join('\n') + '\n');
  }

  // Criteria
  if (instruction.criteria && instruction.criteria.length > 0) {
    sections.push('### Criteria\n');
    sections.push(renderCriteria(instruction.criteria) + '\n');
  }

  return sections.join('\n');
}

/**
 * Renders criteria with category grouping (v2.1)
 * Supports both per-item category (CriterionObject.category) and explicit groups (CriterionGroup)
 * @param criteria - Array of criteria (strings, CriterionObject, or CriterionGroup)
 * @returns Formatted markdown for all criteria
 */
export function renderCriteria(criteria: Criterion[]): string {
  // Separate explicit groups from individual items
  const explicitGroups: CriterionGroup[] = [];
  const individualItems: (string | CriterionObject)[] = [];

  for (const criterion of criteria) {
    if (isCriterionGroup(criterion)) {
      explicitGroups.push(criterion);
    } else {
      individualItems.push(criterion);
    }
  }

  // Group individual items by category (for CriterionObject.category support)
  const uncategorized: (string | CriterionObject)[] = [];
  const categorized = new Map<string, (string | CriterionObject)[]>();

  for (const item of individualItems) {
    if (typeof item === 'string') {
      uncategorized.push(item);
    } else if (item.category) {
      let categoryArray = categorized.get(item.category);
      if (!categoryArray) {
        categoryArray = [];
        categorized.set(item.category, categoryArray);
      }
      categoryArray.push(item);
    } else {
      uncategorized.push(item);
    }
  }

  const sections: string[] = [];

  // Render uncategorized criteria first
  if (uncategorized.length > 0) {
    const items = uncategorized.map(c => renderCriterionItem(c));
    sections.push(items.join('\n\n'));
  }

  // Render per-item categorized groups with subheadings (H4 under ### Criteria)
  for (const [category, items] of categorized) {
    sections.push(`#### ${category}\n`);
    const renderedItems = items.map(c => renderCriterionItem(c));
    sections.push(renderedItems.join('\n\n'));
  }

  // Render explicit CriterionGroup entries (H4 under ### Criteria)
  for (const group of explicitGroups) {
    sections.push(`#### ${group.group}\n`);
    const renderedItems = group.items.map(item => renderCriterionItem(item));
    sections.push(renderedItems.join('\n\n'));
  }

  return sections.join('\n\n');
}

/**
 * Renders a single criterion item (v2.1 simplified format)
 * @param criterion - The criterion (string or CriterionObject)
 * @returns Formatted markdown for the criterion
 */
export function renderCriterionItem(
  criterion: string | CriterionObject
): string {
  // Handle simple string criteria
  if (typeof criterion === 'string') {
    return `- [ ] ${criterion}`;
  }

  // Handle object with notes
  if (criterion.notes && criterion.notes.length > 0) {
    let text = `- [ ] **${criterion.item}**`;
    text += `\n${renderNotes(criterion.notes)}`;
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

  // Parent heading with explanation
  sections.push('## Knowledge\n');
  if (knowledge.explanation) {
    sections.push(`${knowledge.explanation}\n`);
  }

  // Concepts
  if (knowledge.concepts && knowledge.concepts.length > 0) {
    sections.push('### Key Concepts\n');
    for (const concept of knowledge.concepts) {
      sections.push(renderConcept(concept));
    }
  }

  // Examples
  if (knowledge.examples && knowledge.examples.length > 0) {
    sections.push('### Examples\n');
    for (const example of knowledge.examples) {
      sections.push(renderExample(example));
    }
  }

  // Patterns
  if (knowledge.patterns && knowledge.patterns.length > 0) {
    sections.push('### Patterns\n');
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

  // Per spec 6.3.4: examples come before trade-offs (can be strings or Example objects)
  if (concept.examples && concept.examples.length > 0) {
    sections.push('**Examples:**\n');
    for (const example of concept.examples) {
      if (typeof example === 'string') {
        sections.push(`- ${example}`);
      } else {
        sections.push(renderExample(example));
      }
    }
    sections.push('');
  }

  if (concept.tradeoffs && concept.tradeoffs.length > 0) {
    sections.push('**Trade-offs:**\n');
    sections.push(renderBulletList(concept.tradeoffs));
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
    sections.push(renderBulletList(pattern.advantages));
    sections.push('');
  }

  if (pattern.disadvantages && pattern.disadvantages.length > 0) {
    sections.push('**Disadvantages:**\n');
    sections.push(renderBulletList(pattern.disadvantages));
    sections.push('');
  }

  // Render examples (v2.1: plural, can be strings or Example objects)
  if (pattern.examples && pattern.examples.length > 0) {
    sections.push('**Examples:**\n');
    for (const example of pattern.examples) {
      if (typeof example === 'string') {
        sections.push(`- ${example}`);
      } else {
        sections.push(renderExample(example));
      }
    }
    sections.push('');
  }

  return sections.join('\n');
}
