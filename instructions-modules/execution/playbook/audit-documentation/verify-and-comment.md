---
name: 'Playbook: Verify and Comment Documentation'
description: 'A step-by-step process for auditing documentation against a codebase.'
---

## Primary Directive

Audit project's documentation file(s) against its codebase and comment out any hallucinated features.

## Process

1. **Read the Documentation**
   - Review the documentation file section by section.

2. **Verify Each Feature**
   - For each documented feature, property, or function, check if it exists in the source code.

3. **Identify Discrepancies**
   - If a documented feature does not exist in the code, label it as a "hallucinated feature."

4. **Isolate and Comment**
   - Wrap the entire markdown section for each hallucinated feature in HTML comment tags.
   - The comment must start with `<!-- HALLUCINATION:` and end with `-->`.

5. **Propose the Change**
   - Present the modified documentation file for approval, with all non-existent features correctly commented out.

## Constraints

- You MUST ONLY wrap hallucinated features in `<!-- HALLUCINATION: ... -->` comment blocks.
- You MUST NOT modify or comment out features that exist in the codebase.
- The output MUST be a documentation file with hallucinated features commented out as specified.
layer: null
