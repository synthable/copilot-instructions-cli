---
name: 'Instruction Module Validation'
description: 'A comprehensive checklist to validate that instruction modules conform to official schema requirements, frontmatter standards, and machine-centric language principles.'
tier: execution
schema: checklist
layer: null
---

# Instruction Module Validation

## Objective

To systematically validate that an instruction module strictly adheres to the official schema requirements, frontmatter standards, structural formatting, and content quality principles defined in the module authoring guide.

## Items

### Frontmatter Validation

- [ ] Does the module contain valid YAML frontmatter enclosed by `---`?
- [ ] Is the `name` field present and in Title Case format?
- [ ] Is the `description` field present and concise (under 100 characters)?
- [ ] Is the `tier` field one of: `foundation`, `principle`, `technology`, or `execution`?
- [ ] Is the `schema` field one of: `procedure`, `specification`, `pattern`, `checklist`, or `data`?
- [ ] Is the `layer` field a number 0-4 for foundation modules, or null for all other tiers?
- [ ] Are optional fields (`authors`) properly formatted as arrays if present?

### General Content Validation

- [ ] Does the module represent a single, atomic concept?
- [ ] Is the module well-formed with no placeholder text or incomplete sections?
- [ ] Does the content begin immediately with the first required H2 heading for its schema?
- [ ] Is there no extraneous H1 heading or text before the first H2 section?

### Schema-Specific Structure Validation

#### For `procedure` Schema:

- [ ] Does the module contain exactly these H2 headings: `## Primary Directive`, `## Process`, `## Constraints`?
- [ ] Is the Primary Directive a single, imperative command?
- [ ] Is the Process section an ordered list (`1.`, `2.`, `3.`) of sequential steps?
- [ ] Is the Constraints section an unordered list (`-`) of "do not" rules?

#### For `specification` Schema:

- [ ] Does the module contain exactly these H2 headings: `## Core Concept`, `## Key Rules`, `## Best Practices`, `## Anti-Patterns`?
- [ ] Is the Core Concept a one-sentence summary?
- [ ] Are Key Rules and Anti-Patterns formatted as unordered lists (`-`)?
- [ ] Are Best Practices formatted as unordered lists (`-`)?

#### For `pattern` Schema:

- [ ] Does the module contain exactly these H2 headings: `## Summary`, `## Core Principles`, `## Advantages / Use Cases`, `## Disadvantages / Trade-offs`?
- [ ] Is the Summary a brief, high-level explanation?
- [ ] Are all sections except Summary formatted as unordered lists (`-`)?

#### For `checklist` Schema:

- [ ] Does the module contain exactly these H2 headings: `## Objective`, `## Items`?
- [ ] Is the Objective a concise goal statement?
- [ ] Are Items formatted as task list syntax (`- [ ]`) or unordered list (`-`)?

#### For `data` Schema:

- [ ] Does the module contain exactly one H2 heading: `## Description`?
- [ ] Is the Description followed immediately by a single fenced code block?
- [ ] Does the code block specify the appropriate language (e.g., `json, `yaml)?

### Machine-Centric Language Validation

- [ ] Does the module use imperative language (`MUST`, `WILL`, `SHALL`) instead of suggestive language (`should`, `could`)?
- [ ] Are abstract verbs (`consider`, `think about`, `try to`) replaced with concrete action verbs (`analyze`, `implement`, `validate`)?
- [ ] Are all technical terms and acronyms explicitly defined?
- [ ] Does the module contain specific, measurable criteria instead of vague descriptors (`fast`, `clean`, `better`)?
- [ ] Are code elements properly formatted with backticks (`` `code` ``)?
- [ ] Is conditional logic structured with explicit `if/then` statements?

### Content Quality Validation

- [ ] Is the module atomic, representing exactly one concept?
- [ ] Are all instructions deterministic with only one path of execution?
- [ ] Does the module avoid conversational language and explanatory prose that doesn't specify required actions?
- [ ] Are success criteria verifiable and measurable?
- [ ] Does the module avoid analogies or metaphors in favor of algorithmic specifications?
- [ ] Is the Markdown structure used effectively as an API (headings, lists, formatting)?
