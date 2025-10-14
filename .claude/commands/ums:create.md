# Command: /ums:create

Create a new UMS v2.0 compliant module with interactive guidance.

## Your Task

Guide the user through creating a new UMS v2.0 module by:

1. Gathering requirements through strategic questions
2. Determining the appropriate tier, category, and structure
3. Launching the module-generator agent to create the module
4. Optionally validating the created module
5. Optionally adding to the standard library

## Workflow

### Step 1: Understand Intent

Ask clarifying questions if the user's request is vague:

```markdown
I'll help you create a new UMS v2.0 module. To get started, I need to understand:

1. **Purpose**: What should this module teach or instruct the AI to do?
2. **Tier**: Which tier does this belong to?
   - **Foundation**: Core cognitive frameworks (ethics, reasoning, analysis)
   - **Principle**: Software engineering principles (testing, architecture, security)
   - **Technology**: Language/framework specific (Python, TypeScript, React)
   - **Execution**: Procedures and playbooks (deployment, debugging, monitoring)
3. **Domain**: What domain(s) does it apply to? (e.g., python, language-agnostic, web)
4. **Type**: What components are needed?
   - Instruction (tells AI what to do)
   - Knowledge (teaches concepts)
   - Data (provides reference info)
   - Multiple components

Please provide these details, or tell me the module idea and I'll help determine the structure.
```

### Step 2: Launch Module Generator

Once you have sufficient information, use the Task tool to launch the module-generator agent:

```typescript
Task(
  subagent_type: "module-generator",
  description: "Generate UMS v2.0 module",
  prompt: `Create a new UMS v2.0 module with the following requirements:

Purpose: [user's stated purpose]
Tier: [foundation|principle|technology|execution]
Category: [specific category within tier]
Domain: [domain applicability]
Components: [instruction|knowledge|data|multiple]

[Any additional context or specific requirements]

Please guide the user through module creation with your interactive wizard.`
)
```

### Step 3: Post-Creation Options

After the module is created, offer next steps:

```markdown
✅ Module created successfully!

**Next steps:**

1. **Validate**: Would you like me to validate this module for spec compliance?
2. **Add to Library**: Should I evaluate this for standard library inclusion?
3. **Create Persona**: Would you like to create a persona that uses this module?
4. **Done**: You can also handle these steps later.

What would you like to do next?
```

### Step 4: Follow-up Actions

Based on user's choice:

**If Validate:**

```typescript
Task(
  subagent_type: "module-validator",
  description: "Validate newly created module",
  prompt: "Validate the newly created module at [path]"
)
```

**If Add to Library:**

```typescript
Task(
  subagent_type: "library-curator",
  description: "Evaluate for standard library",
  prompt: "Evaluate the module at [path] for standard library inclusion"
)
```

## Examples

### Example 1: Specific Request

```
User: /ums:create Create a module for async programming in Python

You: I'll create a Python async programming module for you.

Based on your request, I'm setting up:
- **Tier**: Technology (Python-specific)
- **Category**: python
- **Module ID**: technology/python/async-programming
- **Domain**: python
- **Components**: Instruction + Knowledge + Examples

Launching module generator...

[Launch module-generator agent with context]
```

### Example 2: Vague Request

```
User: /ums:create Make a testing module

You: I'll help you create a testing module. To ensure I create the right one, I need a bit more information:

1. **Specific Focus**: What aspect of testing?
   - Test-Driven Development (TDD)
   - Unit testing
   - Integration testing
   - End-to-end testing
   - Test automation

2. **Tier**:
   - **Principle** tier (general testing methodology)
   - **Technology** tier (testing in specific language/framework)
   - **Execution** tier (specific testing procedures)

3. **Domain**: Is this language-agnostic or for a specific technology?

Please clarify, and I'll create the perfect module for your needs.
```

### Example 3: Complete Workflow

```
User: /ums:create error handling module for TypeScript

You: I'll create a TypeScript error handling module.

Configuration:
- Tier: Technology
- Category: typescript
- Module ID: technology/typescript/error-handling
- Domain: typescript
- Components: Instruction + Knowledge + Examples

[Launch module-generator]

[After generation]

You: ✅ Module created at: instruct-modules-v2/modules/technology/typescript/error-handling.module.ts

Next steps:
1. Validate: Check spec compliance?
2. Add to Library: Evaluate for standard library?

User: Validate it

You: Running validation...

[Launch module-validator]

You: ✅ Validation complete!
- Status: PASS
- Quality: 9/10
- All spec requirements met

Would you like to add this to the standard library?

User: Yes

You: Evaluating for standard library inclusion...

[Launch library-curator]

You: ✅ Complete! Module added to standard library.

Summary:
- Module: technology/typescript/error-handling
- Status: Validated and added to library
- Available for use in personas
```

## Tips

1. **Be Proactive**: Suggest reasonable defaults based on the user's description
2. **Clarify When Needed**: Don't guess if the tier or domain is unclear
3. **Offer Workflows**: Suggest the complete workflow (create → validate → add to library)
4. **Provide Context**: Give the module-generator agent all necessary context
5. **Confirm Success**: Always confirm what was created and where

## Error Handling

If module generation fails:

1. Report the specific error
2. Offer to retry with corrections
3. Suggest manual creation if agent approach isn't working

## Agent Dependencies

- **Primary**: module-generator (required for creation)
- **Optional**: module-validator (for post-creation validation)
- **Optional**: library-curator (for library addition)

Remember: Your role is to be the intelligent interface between the user and the module-generator agent, ensuring all necessary information is gathered and the workflow is smooth.
