/**
 * Tests for UMS v1.0 Markdown Renderer - Pure Functions
 */

import { describe, it, expect } from 'vitest';
import {
  renderMarkdown,
  renderModule,
  renderGoal,
  renderPrinciples,
  renderConstraints,
  renderProcess,
  renderCriteria,
  renderData,
  renderExamples,
  inferLanguageFromMediaType,
} from './markdown-renderer.js';
import type {
  UMSModule,
  UMSPersona,
  DataDirective,
  ExampleDirective,
} from '../../types/index.js';

// Mock modules for testing
const mockModule1: UMSModule = {
  id: 'foundation/logic/deductive-reasoning',
  version: '1.0',
  schemaVersion: '1.0',
  shape: 'specification',
  meta: {
    name: 'Deductive Reasoning',
    description: 'Logical deduction principles',
    semantic: 'Logic and reasoning framework',
  },
  body: {
    goal: 'Apply deductive reasoning principles',
    principles: [
      'Start with general statements',
      'Apply logical rules',
      'Reach specific conclusions',
    ],
  },
};

const mockModule2: UMSModule = {
  id: 'technology/react/hooks',
  version: '1.0',
  schemaVersion: '1.0',
  shape: 'procedure',
  meta: {
    name: 'React Hooks',
    description: 'React hooks best practices',
    semantic: 'Frontend development patterns',
  },
  body: {
    process: [
      'Import necessary hooks',
      'Initialize state with useState',
      'Handle side effects with useEffect',
    ],
    constraints: [
      'Always call hooks at top level',
      'Never call hooks inside conditions',
    ],
  },
};

const mockPersona: UMSPersona = {
  name: 'Test Persona',
  version: '1.0',
  schemaVersion: '1.0',
  description: 'A test persona',
  semantic: 'Testing framework',
  identity: 'I am a test persona focused on quality and logic.',
  attribution: false,
  moduleGroups: [
    {
      groupName: 'Foundation',
      modules: ['foundation/logic/deductive-reasoning'],
    },
    {
      groupName: 'Technology',
      modules: ['technology/react/hooks'],
    },
  ],
};

