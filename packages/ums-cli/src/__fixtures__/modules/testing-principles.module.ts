/**
 * Test fixture: Testing Principles module
 * UMS v2.0 compliant module for search/list command testing
 */

import type { Module } from 'ums-lib';
import { CognitiveLevel, ComponentType } from 'ums-lib';

export const testingPrinciples: Module = {
  id: 'principle/quality/testing',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['testing', 'quality-assurance'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
  metadata: {
    name: 'Testing Principles',
    description: 'Quality assurance through systematic testing',
    semantic:
      'Testing quality assurance QA test-driven development TDD unit testing integration testing validation verification',
    tags: ['testing', 'quality', 'tdd'],
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Apply systematic testing principles for quality assurance',
      principles: [
        'Test early and test often',
        'Write tests before implementation',
        'Maintain comprehensive test coverage',
        'Automate testing processes',
      ],
      constraints: [
        {
          rule: 'All public APIs must have unit tests',
          severity: 'error',
        },
        {
          rule: 'Test coverage should exceed 80%',
          severity: 'warning',
        },
      ],
    },
  },
};
