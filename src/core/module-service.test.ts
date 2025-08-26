import { describe, it, expect, vi, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import {
  scanModules,
  validateFrontmatter,
  validateModuleFile,
  validateModuleContent,
  formatImplementDisplay,
} from './module-service.js';

// Mock dependencies
vi.mock('fs', () => ({
  promises: {
    access: vi.fn(),
    readFile: vi.fn(),
  },
}));

vi.mock('glob', () => ({
  glob: vi.fn(),
}));

vi.mock('gray-matter');

const MODULES_ROOT_DIR = path.resolve(process.cwd(), 'instructions-modules');

describe('validateFrontmatter', () => {
  it('should return valid for correct frontmatter', () => {
    const frontmatter = {
      name: 'Test Module',
      description: 'A module for testing.',
      schema: 'procedure',
    };
    const result = validateFrontmatter(frontmatter, 'principle');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for missing required fields', () => {
    const frontmatter = { name: 'Test Module' };
    const result = validateFrontmatter(frontmatter, 'principle');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required field: description');
    expect(result.errors).toContain('Missing schema in frontmatter');
  });

  it('should return invalid for empty string fields', () => {
    const frontmatter = { name: ' ', description: ' ' };
    const result = validateFrontmatter(frontmatter, 'principle');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Field "name" must be a non-empty string.');
  });

  it('should require order for foundation tier', () => {
    const frontmatter = {
      name: 'Test Module',
      description: 'A module for testing.',
      schema: 'procedure',
    };
    const result = validateFrontmatter(frontmatter, 'foundation');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Missing required field for foundation tier: "order"'
    );
  });

  it('should validate order for foundation tier', () => {
    const frontmatter = {
      name: 'Test Module',
      description: 'A module for testing.',
      schema: 'procedure',
      order: 99,
    };
    const result = validateFrontmatter(frontmatter, 'foundation');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'The "order" field must be an integer between 0 and 5.'
    );
  });

  it('should return invalid for invalid schema', () => {
    const frontmatter = {
      name: 'Test Module',
      description: 'A module for testing.',
      schema: 'invalid-schema',
    };
    const result = validateFrontmatter(frontmatter, 'principle');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid schema: invalid-schema');
  });
});

