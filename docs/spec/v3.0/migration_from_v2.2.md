# Migration Guide: UMS v2.2 → v3.0

**Target Audience**: Module authors, tool developers
**Effort Level**: Medium (breaking structural changes)
**Estimated Time**: 15-30 minutes per module

---

## 1. Overview

UMS v3.0 is a **major architectural evolution** that introduces breaking changes to support the "One Source, Two Runtimes" model optimized for both static compilation and dynamic RAG retrieval.

### 1.1. What Changed (Breaking)

🔴 **Breaking Changes**:

- New `Foundation` component type added (4 components total)
- `principles` field moved from Instruction → Foundation
- `patterns` field moved from Knowledge → Foundation
- Component IDs now **recommended** (required for optimal v3.0 features)
- Primitive compilation now **mandatory** (optional in v2.2)
- Layered Cake assembly now **default** (new in v3.0)

✅ **Added**:

- Foundation component with `principles` and `patterns`
- 8 atomic primitive types (Principle, Pattern, Procedure, Policy, Evaluation, Concept, Demonstration, Reference)
- URI addressing scheme (mandatory)
- Layered Cake assembler
- Dual runtime support (CLI static + MCP dynamic)

### 1.2. Migration Strategy

**Recommended**: Use automated codemod tool

- Automatic migration of 90% of changes
- Manual review of extracted Foundation components
- Test with both CLI and MCP runtimes

---

## 2. Automated Migration

### 2.1. Using the Codemod Tool

The fastest way to migrate is using the provided codemod:

```bash
# Install codemod
npm install -g ums-codemod

# Dry run (preview changes)
ums-codemod migrate --from 2.2 --to 3.0 --dry-run ./modules/**/*.module.ts

# Apply migration
ums-codemod migrate --from 2.2 --to 3.0 ./modules/**/*.module.ts

# Validate migrated modules
ums validate ./modules/**/*.module.ts
```

### 2.2. What the Codemod Does

✅ **Automatic**:

1. Updates `schemaVersion` from `"2.2"` to `"3.0"`
2. Bumps module `version` (major version increment)
3. Extracts `principles` from Instruction → new Foundation component
4. Extracts `patterns` from Knowledge → new Foundation component
5. Generates component IDs if missing
6. Validates module structure

⚠️ **Manual Review Needed**:

- Component ID naming (codemod uses defaults)
- Foundation component organization (if multiple components have principles/patterns)
- Custom component logic

---

## 3. Manual Migration

If you prefer manual migration or need custom control:

### Step 1: Update Schema Version and Module Version

Change `schemaVersion` and bump `version`:

```typescript
// v2.2
export const myModule: Module = {
  id: "my-module",
  version: "1.5.0",
  schemaVersion: "2.2",
  // ...
};

// v3.0
export const myModule: Module = {
  id: "my-module",
  version: "2.0.0", // ← Major version bump
  schemaVersion: "3.0", // ← Updated
  // ...
};
```

### Step 2: Extract Foundation Component

Create a new `Foundation` component and move `principles` and `patterns`:

```typescript
// v2.2 (before)
instruction: {
  id: 'implementation',
  purpose: 'Build and deploy application',
  principles: [
    'Follow SOLID principles',
    'Use Test-Driven Development'
  ],
  process: [...],
  constraints: [...]
},

knowledge: {
  id: 'education',
  explanation: 'Core architectural concepts',
  patterns: [
    {
      name: 'Repository Pattern',
      useCase: 'Abstract data access',
      description: '...'
    }
  ],
  concepts: [...],
  examples: [...]
}

// v3.0 (after)
foundation: {
  id: 'architectural-baseline',  // ← New component
  principles: [
    'Follow SOLID principles',
    'Use Test-Driven Development'
  ],
  patterns: [
    {
      name: 'Repository Pattern',
      useCase: 'Abstract data access',
      description: '...'
    }
  ]
},

instruction: {
  id: 'implementation',
  purpose: 'Build and deploy application',
  // principles removed
  process: [...],
  constraints: [...]
},

knowledge: {
  id: 'education',
  explanation: 'Core architectural concepts',
  // patterns removed
  concepts: [...],
  examples: [...]
}
```

### Step 3: Add Component IDs

Ensure all components have meaningful `id` fields:

```typescript
// v2.2 (IDs optional)
instruction: {
  purpose: '...',
  process: [...]
}

// v3.0 (IDs recommended)
instruction: {
  id: 'deployment-process',  // ← Add descriptive ID
  purpose: '...',
  process: [...]
}
```

**ID Naming Guidelines**:

