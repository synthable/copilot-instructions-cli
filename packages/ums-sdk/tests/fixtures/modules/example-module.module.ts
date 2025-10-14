/**
 * Example test module fixture - UMS v2.0 compliant
 */

import type { Module } from 'ums-lib';

export const exampleModule: Module = {
  id: 'example-module',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['testing', 'example'],
  metadata: {
    name: 'Example Module',
    description: 'An example module for testing',
    semantic:
      'Example test module fixture providing basic instruction component for SDK unit testing and integration testing',
  },
  instruction: {
    purpose: 'Provide a simple test instruction for SDK validation',
    principles: [
      'This is an example instruction for testing purposes',
      'Keep tests simple and focused',
      'Validate SDK loading and parsing functionality',
    ],
  },
};
