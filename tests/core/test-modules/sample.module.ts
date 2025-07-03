// Test module for module-loader tests
import type { ModuleSchema } from '../../../src/types/module';
import { ModuleType, Category, MergeStrategy } from '../../../src/types/module';

export const moduleConfig: ModuleSchema = {
  id: 'test-sample',
  name: 'Sample Test Module',
  type: ModuleType.Base,
  version: '1.0.0',
  priority: 1.0,
  metadata: {
    description: 'A sample module for testing purposes',
    author: 'Test Suite',
    category: Category.Testing,
    weight: 1.0,
  },
  instructions: [
    {
      id: 'sample-instruction',
      content: 'This is a sample instruction for testing',
      merge_strategy: MergeStrategy.Replace,
    },
  ],
};

export const value = 123;

export default function (): string {
  return 'hello from mock';
}