describe('validateModuleContent', () => {
  it('should return valid for a correct module', () => {
    const fileContent = `---
name: Test
description: Test desc
schema: procedure
---
## Primary Directive
Test
## Process
Test
## Constraints
Test
`;
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test',
        description: 'Test desc',
        schema: 'procedure',
      },
      content: `
## Primary Directive
Test
## Process
Test
## Constraints
Test
`,
    } as any);
    const result = validateModuleContent(fileContent, 'execution');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for missing frontmatter fields', () => {
    const fileContent = `---
name: Test
---
## Primary Directive
Test
`;
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test',
      },
      content: `
## Primary Directive
Test
`,
    } as any);
    const result = validateModuleContent(fileContent, 'execution');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required field: description');
  });

  it('should return invalid for incorrect section order', () => {
    const fileContent = `---
name: Test
description: Test desc
schema: procedure
---
## Process
Test
## Primary Directive
Test
## Constraints
Test
`;
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test',
        description: 'Test desc',
        schema: 'procedure',
      },
      content: `
## Process
Test
## Primary Directive
Test
## Constraints
Test
`,
    } as any);
    const result = validateModuleContent(fileContent, 'execution');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Section "Primary Directive" missing or out of order (expected at position 1)'
    );
  });

  it('should return invalid for extra sections', () => {
    const fileContent = `---
name: Test
description: Test desc
schema: procedure
---
## Primary Directive
Test
## Process
Test
## Constraints
Test
## Extra Section
This should not be here.
`;
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test',
        description: 'Test desc',
        schema: 'procedure',
      },
      content: `
## Primary Directive
Test
## Process
Test
## Constraints
Test
## Extra Section
This should not be here.
`,
    } as any);
    const result = validateModuleContent(fileContent, 'execution');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Extra section(s) found: Extra Section');
  });

  describe('rule schema validation', () => {
    it('should pass validation for a valid rule module', () => {
      const fileContent = `---
name: 'Valid Rule'
description: 'A valid rule module for testing.'
tier: foundation
order: 0
schema: rule
---
## Mandate
You MUST follow this single, atomic rule.`;
      vi.mocked(matter).mockReturnValue({
        data: {
          name: 'Valid Rule',
          description: 'A valid rule module for testing.',
          tier: 'foundation',
          order: 0,
          schema: 'rule',
        },
        content: `
## Mandate
You MUST follow this single, atomic rule.`,
      } as any);
      const result = validateModuleContent(fileContent, 'foundation');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation if a rule module has multiple H2 headings', () => {
      const fileContent = `---
name: 'Invalid Rule - Multiple Headings'
description: 'An invalid rule module for testing.'
tier: foundation
order: 0
schema: rule
---
## Mandate
This is the first heading.

## Another Heading
This is the second, forbidden heading.`;
      vi.mocked(matter).mockReturnValue({
        data: {
          name: 'Invalid Rule - Multiple Headings',
          description: 'An invalid rule module for testing.',
          tier: 'foundation',
          order: 0,
          schema: 'rule',
        },
        content: `
## Mandate
This is the first heading.

## Another Heading
This is the second, forbidden heading.`,
      } as any);
      const result = validateModuleContent(fileContent, 'foundation');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Rule schema modules must have exactly one H2 heading.'
      );
    });

    it('should fail validation if a rule module has an incorrect H2 heading', () => {
      const fileContent = `---
name: 'Invalid Rule - Wrong Heading'
description: 'An invalid rule module for testing.'
tier: foundation
order: 0
schema: rule
---
## Core Concept
This heading is not '## Mandate' and should fail validation.`;
      vi.mocked(matter).mockReturnValue({
        data: {
          name: 'Invalid Rule - Wrong Heading',
          description: 'An invalid rule module for testing.',
          tier: 'foundation',
          order: 0,
          schema: 'rule',
        },
        content: `
## Core Concept
This heading is not '## Mandate' and should fail validation.`,
      } as any);
      const result = validateModuleContent(fileContent, 'foundation');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'The heading in a rule schema module must be ## Mandate.'
      );
    });
  });
});

describe('validateModuleFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return valid for a correct module file', async () => {
    const filePath = path.join(MODULES_ROOT_DIR, 'foundation/logic/test.md');
    const fileContent = `---
name: Test
description: Test desc
schema: procedure
order: 1
---
## Primary Directive
Test
## Process
Test
## Constraints
Test
`;
    vi.mocked(fs.readFile).mockResolvedValue(fileContent);
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test',
        description: 'Test desc',
        schema: 'procedure',
        order: 1,
      },
      content: `
## Primary Directive
Test
## Process
Test
## Constraints
Test
`,
    } as any);

    const result = await validateModuleFile(filePath);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid if file is outside the root directory', async () => {
    const filePath = '/some/other/dir/test.md';
    const result = await validateModuleFile(filePath);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain(
      'Module files must be located within the instructions-modules directory.'
    );
  });

  it('should return invalid for a file with frontmatter errors', async () => {
    const filePath = path.join(MODULES_ROOT_DIR, 'foundation/logic/test.md');
    const fileContent = `---
name: Test
---
`;
    vi.mocked(fs.readFile).mockResolvedValue(fileContent);
    vi.mocked(matter).mockReturnValue({
      data: { name: 'Test' },
      content: '',
    } as any);

    const result = await validateModuleFile(filePath);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Missing required field: description');
  });

  it('should handle file read errors', async () => {
    const filePath = path.join(MODULES_ROOT_DIR, 'foundation/logic/test.md');
    vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));

    const result = await validateModuleFile(filePath);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Failed to read or parse module');
  });
});

