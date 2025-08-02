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

  it('should require layer for foundation tier', () => {
    const frontmatter = {
      name: 'Test Module',
      description: 'A module for testing.',
      schema: 'procedure',
    };
    const result = validateFrontmatter(frontmatter, 'foundation');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Missing required field for foundation tier: "layer"'
    );
  });

  it('should validate layer for foundation tier', () => {
    const frontmatter = {
      name: 'Test Module',
      description: 'A module for testing.',
      schema: 'procedure',
      layer: 99,
    };
    const result = validateFrontmatter(frontmatter, 'foundation');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'The "layer" field must be an integer between 0 and 5.'
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
layer: 0
schema: rule
---
## Mandate
You MUST follow this single, atomic rule.`;
      vi.mocked(matter).mockReturnValue({
        data: {
          name: 'Valid Rule',
          description: 'A valid rule module for testing.',
          tier: 'foundation',
          layer: 0,
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
layer: 0
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
          layer: 0,
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
layer: 0
schema: rule
---
## Core Concept
This heading is not '## Mandate' and should fail validation.`;
      vi.mocked(matter).mockReturnValue({
        data: {
          name: 'Invalid Rule - Wrong Heading',
          description: 'An invalid rule module for testing.',
          tier: 'foundation',
          layer: 0,
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
layer: 1
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
        layer: 1,
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
layer: 1
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
          layer: 1,
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
    expect(module1?.layer).toBe(1);
  });

  it('should scan and parse only specified modules when IDs are provided', async () => {
    const moduleIds = ['foundation/logic/test1'];
    const mockFile = path.join(MODULES_ROOT_DIR, 'foundation/logic/test1.md');
    const mockModuleContent = `---
name: Test1
description: Desc1
schema: procedure
layer: 1
---
Content1`;

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue(mockModuleContent);
    vi.mocked(matter).mockReturnValue({
      data: {
        name: 'Test1',
        description: 'Desc1',
        schema: 'procedure',
        layer: 1,
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
});
