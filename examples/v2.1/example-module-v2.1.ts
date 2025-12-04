import type { Module } from 'ums-sdk';
import { ComponentType, CognitiveLevel } from 'ums-sdk';

/**
 * This module serves as a comprehensive "kitchen sink" example for the UMS v2.1 specification.
 * It is designed to use every valid property to test parsers, renderers, and provide a
 * complete reference for module authors.
 */
export const comprehensiveExample: Module = {
  // --- 1. Top-Level Keys (Required) ---
  id: 'example/comprehensive-kitchen-sink',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: [
    'type-safety',
    'design-patterns',
    'advanced-typescript',
    'maintainability',
    'code-quality',
  ],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,

  // --- 2. Metadata Block (Required, with all optional fields filled) ---
  metadata: {
    name: 'Comprehensive UMS v2.1 Feature Showcase',
    description:
      'A single module demonstrating every valid property and structure in the UMS v2.1 specification for testing and reference purposes.',
    semantic:
      'TypeScript, design patterns, SOLID, dependency injection, repository pattern, factory pattern, type safety, generics, advanced types, UMS v2.1 specification example, kitchen sink, all properties, software architecture, code maintainability, unit testing, decoupling.',
    tags: ['typescript', 'design-patterns', 'example', 'kitchen-sink', 'solid'],
    license: 'Apache-2.0',
    authors: ['AI Assistant <ai@example.com>'],
    homepage: 'https://example.com/ums/specs/v2.1',
    deprecated: true, // Demonstrates a deprecated module
    replacedBy: 'example/next-gen-comprehensive-module', // Required when deprecated is true
  },

  // --- 3. Domain (Optional, using array form) ---
  domain: ['typescript', 'frontend', 'backend', 'language-agnostic'],

  // --- 4. Components Block (Using the `components` array to show all types) ---
  components: [
    // --- 4.1. Instruction Component ---
    {
      type: ComponentType.Instruction,
      purpose:
        'To guide a developer in applying advanced, type-safe design patterns in a TypeScript project.',

      // Demonstrates both string and object forms of ProcessStep
      process: [
        'Define clear interfaces for all public APIs.',
        {
          step: 'Implement the Repository Pattern for data access',
          notes: [
            'Use generics for type-safety: `IRepository<T>`.',
            'Inject repositories as dependencies; do not instantiate them directly in business logic.',
          ],
        },
        'Refactor existing code to use the new patterns.',
      ],

      // Demonstrates both string and object forms of Constraint
      constraints: [
        'MUST use the `strict` flag in `tsconfig.json`.',
        {
          rule: 'SHOULD NOT use the `any` type.',
          notes: [
            'Rationale: Using `any` defeats the purpose of TypeScript and hides potential bugs.',
            'Good: `const data: unknown = ...`',
            'Bad: `const data: any = ...`',
          ],
        },
      ],

      // Demonstrates a simple list of principles
      principles: [
        'Separation of Concerns (SoC)',
        'Single Responsibility Principle (SRP)',
        'Dependency Inversion Principle (DIP)',
      ],

      // Demonstrates all forms of Criterion
      criteria: [
        // Simple string (uncategorized)
        'Code is fully typed with no implicit `any` types.',
        // Object with category
        {
          item: 'Dependency Injection is used for all services.',
          category: 'Architecture',
        },
        // Object with category and notes for detailed verification
        {
          item: 'The Repository Pattern MUST be implemented correctly.',
          category: 'Data Access',
          notes: [
            'Test: Verify that business logic does not contain direct database queries.',
            'Verify: Repositories are injected via constructor.',
            'Expected: `new UserRepository()` should not appear in service classes.',
          ],
        },
        // Another uncategorized item to test rendering order
        'All new code has corresponding unit tests.',
      ],
    },

    // --- 4.2. Knowledge Component ---
    {
      type: ComponentType.Knowledge,
      explanation:
        "This section explains the 'why' behind several key design patterns in TypeScript, focusing on how the type system enhances their implementation.",

      // Demonstrates a fully-featured Concept
      concepts: [
        {
          name: 'Dependency Inversion Principle (DIP)',
          description:
            'High-level modules should not depend on low-level modules. Both should depend on abstractions (e.g., interfaces).',
          rationale:
            'Decouples components, making the system more modular, testable, and maintainable.',
          examples: [
            'Good: `class Service { constructor(logger: ILogger) }`',
            'Bad: `class Service { constructor() { this.logger = new FileLogger() } }`',
          ],
          tradeoffs: [
            'Increases initial complexity with more interfaces and boilerplate.',
            'Vastly improves long-term testability and flexibility.',
          ],
        },
      ],

      // Demonstrates a fully-featured Example
      examples: [
        {
          title: 'Type-Safe Factory Pattern',
          rationale:
            'Demonstrates creating different object types based on input, while preserving type safety using discriminated unions.',
          language: 'typescript',
          snippet: `
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; sideLength: number };

function createShape(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      // (radius is known to be a number)
      return Math.PI * shape.radius ** 2;
    case 'square':
      // (sideLength is known to be a number)
      return shape.sideLength ** 2;
  }
}
          `,
        },
      ],

      // Demonstrates a fully-featured Pattern with a nested Example
      patterns: [
        {
          name: 'Repository Pattern',
          useCase:
            'To abstract the data access layer from the business logic, allowing for easier testing and data source swapping.',
          description:
            'A repository mediates between the domain and data mapping layers, acting like an in-memory collection of domain objects.',
          advantages: [
            'Decouples business logic from data persistence.',
            'Centralizes data access logic.',
            'Simplifies unit testing with mock repositories.',
          ],
          disadvantages: [
            'Can add a layer of abstraction that is unnecessary for very simple applications.',
          ],
          example: {
            title: 'Generic Repository Interface',
            rationale:
              'Defines a generic, type-safe contract for data access operations.',
            language: 'typescript',
            snippet: `
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T | null>;
}
            `,
          },
        },
      ],
    },
  ],
};