describe('scanModules', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if the modules directory does not exist', async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));
    await expect(scanModules()).rejects.toThrow(
      /The 'instructions-modules' directory was not found/
    );
  });

  it('should scan and parse all modules when no IDs are provided', async () => {
    const mockFiles = [
      path.join(MODULES_ROOT_DIR, 'foundation/logic/test1.md'),
      path.join(MODULES_ROOT_DIR, 'principle/quality/test2.md'),
    ];
    const mockModule1Content = `---
name: Test1
description: Desc1
schema: procedure
order: 1
---
Content1`;
    const mockModule2Content = `---
name: Test2
description: Desc2
schema: specification
---
Content2`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue(mockFiles);
    vi.mocked(fs.readFile)
      .mockResolvedValueOnce(mockModule1Content)
      .mockResolvedValueOnce(mockModule2Content);

    vi.mocked(matter)
      .mockReturnValueOnce({
        data: {
          name: 'Test1',
          description: 'Desc1',
          schema: 'procedure',
          order: 1,
        },
        content: 'Content1',
      } as any)
      .mockReturnValueOnce({
        data: { name: 'Test2', description: 'Desc2', schema: 'specification' },
        content: 'Content2',
      } as any);

    const modules = await scanModules();
    expect(modules.size).toBe(2);
    expect(modules.has('foundation/logic/test1')).toBe(true);
    expect(modules.has('principle/quality/test2')).toBe(true);
    const module1 = modules.get('foundation/logic/test1');
    expect(module1?.name).toBe('Test1');
    expect(module1?.order).toBe(1);
  });

  it('should scan and parse only specified modules when IDs are provided', async () => {
    const moduleIds = ['foundation/logic/test1'];
    const mockFile = path.join(MODULES_ROOT_DIR, 'foundation/logic/test1.md');
    const mockModuleContent = `---
name: Test1
description: Desc1
schema: procedure
order: 1
---
Content1`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue(mockModuleContent);
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test1',
        description: 'Desc1',
        schema: 'procedure',
        order: 1,
      },
      content: 'Content1',
    } as any);

    const modules = await scanModules(moduleIds);
    expect(modules.size).toBe(1);
    expect(modules.has('foundation/logic/test1')).toBe(true);
    expect(fs.readFile).toHaveBeenCalledWith(mockFile, 'utf8');
  });

  it('should throw an error if parsing a module file fails', async () => {
    const mockFiles = [path.join(MODULES_ROOT_DIR, 'foundation/logic/bad.md')];
    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue(mockFiles);
    vi.mocked(fs.readFile).mockResolvedValue('---'); // Invalid frontmatter
    vi.mocked(matter).mockReturnValue({ data: {}, content: '' } as any); // Missing fields

    await expect(scanModules()).rejects.toThrow(/Module validation failed/);
  });

  it('should parse the implement field from frontmatter', async () => {
    const mockFiles = [path.join(MODULES_ROOT_DIR, 'execution/test.md')];
    const mockModuleContent = `---
name: Test Implementing Module
description: A module that implement another
schema: procedure
implement: 'principle/spec/target'
---
## Primary Directive
Test

## Process
1. Test step

## Constraints
- Test constraint`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue(mockFiles);
    vi.mocked(fs.readFile).mockResolvedValue(mockModuleContent);
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test Implementing Module',
        description: 'A module that implement another',
        schema: 'procedure',
        implement: 'principle/spec/target',
      },
      content: `
## Primary Directive
Test

## Process
1. Test step

## Constraints
- Test constraint`,
    } as any);

    const modules = await scanModules();
    expect(modules.size).toBe(1);
    const module = modules.get('execution/test');
    expect(module?.implement).toEqual(['principle/spec/target']);
  });

  it('should parse array implement field from frontmatter', async () => {
    const mockFiles = [path.join(MODULES_ROOT_DIR, 'execution/test-array.md')];
    const mockModuleContent = `---
name: Test Multi-Implementing Module
description: A module that implements multiple others
schema: procedure
implement: 
  - 'principle/spec/auth'
  - 'principle/spec/validation'
---
## Primary Directive
Test multiple implementations

## Process
1. Test step

## Constraints
- Test constraint`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue(mockFiles);
    vi.mocked(fs.readFile).mockResolvedValue(mockModuleContent);
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test Multi-Implementing Module',
        description: 'A module that implements multiple others',
        schema: 'procedure',
        implement: ['principle/spec/auth', 'principle/spec/validation'],
      },
      content: `
## Primary Directive
Test multiple implementations

## Process
1. Test step

## Constraints
- Test constraint`,
    } as any);

    const modules = await scanModules();
    expect(modules.size).toBe(1);
    const module = modules.get('execution/test-array');
    expect(module?.implement).toEqual([
      'principle/spec/auth',
      'principle/spec/validation',
    ]);
  });

  it('should ignore invalid implement field types', async () => {
    const mockFiles = [
      path.join(MODULES_ROOT_DIR, 'execution/test-invalid.md'),
    ];
    const mockModuleContent = `---
name: Test Invalid Implement Module
description: A module with invalid implement field
schema: procedure
implement: 123
---
## Primary Directive
Test invalid implement

## Process
1. Test step

## Constraints
- Test constraint`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue(mockFiles);
    vi.mocked(fs.readFile).mockResolvedValue(mockModuleContent);
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test Invalid Implement Module',
        description: 'A module with invalid implement field',
        schema: 'procedure',
        implement: 123, // Invalid type
      },
      content: `
## Primary Directive
Test invalid implement

## Process
1. Test step

## Constraints
- Test constraint`,
    } as any);

    const modules = await scanModules();
    expect(modules.size).toBe(1);
    const module = modules.get('execution/test-invalid');
    expect(module?.implement).toBeUndefined();
  });
});