describe('renderer', () => {
  describe('renderGoal', () => {
    it('should render goal directive as paragraph', () => {
      const result = renderGoal('Apply deductive reasoning principles');
      expect(result).toBe('## Goal\n\nApply deductive reasoning principles\n');
    });
  });

  describe('renderPrinciples', () => {
    it('should render principles as bullet list', () => {
      const principles = [
        'Start with general statements',
        'Apply logical rules',
      ];
      const result = renderPrinciples(principles);
      expect(result).toBe(
        '## Principles\n\n- Start with general statements\n- Apply logical rules\n'
      );
    });
  });

  describe('renderConstraints', () => {
    it('should render constraints as bullet list', () => {
      const constraints = [
        'Always call hooks at top level',
        'Never call hooks inside conditions',
      ];
      const result = renderConstraints(constraints);
      expect(result).toBe(
        '## Constraints\n\n- Always call hooks at top level\n- Never call hooks inside conditions\n'
      );
    });
  });

  describe('renderProcess', () => {
    it('should render process as ordered list', () => {
      const process = [
        'Import necessary hooks',
        'Initialize state',
        'Handle side effects',
      ];
      const result = renderProcess(process);
      expect(result).toBe(
        '## Process\n\n1. Import necessary hooks\n2. Initialize state\n3. Handle side effects\n'
      );
    });
  });

  describe('renderCriteria', () => {
    it('should render criteria as task list', () => {
      const criteria = ['Hooks are imported correctly', 'State is initialized'];
      const result = renderCriteria(criteria);
      expect(result).toBe(
        '## Criteria\n\n- [ ] Hooks are imported correctly\n- [ ] State is initialized\n'
      );
    });
  });

  describe('renderData', () => {
    it('should render data directive with inferred language', () => {
      const data: DataDirective = {
        mediaType: 'application/json',
        value: '{"key": "value"}',
      };
      const result = renderData(data);
      expect(result).toBe('## Data\n\n```json\n{"key": "value"}\n```\n');
    });

    it('should render data directive without language when not recognized', () => {
      const data: DataDirective = {
        mediaType: 'text/unknown',
        value: 'some content',
      };
      const result = renderData(data);
      expect(result).toBe('## Data\n\n```\nsome content\n```\n');
    });
  });

  describe('renderExamples', () => {
    it('should render examples with subheadings', () => {
      const examples: ExampleDirective[] = [
        {
          title: 'Basic useState',
          rationale: 'Simple state management',
          snippet: 'const [count, setCount] = useState(0);',
          language: 'javascript',
        },
      ];
      const result = renderExamples(examples);
      expect(result).toBe(
        '## Examples\n\n### Basic useState\n\nSimple state management\n\n```javascript\nconst [count, setCount] = useState(0);\n```\n'
      );
    });
  });

  describe('inferLanguageFromMediaType', () => {
    it('should infer correct language from media types', () => {
      expect(inferLanguageFromMediaType('application/json')).toBe('json');
      expect(inferLanguageFromMediaType('text/javascript')).toBe('javascript');
      expect(inferLanguageFromMediaType('text/x-python')).toBe('python');
      expect(inferLanguageFromMediaType('text/x-typescript')).toBe(
        'typescript'
      );
      expect(inferLanguageFromMediaType('application/xml')).toBe('xml');
    });

    it('should return empty string for unknown media types', () => {
      expect(inferLanguageFromMediaType('text/unknown')).toBe('');
      expect(inferLanguageFromMediaType('application/custom')).toBe('');
    });
  });

  describe('renderModule', () => {
    it('should render a complete module', () => {
      const result = renderModule(mockModule1);
      expect(result).toContain(
        '## Goal\n\nApply deductive reasoning principles'
      );
      expect(result).toContain(
        '## Principles\n\n- Start with general statements'
      );
    });
  });

  describe('renderMarkdown', () => {
    it('should render complete persona with modules', () => {
      const modules = [mockModule1, mockModule2];
      const result = renderMarkdown(mockPersona, modules);

      expect(result).toContain(
        '## Identity\n\nI am a test persona focused on quality and logic.'
      );
      expect(result).toContain('# Foundation');
      expect(result).toContain('# Technology');
      expect(result).toContain(
        '## Goal\n\nApply deductive reasoning principles'
      );
      expect(result).toContain('## Process\n\n1. Import necessary hooks');
    });

    it('should handle persona without identity', () => {
      const personaWithoutIdentity: UMSPersona = {
        ...mockPersona,
        identity: '',
        moduleGroups: [
          {
            groupName: 'Foundation',
            modules: ['foundation/logic/deductive-reasoning'],
          },
        ],
      };
      const modules = [mockModule1];
      const result = renderMarkdown(personaWithoutIdentity, modules);

      expect(result).not.toContain('## Identity');
      expect(result).toContain('# Foundation');
    });

    it('should handle modules without group names', () => {
      const personaWithoutGroupNames: UMSPersona = {
        ...mockPersona,
        moduleGroups: [
          {
            modules: ['foundation/logic/deductive-reasoning'],
          },
        ],
      };
      const modules = [mockModule1];
      const result = renderMarkdown(personaWithoutGroupNames, modules);

      expect(result).not.toContain('# Foundation');
      expect(result).toContain(
        '## Goal\n\nApply deductive reasoning principles'
      );
    });

    it('should add attribution when enabled', () => {
      const personaWithAttribution: UMSPersona = {
        ...mockPersona,
        attribution: true,
        moduleGroups: [
          {
            groupName: 'Foundation',
            modules: ['foundation/logic/deductive-reasoning'],
          },
        ],
      };
      const modules = [mockModule1];
      const result = renderMarkdown(personaWithAttribution, modules);

      expect(result).toContain(
        '[Attribution: foundation/logic/deductive-reasoning]'
      );
    });
  });
});
