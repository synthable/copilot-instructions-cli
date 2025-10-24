/**
 * Test fixture: Deductive Reasoning module
 * UMS v2.0 compliant module for search/list command testing
 */

import type { Module } from 'ums-lib';
import { CognitiveLevel, ComponentType } from 'ums-lib';

export const deductiveReasoning: Module = {
  id: 'foundation/logic/deductive-reasoning',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['reasoning', 'logic'],
  cognitiveLevel: CognitiveLevel.REASONING_FRAMEWORKS,
  metadata: {
    name: 'Deductive Reasoning',
    description: 'Logical reasoning from premises to conclusions',
    semantic:
      'Deductive reasoning logic premises conclusions syllogism inference validity soundness formal logic',
    tags: ['logic', 'reasoning', 'deduction'],
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Apply deductive reasoning to derive valid conclusions',
      principles: [
        'Reason from general premises to specific conclusions',
        'Ensure validity of argument structure',
        'Verify soundness of premises',
      ],
      process: [
        'Identify the premises',
        'Determine the logical structure',
        'Apply inference rules',
        'Derive the conclusion',
      ],
    },
  },
};