describe('formatImplementDisplay', () => {
  it('should return "N/A" for undefined implement field', () => {
    expect(formatImplementDisplay(undefined)).toBe('N/A');
  });

  it('should return "N/A" for empty array', () => {
    expect(formatImplementDisplay([])).toBe('N/A');
  });

  it('should return single module ID for array with one item', () => {
    expect(formatImplementDisplay(['principle/spec/auth'])).toBe(
      'principle/spec/auth'
    );
  });

  it('should return comma-separated list for multiple items', () => {
    expect(
      formatImplementDisplay([
        'principle/spec/auth',
        'principle/spec/validation',
      ])
    ).toBe('principle/spec/auth, principle/spec/validation');
  });
});

describe('Synergistic Pair Validation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should validate that implemented modules exist during scan', async () => {
    const mockFiles = [
      path.join(MODULES_ROOT_DIR, 'execution/implementing.md'),
      path.join(MODULES_ROOT_DIR, 'principle/implemented.md'),
    ];

    const implementingContent = `---
name: Implementing Module
description: Implements another module
schema: procedure
implement: 'principle/implemented'
---
## Primary Directive
Test

## Process
1. Test step

## Constraints
- Test constraint`;

    const implementedContent = `---
name: Implemented Module
description: The implemented module
schema: specification
---
## Core Concept
Test spec

## Key Rules
- Test rule`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(glob).mockResolvedValue(mockFiles);
    vi.mocked(fs.readFile)
      .mockResolvedValueOnce(implementingContent)
      .mockResolvedValueOnce(implementedContent);

    vi.mocked(matter)
      .mockReturnValueOnce({
        data: {
          name: 'Implementing Module',
          description: 'Implements another module',
          schema: 'procedure',
          implement: 'principle/implemented',
        },
        content: `
## Primary Directive
Test

## Process
1. Test step

## Constraints
- Test constraint`,
      } as any)
      .mockReturnValueOnce({
        data: {
          name: 'Implemented Module',
          description: 'The implemented module',
          schema: 'specification',
        },
        content: `
## Core Concept
Test spec

## Key Rules
- Test rule`,
      } as any);

    const modules = await scanModules();
    expect(modules.size).toBe(2);

    const implementingModule = modules.get('execution/implementing');
    expect(implementingModule?.implement).toEqual(['principle/implemented']);

    // Verify the implemented module exists
    expect(modules.has('principle/implemented')).toBe(true);
  });
});
