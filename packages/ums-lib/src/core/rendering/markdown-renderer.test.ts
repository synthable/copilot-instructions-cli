/**
 * Tests for UMS v2.0 Markdown Renderer - Pure Functions
 */

import { describe, it, expect } from 'vitest';
import {
  renderMarkdown,
  renderModule,
  renderComponent,
  renderInstructionComponent,
  renderKnowledgeComponent,
  renderDataComponent,
  renderConcept,
  renderExample,
  renderPattern,
  inferLanguageFromFormat,
} from './markdown-renderer.js';
import type {
  Module,
  Persona,
  InstructionComponent,
  DataComponent,
  Concept,
  Example,
  Pattern,
} from '../../types/index.js';
import { ComponentType } from '../../types/index.js';

// Mock modules for testing
const mockInstructionModule: Module = {
  id: 'foundation/logic/deductive-reasoning',
  version: '1.0',
  schemaVersion: '2.0',
  capabilities: ['reasoning', 'logic'],
 cognitiveLevel: 2,
  metadata: {
    name: 'Deductive Reasoning',
    description: 'Logical deduction principles',
    semantic: 'Logic and reasoning framework',
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Apply deductive reasoning principles',
      process: [
        'Start with general statements',
        'Apply logical rules',
        'Reach specific conclusions',
      ],
      principles: ['Always verify premises', 'Use sound logical inference'],
      constraints: [
        'Never assume unproven premises',
        'Maintain logical consistency',
      ],
      criteria: [
        'All steps are logically valid',
        'Conclusions follow from premises',
      ],
    },
  },
};

const mockKnowledgeModule: Module = {
  id: 'principle/patterns/observer',
  version: '1.0',
  schemaVersion: '2.0',
  capabilities: ['patterns', 'design'],
 cognitiveLevel: 2,
  metadata: {
    name: 'Observer Pattern',
    description: 'Behavioral design pattern',
    semantic: 'Design patterns knowledge',
  },
  knowledge: {
    type: ComponentType.Knowledge,
    knowledge: {
      explanation:
        'The Observer pattern defines a one-to-many dependency between objects.',
      concepts: [
        {
          name: 'Subject',
          description: 'The object being observed',
          rationale: 'Centralizes state management',
          examples: ['Event emitters', 'Observables'],
        },
      ],
      examples: [
        {
          title: 'Basic Observer',
          rationale: 'Simple implementation',
          snippet: 'subject.subscribe(observer);',
          language: 'javascript',
        },
      ],
      patterns: [
        {
          name: 'Push vs Pull',
          useCase: 'Data notification strategy',
          description: 'Choose between pushing data or pulling on notification',
          advantages: ['Push: immediate updates', 'Pull: lazy evaluation'],
          disadvantages: [
            'Push: unnecessary updates',
            'Pull: additional calls',
          ],
        },
      ],
    },
  },
};

const mockDataModule: Module = {
  id: 'data/config/defaults',
  version: '1.0',
  schemaVersion: '2.0',
  capabilities: ['configuration'],
 cognitiveLevel: 2,
  metadata: {
    name: 'Default Configuration',
    description: 'Default system configuration',
    semantic: 'Configuration data',
  },
  data: {
    type: ComponentType.Data,
    data: {
      format: 'json',
      value: { timeout: 5000, retries: 3 },
      description: 'Default system settings',
    },
  },
};

const mockPersona: Persona = {
  name: 'Test Persona',
  version: '1.0',
  schemaVersion: '2.0',
  description: 'A test persona',
  semantic: 'Testing framework',
  identity: 'I am a test persona focused on quality and logic.',
  attribution: false,
  modules: [
    'foundation/logic/deductive-reasoning',
    'principle/patterns/observer',
    'data/config/defaults',
  ],
};

const mockPersonaWithGroups: Persona = {
  name: 'Grouped Persona',
  version: '1.0',
  schemaVersion: '2.0',
  description: 'A persona with grouped modules',
  semantic: 'Grouped testing framework',
  identity: 'I organize modules into groups.',
  attribution: true,
  modules: [
    { group: 'Foundation', ids: ['foundation/logic/deductive-reasoning'] },
    {
      group: 'Patterns',
      ids: ['principle/patterns/observer', 'data/config/defaults'],
    },
  ],
};

