---
tier: foundation
name: 'Define Technical Terms in Software Development'
description: 'A specification for identifying and defining technical jargon, acronyms, and ambiguous terms in software development communications.'
layer: 2
schema: specification
---

## Core Concept

Technical communication in software development MUST include explicit definitions for specialized terminology, acronyms, and context-specific terms to ensure precise understanding across diverse technical backgrounds and domain expertise levels.

## Key Rules

- **Technical Jargon Identification:** You MUST identify and define domain-specific terms including architectural patterns, algorithm names, performance metrics, and framework-specific concepts before using them in technical discussions.
- **Acronym Expansion:** You MUST provide the full expansion of technical acronyms upon first use, including API (Application Programming Interface), ORM (Object-Relational Mapping), CRUD (Create, Read, Update, Delete), and domain-specific abbreviations.
- **Context-Dependent Definition:** You MUST clarify terms that have different meanings across software domains, such as "state" (application state vs. component state vs. database state) and "service" (microservice vs. web service vs. system service).
- **Ambiguous Concept Clarification:** You MUST define potentially ambiguous technical concepts like "scalability" (horizontal vs. vertical), "testing" (unit vs. integration vs. end-to-end), and "deployment" (staging vs. production vs. continuous deployment).
- **Consistent Terminology Usage:** You MUST use defined terms consistently throughout technical documentation, code comments, and architectural discussions without introducing synonymous variations that create confusion.
- **Scope-Specific Precision:** You MUST specify the scope and context when defining terms that vary across technology stacks, such as "component" in React vs. Angular vs. Vue, or "container" in Docker vs. dependency injection containers.

## Best Practices

- Define terms immediately upon first use within parentheses or dedicated definition sections.
- Provide concrete examples alongside abstract definitions to illustrate practical application.
- Include relevant technical specifications or standards when defining protocol-related or specification-based terms.
- Distinguish between conceptual definitions and implementation-specific interpretations.
- Reference authoritative sources for standardized terms and industry-accepted definitions.
- Use precise technical language in definitions rather than colloquial or metaphorical explanations.

## Anti-Patterns

- **Assumption of shared knowledge:** Using specialized terms without definition based on assumed expertise level of the audience.
- **Inconsistent terminology:** Switching between equivalent terms (e.g., "function" and "method" and "procedure") without establishing their relationship or context-specific usage.
- **Circular definitions:** Defining technical terms using other undefined technical terms, creating dependency chains that don't resolve to clear meanings.
- **Over-definition:** Defining universally understood programming concepts like "variable," "loop," or "function" when the audience clearly has basic programming knowledge.
- **Context omission:** Defining terms without specifying the technological context, leading to ambiguity across different systems or frameworks.
- **Vendor-specific bias:** Defining general concepts using vendor-specific implementations without acknowledging broader industry standards or alternative approaches.
