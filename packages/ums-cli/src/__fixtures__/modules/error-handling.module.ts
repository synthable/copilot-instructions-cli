/**
 * Test fixture: Error Handling module
 * UMS v2.0 compliant module without tags (for testing edge case)
 */

import type { Module } from 'ums-lib';
import { CognitiveLevel, ComponentType } from 'ums-lib';

export const errorHandling: Module = {
  id: 'principle/resilience/error-handling',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['error-handling', 'resilience'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
  metadata: {
    name: 'Error Handling',
    description: 'Robust error handling and recovery patterns',
    semantic:
      'Error handling exception management fault tolerance resilience recovery try-catch error propagation',
    // Note: no tags - testing edge case
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Implement robust error handling and recovery',
      principles: [
        'Never swallow errors silently',
        'Log errors with context',
        'Recover gracefully when possible',
        'Use typed error classes',
      ],
      process: [
        'Identify potential error points',
        'Implement try-catch blocks',
        'Log errors appropriately',
        'Handle or propagate errors',
      ],
    },
  },
};