- Use `kebab-case`
- Be specific and descriptive
- Reflect component purpose
- Examples:
  - `security-baseline`, `core-principles`, `best-practices`
  - `setup-procedure`, `deployment-process`, `testing-workflow`
  - `theory`, `advanced-examples`, `common-patterns`

### Step 4: Update Imports

Import new types if using TypeScript:

```typescript
// v2.2
import { Module, ComponentType, CognitiveLevel } from "ums-lib";

// v3.0 (add FoundationComponent if using types)
import {
  Module,
  ComponentType,
  CognitiveLevel,
  FoundationComponent, // ← New
} from "ums-lib";
```

---

## 4. Complete Migration Example

### Before (v2.2)

```typescript
// auth.module.ts (v2.2)
import { Module, CognitiveLevel } from "ums-lib";

export const auth: Module = {
  id: "auth",
  version: "1.2.0",
  schemaVersion: "2.2",
  capabilities: ["authentication", "security"],
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,

  metadata: {
    name: "Authentication Module",
    description: "Secure authentication and authorization",
    semantic: "Authentication, authorization, OAuth, JWT, security",
  },

  instruction: {
    id: "implementation",
    tags: ["production", "critical"],
    purpose: "Implement secure authentication",
    principles: [
      "Use established security standards (OAuth 2.0, OpenID Connect)",
      "Never store passwords in plain text",
    ],
    process: [
      "Configure OAuth provider",
      "Implement JWT token validation",
      "Set up session management",
    ],
    constraints: [
      "MUST use HTTPS for all auth endpoints",
      "MUST implement rate limiting",
      "MUST hash passwords with bcrypt",
    ],
    criteria: [
      "All authentication endpoints use HTTPS",
      "Rate limiting prevents brute force attacks",
      "Session tokens expire after inactivity",
    ],
  },

  knowledge: {
    id: "security-concepts",
    tags: ["advanced"],
    explanation: "Modern authentication uses token-based systems...",
    patterns: [
      {
        name: "JWT Authentication",
        useCase: "Stateless authentication for APIs",
        description: "Use JSON Web Tokens for bearer authentication",
      },
    ],
    concepts: [
      {
        name: "OAuth 2.0",
        description: "Delegation framework for authorization",
        rationale: "Industry standard for third-party authentication",
      },
    ],
    examples: [
      {
        title: "JWT Verification",
        language: "typescript",
        rationale: "Shows proper token validation",
        snippet: `
          const payload = jwt.verify(token, publicKey);
          if (payload.exp < Date.now() / 1000) {
            throw new Error('Token expired');
          }
        `,
      },
    ],
  },
};
```

### After (v3.0)

```typescript
// auth.module.ts (v3.0)
import { Module, CognitiveLevel } from "ums-lib";

export const auth: Module = {
  id: "auth",
  version: "2.0.0", // ← Major version bump
  schemaVersion: "3.0", // ← Updated
  capabilities: ["authentication", "security"],
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,

  metadata: {
    name: "Authentication Module",
    description: "Secure authentication and authorization",
    semantic: "Authentication, authorization, OAuth, JWT, security",
  },

  // NEW: Foundation component
  foundation: {
    id: "security-baseline", // ← New component ID
    tags: ["security", "standards"],
    principles: [
      "Use established security standards (OAuth 2.0, OpenID Connect)",
      "Never store passwords in plain text",
    ],
    patterns: [
      {
        name: "JWT Authentication",
        useCase: "Stateless authentication for APIs",
        description: "Use JSON Web Tokens for bearer authentication",
      },
    ],
  },

  instruction: {
    id: "implementation",
    tags: ["production", "critical"],
    purpose: "Implement secure authentication",
    // principles removed (moved to foundation)
    process: [
      "Configure OAuth provider",
      "Implement JWT token validation",
      "Set up session management",
    ],
    constraints: [
      "MUST use HTTPS for all auth endpoints",
      "MUST implement rate limiting",
      "MUST hash passwords with bcrypt",
    ],
    criteria: [
      "All authentication endpoints use HTTPS",
      "Rate limiting prevents brute force attacks",
      "Session tokens expire after inactivity",
    ],
  },

  knowledge: {
    id: "security-concepts",
    tags: ["advanced"],
    explanation: "Modern authentication uses token-based systems...",
    // patterns removed (moved to foundation)
    concepts: [
      {
        name: "OAuth 2.0",
        description: "Delegation framework for authorization",
        rationale: "Industry standard for third-party authentication",
      },
    ],
    examples: [
      {
        title: "JWT Verification",
        language: "typescript",
        rationale: "Shows proper token validation",
        snippet: `
          const payload = jwt.verify(token, publicKey);
          if (payload.exp < Date.now() / 1000) {
            throw new Error('Token expired');
          }
        `,
      },
    ],
  },
};
```