describe('renderer', () => {
  describe('renderInstructionComponent', () => {
    it('should render instruction with all fields', () => {
      const result = renderInstructionComponent(
        mockInstructionModule.instruction!
      );

      expect(result).toContain(
        '## Purpose\n\nApply deductive reasoning principles'
      );
      expect(result).toContain('## Process\n');
      expect(result).toContain('1. Start with general statements');
      expect(result).toContain('## Principles\n');
      expect(result).toContain('- Always verify premises');
      expect(result).toContain('## Constraints\n');
      expect(result).toContain('- Never assume unproven premises');
      expect(result).toContain('## Criteria\n');
      expect(result).toContain('- [ ] All steps are logically valid');
    });

    it('should handle detailed process steps', () => {
      const component: InstructionComponent = {
        type: ComponentType.Instruction,
        instruction: {
          purpose: 'Test purpose',
          process: [
            { step: 'First step', detail: 'Additional details' },
            'Simple step',
          ],
        },
      };
      const result = renderInstructionComponent(component);

      expect(result).toContain('1. First step\n   Additional details');
      expect(result).toContain('2. Simple step');
    });
  });

  describe('renderKnowledgeComponent', () => {
    it('should render knowledge with all fields', () => {
      const result = renderKnowledgeComponent(mockKnowledgeModule.knowledge!);

      expect(result).toContain('## Explanation\n\nThe Observer pattern');
      expect(result).toContain('## Concepts\n');
      expect(result).toContain('### Subject\n');
      expect(result).toContain('## Examples\n');
      expect(result).toContain('### Basic Observer\n');
      expect(result).toContain('## Patterns\n');
      expect(result).toContain('### Push vs Pull\n');
    });
  });

  describe('renderDataComponent', () => {
    it('should render data with JSON format', () => {
      const result = renderDataComponent(mockDataModule.data!);

      expect(result).toContain('## Data\n\nDefault system settings');
      expect(result).toContain('```json');
      expect(result).toContain('"timeout"');
      expect(result).toContain('"retries"');
    });

    it('should handle string values', () => {
      const component: DataComponent = {
        type: ComponentType.Data,
        data: {
          format: 'yaml',
          value: 'key: value',
        },
      };
      const result = renderDataComponent(component);

      expect(result).toContain('```yaml\nkey: value\n```');
    });
  });

  describe('renderConcept', () => {
    it('should render concept with all fields', () => {
      const concept: Concept = {
        name: 'Test Concept',
        description: 'A test description',
        rationale: 'Why this matters',
        examples: ['Example 1', 'Example 2'],
      };
      const result = renderConcept(concept);

      expect(result).toContain('### Test Concept\n');
      expect(result).toContain('A test description');
      expect(result).toContain('**Rationale:** Why this matters');
      expect(result).toContain('**Examples:**\n');
      expect(result).toContain('- Example 1');
    });
  });

  describe('renderExample', () => {
    it('should render example with language', () => {
      const example: Example = {
        title: 'Test Example',
        rationale: 'Shows a pattern',
        snippet: 'const x = 1;',
        language: 'javascript',
      };
      const result = renderExample(example);

      expect(result).toContain('### Test Example\n');
      expect(result).toContain('Shows a pattern');
      expect(result).toContain('```javascript\nconst x = 1;\n```');
    });
  });

  describe('renderPattern', () => {
    it('should render pattern with advantages and disadvantages', () => {
      const pattern: Pattern = {
        name: 'Test Pattern',
        useCase: 'When to use it',
        description: 'Pattern description',
        advantages: ['Pro 1', 'Pro 2'],
        disadvantages: ['Con 1'],
      };
      const result = renderPattern(pattern);

      expect(result).toContain('### Test Pattern\n');
      expect(result).toContain('**Use Case:** When to use it');
      expect(result).toContain('**Advantages:**\n');
      expect(result).toContain('- Pro 1');
      expect(result).toContain('**Disadvantages:**\n');
      expect(result).toContain('- Con 1');
    });
  });

  describe('inferLanguageFromFormat', () => {
    it('should infer correct language from formats', () => {
      expect(inferLanguageFromFormat('json')).toBe('json');
      expect(inferLanguageFromFormat('yaml')).toBe('yaml');
      expect(inferLanguageFromFormat('javascript')).toBe('javascript');
      expect(inferLanguageFromFormat('ts')).toBe('typescript');
      expect(inferLanguageFromFormat('py')).toBe('python');
    });

    it('should return empty string for unknown formats', () => {
      expect(inferLanguageFromFormat('unknown')).toBe('');
      expect(inferLanguageFromFormat('custom')).toBe('');
    });

    it('should be case-insensitive', () => {
      expect(inferLanguageFromFormat('JSON')).toBe('json');
      expect(inferLanguageFromFormat('TypeScript')).toBe('typescript');
    });
  });

  describe('renderModule', () => {
    it('should render module with instruction shorthand', () => {
      const result = renderModule(mockInstructionModule);
      expect(result).toContain('## Purpose');
      expect(result).toContain('Apply deductive reasoning principles');
    });

    it('should render module with knowledge shorthand', () => {
      const result = renderModule(mockKnowledgeModule);
      expect(result).toContain('## Explanation');
      expect(result).toContain('Observer pattern');
    });

    it('should render module with data shorthand', () => {
      const result = renderModule(mockDataModule);
      expect(result).toContain('## Data');
      expect(result).toContain('```json');
    });
  });

  describe('renderMarkdown', () => {
    it('should render complete persona with identity', () => {
      const modules = [
        mockInstructionModule,
        mockKnowledgeModule,
        mockDataModule,
      ];
      const result = renderMarkdown(mockPersona, modules);

      expect(result).toContain('## Identity\n');
      expect(result).toContain(
        'I am a test persona focused on quality and logic.'
      );
      expect(result).toContain(
        '## Purpose\n\nApply deductive reasoning principles'
      );
      expect(result).toContain('## Explanation\n\nThe Observer pattern');
    });

    it('should handle persona without identity', () => {
      const personaWithoutIdentity: Persona = {
        ...mockPersona,
        identity: '',
      };
      const modules = [
        mockInstructionModule,
        mockKnowledgeModule,
        mockDataModule,
      ];
      const result = renderMarkdown(personaWithoutIdentity, modules);

      expect(result).not.toContain('## Identity');
      expect(result).toContain('## Purpose');
    });

    it('should render groups with headings', () => {
      const modules = [
        mockInstructionModule,
        mockKnowledgeModule,
        mockDataModule,
      ];
      const result = renderMarkdown(mockPersonaWithGroups, modules);

      expect(result).toContain('# Foundation\n');
      expect(result).toContain('# Patterns\n');
    });

    it('should add attribution when enabled', () => {
      const modules = [
        mockInstructionModule,
        mockKnowledgeModule,
        mockDataModule,
      ];
      const result = renderMarkdown(mockPersonaWithGroups, modules);

      expect(result).toContain(
        '[Attribution: foundation/logic/deductive-reasoning]'
      );
    });

    it('should handle string module entries', () => {
      const modules = [
        mockInstructionModule,
        mockKnowledgeModule,
        mockDataModule,
      ];
      const result = renderMarkdown(mockPersona, modules);

      expect(result).toContain('## Purpose');
      expect(result).not.toContain('[Attribution:'); // attribution is false
    });
  });

  describe('renderComponent', () => {
    it('should dispatch to correct renderer based on type', () => {
      const instruction = renderComponent(mockInstructionModule.instruction!);
      expect(instruction).toContain('## Purpose');

      const knowledge = renderComponent(mockKnowledgeModule.knowledge!);
      expect(knowledge).toContain('## Explanation');

      const data = renderComponent(mockDataModule.data!);
      expect(data).toContain('## Data');
    });
  });
});
