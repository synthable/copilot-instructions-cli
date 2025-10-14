/**
 * Example test persona fixture
 */

import type { Persona } from 'ums-lib';

export default {
  name: 'Example Persona',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: 'An example persona for testing',
  modules: ['example-module'],
} satisfies Persona;