---

## 5. Edge Cases and Special Scenarios

### 5.1. Module with No Principles or Patterns

If your module has neither `principles` nor `patterns`, you don't need a Foundation component:

```typescript
// v2.2 and v3.0 (no changes needed except schemaVersion)
export const simpleModule: Module = {
  id: 'simple',
  version: '2.0.0',
  schemaVersion: '3.0',
  // ... metadata ...

  instruction: {
    id: 'tasks',
    purpose: '...',
    process: [...],
  },
};
```

### 5.2. Multiple Components with Principles/Patterns

If you use the `components` array with multiple Instruction or Knowledge components:

```typescript
// v2.2
components: [
  {
    type: ComponentType.Instruction,
    id: 'basic-setup',
    principles: ['Keep it simple'],
    process: [...]
  },
  {
    type: ComponentType.Instruction,
    id: 'advanced-setup',
    principles: ['Optimize for performance'],
    process: [...]
  }
]

// v3.0 (combine into single Foundation)
foundation: {
  id: 'design-principles',
  principles: [
    'Keep it simple',  // From basic-setup
    'Optimize for performance',  // From advanced-setup
  ]
},
components: [
  {
    type: ComponentType.Instruction,
    id: 'basic-setup',
    // principles removed
    process: [...]
  },
  {
    type: ComponentType.Instruction,
    id: 'advanced-setup',
    // principles removed
    process: [...]
  }
]
```

### 5.3. Modules with Data Components

Data components are no longer supported in v3.0. Convert reference data to demonstrations:

```typescript
// v2.2 (Data component)
data: {
  id: 'config',
  format: 'json',
  description: 'Database configuration',
  value: {
    host: 'localhost',
    port: 5432,
    maxConnections: 20
  }
}

// v3.0 (Convert to Demonstration in Knowledge)
knowledge: {
  id: 'setup-examples',
  explanation: 'Configuration examples for database setup',
  examples: [
    {
      title: 'Production Database Configuration',
      rationale: 'Shows recommended production settings',
      language: 'json',
      snippet: `{
  "host": "db.production.example.com",
  "port": 5432,
  "maxConnections": 20,
  "ssl": true,
  "pooling": {
    "min": 2,
    "max": 10
  }
}`
    }
  ]
}
```

**Rationale for Removal**:

- Data component had no clear Cognitive Level
- Raw JSON/YAML creates noise in vector embeddings
- No clear zone in Layered Cake assembler
- `unknown` type created TypeScript safety issues

**Alternative Approaches**:

1. **Use Demonstration**: Present data with context and explanation (recommended)
2. **Use Concept**: Define data structure conceptually
3. **External Reference**: Keep data in separate config files, reference by name in documentation

### 5.4. Principles in Knowledge Component

Some v2.2 modules may have incorrectly placed `principles` in Knowledge:

```typescript
// v2.2 (incorrect but worked)
knowledge: {
  explanation: '...',
  principles: ['Follow REST conventions'],  // ← Should be in Instruction
  concepts: [...]
}

// v3.0 (correct placement)
foundation: {
  id: 'api-philosophy',
  principles: ['Follow REST conventions'],  // ← Moved to Foundation
},
knowledge: {
  id: 'api-concepts',
  explanation: '...',
  // principles removed
  concepts: [...]
}
```

---

## 6. Testing Your Migration

### 6.1. Validation

```bash
# Validate schema compliance
ums validate ./modules/**/*.module.ts

# Check for v3.0 specific rules
ums validate --strict --version 3.0 ./modules/**/*.module.ts
```

### 6.2. Build Test

```bash
# Build a test persona
ums build --persona ./personas/test.persona.ts --output ./dist/test.md

# Verify Layered Cake assembly
ums build --persona ./personas/test.persona.ts --verbose
```

### 6.3. MCP Server Test

```bash
# Start MCP server
ums mcp start --transport stdio

# Test primitive resolution
ums mcp test-uri "ums://auth#security-baseline/principle"
```

### 6.4. Visual Inspection

Open the built Markdown file and verify zone ordering:

```markdown
## System Constraints ← Zone 0 (Policies)

## Guiding Principles ← Zone 0 (Principles)

---

## Architectural Patterns ← Zone 1 (Patterns)

## Key Concepts ← Zone 1 (Concepts)

---

## Execution Steps ← Zone 2 (Procedures)

## Success Criteria ← Zone 2 (Evaluations)

---

## Examples ← Zone 3 (Demonstrations)
```

---

## 7. Common Issues and Solutions

### Issue 1: "Foundation component required for modules with principles"

**Cause**: Module has `principles` in Instruction but no Foundation component

**Solution**: Create Foundation component and move principles:

```typescript
foundation: {
  id: 'core-principles',
  principles: [...]  // Move from instruction.principles
}
```

### Issue 2: "Component ID missing or invalid"

**Cause**: Component has no `id` field or uses invalid format

**Solution**: Add valid `id` in `kebab-case`:

```typescript
foundation: {
  id: 'architectural-baseline',  // Valid
  // NOT: 'Architectural Baseline' or 'architectural_baseline'
}
```

### Issue 3: "Data component not supported in v3.0"

**Cause**: Module still has Data component

**Solution**: Convert Data to Knowledge examples:

```typescript
// Remove Data component
// data: { ... }

// Add to Knowledge as Demonstration
knowledge: {
  examples: [
    {
      title: "Configuration Example",
      rationale: "Shows recommended settings",
      language: "json",
      snippet: `...`, // Your data here
    },
  ];
}
```

### Issue 4: "Primitive compilation failed"

**Cause**: Component structure doesn't match v3.0 requirements

**Solution**: Verify component fields match v3.0 spec:

- Foundation: `principles`, `patterns`
- Instruction: `purpose`, `process`, `constraints`, `criteria`
- Knowledge: `explanation`, `concepts`, `examples`

### Issue 5: "URI generation failed"

**Cause**: Duplicate component IDs within module

**Solution**: Ensure each component has a unique `id`:

```typescript
// ❌ Bad (duplicate IDs)
foundation: { id: 'core' },
instruction: { id: 'core' }  // Duplicate!

// ✅ Good (unique IDs)
foundation: { id: 'core-principles' },
instruction: { id: 'core-procedures' }
```

---

## 8. Rollback Instructions

If you need to roll back to v2.2:

```bash
# Use codemod to roll back
ums-codemod migrate --from 3.0 --to 2.2 ./modules/**/*.module.ts

# Or manually:
# 1. Change schemaVersion to "2.2"
# 2. Move principles from Foundation → Instruction
# 3. Move patterns from Foundation → Knowledge
# 4. Remove Foundation component
# 5. Restore version to pre-migration value
```

---

## 9. Persona Migration

Personas themselves don't require changes, but you may want to leverage v3.0 features:

```typescript
// v2.2 persona (works in v3.0)
export default {
  id: "backend-engineer",
  schemaVersion: "2.2",
  modules: ["auth", "database"],
} satisfies Persona;

// v3.0 persona (with URI addressing)
export default {
  id: "backend-engineer",
  schemaVersion: "3.0",
  modules: [
    "auth", // Entire module
    "ums://database#setup", // Just setup component
    "ums://api#design/principle", // Just design principles
  ],
} satisfies Persona;
```

---

## 10. Post-Migration Checklist

- [ ] All modules have `schemaVersion: "3.0"`
- [ ] Module versions bumped appropriately
- [ ] Foundation components created where needed
- [ ] All `principles` moved to Foundation
- [ ] All `patterns` moved to Foundation
- [ ] All Data components removed/migrated to Knowledge.examples
- [ ] All components have valid `id` fields
- [ ] Validation passes: `ums validate`
- [ ] Test persona builds successfully
- [ ] MCP server can resolve URIs
- [ ] Layered Cake assembly produces expected output (7 primitive types, no Reference)
- [ ] Documentation updated

---

## 11. Resources

- [UMS v3.0 Specification](./unified_module_system_v3.0_spec.md)
- [Layered Cake Assembler Specification](./layered_cake_assembler.md)
- [URI Scheme Specification](./uri_scheme.md)
- [Automated Migration Tool](https://github.com/ums/codemod)

---

## 12. FAQ

**Q: Can I mix v2.2 and v3.0 modules in a persona?**
A: No, personas must use modules of the same major version. Migrate all modules to v3.0 together.

**Q: Will my v2.2 personas break?**
A: Personas themselves are compatible, but they'll use the older compilation pipeline until modules are migrated.

**Q: Do I have to use the Foundation component?**
A: Only if your module has principles or patterns. Otherwise, it's optional.

**Q: Can I have multiple Foundation components?**
A: Yes, using the `components` array. However, one Foundation component is recommended for clarity.

**Q: What should I do with my Data components?**
A: Convert them to Knowledge.examples (Demonstrations) with context. Present data as examples with explanations rather than raw dumps.

**Q: Can I still include JSON/YAML in my modules?**
A: Yes, but present it as a Demonstration in Knowledge.examples with context about what it shows and why it matters.

**Q: What if I don't want to use the Layered Cake assembler?**
A: Layered Cake is the default in v3.0, but you can configure the build tool to use linear assembly:

```bash
ums build --assembler linear
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-01-24
**Status**: Final
