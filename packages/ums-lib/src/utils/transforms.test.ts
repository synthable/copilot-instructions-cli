import { describe, it, expect } from 'vitest';
import { moduleIdToExportName } from './transforms.js';

describe('moduleIdToExportName', () => {
  it('should handle single-segment kebab-case IDs', () => {
    expect(moduleIdToExportName('error-handling')).toBe('errorHandling');
  });

  it('should handle multi-segment kebab-case IDs', () => {
    expect(moduleIdToExportName('test-driven-development')).toBe(
      'testDrivenDevelopment'
    );
  });

  it('should handle multi-segment IDs with slashes', () => {
    expect(
      moduleIdToExportName('principle/testing/test-driven-development')
    ).toBe('testDrivenDevelopment');
  });

  it('should handle IDs with single-word segments', () => {
    expect(moduleIdToExportName('foundation/ethics')).toBe('ethics');
  });

  it('should handle IDs with numbers', () => {
    expect(moduleIdToExportName('technology/frameworks/react-v18')).toBe(
      'reactV18'
    );
  });

  it('should handle a single-word ID with no hyphens', () => {
    expect(moduleIdToExportName('testing')).toBe('testing');
  });

  it('should handle a complex multi-slash ID', () => {
    expect(moduleIdToExportName('foundation/ethics/do-no-harm')).toBe(
      'doNoHarm'
    );
  });

  it('should throw error for empty string input', () => {
    expect(() => moduleIdToExportName('')).toThrow('Module ID cannot be empty');
  });

  it('should throw error for whitespace-only input', () => {
    expect(() => moduleIdToExportName('   ')).toThrow(
      'Module ID cannot be empty'
    );
  });

  it('should throw error for malformed ID with trailing slash', () => {
    expect(() => moduleIdToExportName('foundation/')).toThrow(
      'Invalid module ID format'
    );
  });
});
