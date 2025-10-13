/**
 * Example test module fixture
 */

import type { Module } from 'ums-lib';

export const exampleModule: Module = {
  id: 'example-module',
  name: 'Example Module',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: 'An example module for testing',
  components: [
    {
      type: 'instruction',
      name: 'Example Instruction',
      content: 'This is an example instruction for testing purposes.',
    },
  ],
  capabilities: ['testing', 'example'],
};
