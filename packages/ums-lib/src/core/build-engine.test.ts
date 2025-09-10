import { describe, it, expect, beforeEach } from 'vitest';
import { BuildEngine } from './build-engine.js';
import type { UMSModule, UMSPersona, ModuleGroup } from '../types/index.js';

// Helper function to create compliant personas
function createTestPersona(overrides: Partial<UMSPersona> = {}): UMSPersona {
  return {
    name: 'Test Persona',
    version: '1.0.0',
    schemaVersion: '1.0',
    description: 'Test persona for rendering',
    semantic: 'Test semantic description',
    identity: 'You are a test assistant.',
    moduleGroups: [] as ModuleGroup[],
    ...overrides,
  };
}

describe('UMS Build Engine', () => {
  let buildEngine: BuildEngine;

  beforeEach(() => {
    buildEngine = new BuildEngine();
  });

  describe('renderMarkdown', () => {
    it('should render a complete persona with all directive types', () => {
      const persona = createTestPersona({
        version: '1.0.0',
        schemaVersion: '1.0',
        identity: 'You are a test assistant with clear communication.',
        attribution: true,
        moduleGroups: [
          {
            groupName: 'Core Framework',
            modules: ['foundation/test/complete-module'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'foundation/test/complete-module',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'specification',
          meta: {
            name: 'Complete Test Module',
            description: 'A test module with all directives',
            semantic: 'Test module for comprehensive rendering',
          },
          body: {
            goal: 'Define a comprehensive test module with all directive types.',
            principles: [
              'Test modules should be comprehensive',
              'All directives should be properly formatted',
            ],
            constraints: [
              'Must include all directive types',
              'Must render correctly to Markdown',
            ],
            process: [
              'Create the test module structure',
              'Add all directive types',
              'Validate the rendering output',
            ],
            criteria: [
              'All directives are present',
              'Markdown is properly formatted',
              'Output matches specification',
            ],
            data: {
              mediaType: 'application/json',
              value: '{\n  "test": "data",\n  "format": "json"\n}',
            },
            examples: [
              {
                title: 'Basic Example',
                rationale: 'Shows basic usage patterns',
                snippet: 'function test() { return "hello"; }',
                language: 'javascript',
              },
              {
                title: 'Advanced Example',
                rationale: 'Demonstrates advanced concepts',
                snippet: 'const result = await processData(input);',
                language: 'typescript',
              },
            ],
          },
          filePath: '/test/path',
        },
      ];

      // Use public method for testing
      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should include identity
      expect(markdown).toContain('## Identity');
      expect(markdown).toContain(
        'You are a test assistant with clear communication.'
      );

      // Should include group heading
      expect(markdown).toContain('# Core Framework');

      // Should include all directive types in correct order
      expect(markdown).toContain('## Goal');
      expect(markdown).toContain('Define a comprehensive test module');

      expect(markdown).toContain('## Principles');
      expect(markdown).toContain('- Test modules should be comprehensive');

      expect(markdown).toContain('## Constraints');
      expect(markdown).toContain('- Must include all directive types');

      expect(markdown).toContain('## Process');
      expect(markdown).toContain('1. Create the test module structure');
      expect(markdown).toContain('2. Add all directive types');

      expect(markdown).toContain('## Criteria');
      expect(markdown).toContain('- [ ] All directives are present');

      expect(markdown).toContain('## Data');
      expect(markdown).toContain('```json');
      expect(markdown).toContain('"test": "data"');

      expect(markdown).toContain('## Examples');
      expect(markdown).toContain('### Basic Example');
      expect(markdown).toContain('### Advanced Example');
      expect(markdown).toContain('```javascript');
      expect(markdown).toContain('```typescript');

      // Should include attribution
      expect(markdown).toContain(
        '[Attribution: foundation/test/complete-module]'
      );
    });

    it('should render persona without identity', () => {
      const persona = createTestPersona({
        name: 'No Identity Persona',
        description: 'Persona without identity field',
        semantic: 'Test semantic',
        identity: '', // Empty identity
        moduleGroups: [
          {
            groupName: 'Test Group',
            modules: ['foundation/test/simple-module'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'foundation/test/simple-module',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'specification',
          meta: {
            name: 'Simple Module',
            description: 'Simple test module',
            semantic: 'Simple test',
          },
          body: {
            goal: 'Simple goal statement.',
          },
          filePath: '/test/path',
        },
      ];

      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should not include identity section
      expect(markdown).not.toContain('## Identity');

      // Should include goal
      expect(markdown).toContain('## Goal');
      expect(markdown).toContain('Simple goal statement.');
    });

    it('should render persona without attribution', () => {
      const persona = createTestPersona({
        name: 'No Attribution Persona',
        description: 'Persona without attribution',
        semantic: 'Test semantic',
        attribution: false,
        moduleGroups: [
          {
            groupName: 'Test Group',
            modules: ['foundation/test/simple-module'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'foundation/test/simple-module',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'specification',
          meta: {
            name: 'Simple Module',
            description: 'Simple test module',
            semantic: 'Simple test',
          },
          body: {
            goal: 'Simple goal statement.',
          },
          filePath: '/test/path',
        },
      ];

      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should not include attribution
      expect(markdown).not.toContain('[Attribution:');

      // Should include goal
      expect(markdown).toContain('## Goal');
    });

    it('should handle multiple groups with multiple modules', () => {
      const persona = createTestPersona({
        name: 'Multi-Group Persona',
        description: 'Persona with multiple groups',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Group One',
            modules: ['foundation/test/module1', 'foundation/test/module2'],
          },
          {
            groupName: 'Group Two',
            modules: ['principle/test/module3'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'foundation/test/module1',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'specification',
          meta: {
            name: 'Test Module 1',
            description: 'Test module 1',
            semantic: 'Test semantic 1',
          },
          body: { goal: 'Goal one.' },
          filePath: '/test/path1',
        },
        {
          id: 'foundation/test/module2',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'specification',
          meta: {
            name: 'Test Module 2',
            description: 'Test module 2',
            semantic: 'Test semantic 2',
          },
          body: { goal: 'Goal two.' },
          filePath: '/test/path2',
        },
        {
          id: 'principle/test/module3',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'specification',
          meta: {
            name: 'Test Module 3',
            description: 'Test module 3',
            semantic: 'Test semantic 3',
          },
          body: { goal: 'Goal three.' },
          filePath: '/test/path3',
        },
      ];

      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should include both group headings
      expect(markdown).toContain('# Group One');
      expect(markdown).toContain('# Group Two');

      // Should include all module content in order
      expect(markdown).toContain('Goal one.');
      expect(markdown).toContain('Goal two.');
      expect(markdown).toContain('Goal three.');

      // Should have separators between modules but not at the end
      const separatorCount = (markdown.match(/---/g) ?? []).length;
      expect(separatorCount).toBe(2); // Between modules only
    });

    it('should render data directive with inferred language', () => {
      const persona = createTestPersona({
        description: 'Tests data rendering',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Data Group',
            modules: ['foundation/test/data-module'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'foundation/test/data-module',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'data',
          meta: {
            name: 'Data Module',
            description: 'Module with data',
            semantic: 'Test data module',
          },
          body: {
            goal: 'Provide test data.',
            data: {
              mediaType: 'application/json',
              value: '{"key": "value"}',
            },
          },
          filePath: '/test/path',
        },
      ];

      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should render data with json language
      expect(markdown).toContain('## Data');
      expect(markdown).toContain('```json\n{"key": "value"}\n```');
    });

    it('should render examples with language hints', () => {
      const persona = createTestPersona({
        description: 'Tests examples rendering',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Examples Group',
            modules: ['foundation/test/examples-module'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'foundation/test/examples-module',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'specification',
          meta: {
            name: 'Examples Module',
            description: 'Module with examples',
            semantic: 'Test examples module',
          },
          body: {
            goal: 'Demonstrate examples.',
            examples: [
              {
                title: 'Python Example',
                rationale: 'Shows Python code',
                snippet: 'print("hello")',
                language: 'python',
              },
              {
                title: 'Plain Example',
                rationale: 'Shows plain text',
                snippet: 'plain text content',
                // no language specified
              },
            ],
          },
          filePath: '/test/path',
        },
      ];

      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should render examples with proper structure
      expect(markdown).toContain('## Examples');
      expect(markdown).toContain('### Python Example');
      expect(markdown).toContain('Shows Python code');
      expect(markdown).toContain('```python\nprint("hello")\n```');

      expect(markdown).toContain('### Plain Example');
      expect(markdown).toContain('Shows plain text');
      expect(markdown).toContain('```\nplain text content\n```'); // No language specified
    });

    it('should render criteria as task list', () => {
      const persona = createTestPersona({
        description: 'Tests criteria rendering',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Criteria Group',
            modules: ['execution/test/criteria-module'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'execution/test/criteria-module',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'checklist',
          meta: {
            name: 'Criteria Module',
            description: 'Module with criteria',
            semantic: 'Test criteria module',
          },
          body: {
            goal: 'Provide checklist criteria.',
            criteria: [
              'First criterion to check',
              'Second criterion to verify',
              'Third criterion to validate',
            ],
          },
          filePath: '/test/path',
        },
      ];

      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should render criteria as task list
      expect(markdown).toContain('## Criteria');
      expect(markdown).toContain('- [ ] First criterion to check');
      expect(markdown).toContain('- [ ] Second criterion to verify');
      expect(markdown).toContain('- [ ] Third criterion to validate');
    });

    it('should render process as ordered list', () => {
      const persona = createTestPersona({
        description: 'Tests process rendering',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Process Group',
            modules: ['execution/test/process-module'],
          },
        ],
      });

      const modules: UMSModule[] = [
        {
          id: 'execution/test/process-module',
          version: '1.0.0',
          schemaVersion: '1.0',
          shape: 'procedure',
          meta: {
            name: 'Process Module',
            description: 'Module with process',
            semantic: 'Test process module',
          },
          body: {
            goal: 'Provide step-by-step process.',
            process: [
              'First step in the process',
              'Second step to complete',
              'Final step to finish',
            ],
          },
          filePath: '/test/path',
        },
      ];

      const markdown = buildEngine.renderMarkdown(persona, modules);

      // Should render process as ordered list
      expect(markdown).toContain('## Process');
      expect(markdown).toContain('1. First step in the process');
      expect(markdown).toContain('2. Second step to complete');
      expect(markdown).toContain('3. Final step to finish');
    });
  });

  describe('inferLanguageFromMediaType', () => {
    it('should correctly infer languages from media types', () => {
      const engine = new BuildEngine();

      // Test common media type mappings
      expect(engine.inferLanguageFromMediaType('application/json')).toBe(
        'json'
      );
      expect(engine.inferLanguageFromMediaType('application/javascript')).toBe(
        'javascript'
      );
      expect(engine.inferLanguageFromMediaType('text/x-python')).toBe('python');
      expect(engine.inferLanguageFromMediaType('text/x-typescript')).toBe(
        'typescript'
      );
      expect(engine.inferLanguageFromMediaType('text/x-yaml')).toBe('yaml');
      expect(engine.inferLanguageFromMediaType('text/css')).toBe('css');
      expect(engine.inferLanguageFromMediaType('text/html')).toBe('html');

      // Test unknown media type
      expect(engine.inferLanguageFromMediaType('unknown/type')).toBe('');

      // Test case insensitivity
      expect(engine.inferLanguageFromMediaType('APPLICATION/JSON')).toBe(
        'json'
      );
    });
  });
});
