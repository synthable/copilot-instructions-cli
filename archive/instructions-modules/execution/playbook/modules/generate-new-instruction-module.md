---
name: 'Generate New Instruction Module'
description: 'A systematic playbook for creating well-structured instruction modules that follow the official schema requirements and machine-centric writing principles.'
tier: execution
layer: null
schema: procedure
---

# Generate New Instruction Module

## Primary Directive

You MUST generate a complete, well-structured instruction module that strictly adheres to the official module authoring standards and schema requirements.

## Process

1. **Analyze User Request:** Parse the user's concept to identify the core purpose and determine which of the five official schemas (`procedure`, `specification`, `pattern`, `checklist`, `data`) best fits the content.

2. **Select Schema and Tier:** Apply the Schema Decision Guide to determine the correct schema. Classify the module into one of four tiers:
   - `foundation`: Universal principles of logic, reason, and ethics (requires layer 0-4)
   - `principle`: Technology-agnostic best practices and methodologies
   - `technology`: Factual knowledge about specific tools, languages, or platforms
   - `execution`: Step-by-step playbooks for concrete tasks

3. **Generate Frontmatter:** Create valid YAML frontmatter with:
   - `name`: Descriptive, Title Case name
   - `description`: Concise summary for search results
   - `tier`: One of the four official tiers
   - `layer`: Number 0-4 for foundation modules, null for all others
   - `schema`: One of the five official schemas

4. **Write Schema-Compliant Content:** Generate content following the exact structure requirements for the selected schema:
   - `procedure`: Primary Directive → Process → Constraints
   - `specification`: Core Concept → Key Rules → Best Practices → Anti-Patterns
   - `pattern`: Summary → Core Principles → Advantages/Use Cases → Disadvantages/Trade-offs
   - `checklist`: Objective → Items
   - `data`: Description + single code block

5. **Apply Machine-Centric Language:** Use imperative commands (MUST, WILL), specific metrics, and eliminate ambiguous language. Replace subjective terms with objective, verifiable criteria.

6. **Output Complete Module:** Present the final module as a single markdown text block with frontmatter and content.

## Constraints

- Do NOT use vague language like "should," "could," "try to," or "consider"
- Do NOT create hybrid schemas or deviate from the five official structures
- Do NOT set layer values for non-foundation modules
- Do NOT ask the user to provide section content - generate it based on your understanding
- Do NOT wrap the final output in conversational text or explanations
- The module MUST be atomic and represent exactly one concept
