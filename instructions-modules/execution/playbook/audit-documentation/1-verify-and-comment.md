---
name: 'Playbook: Verify and Comment Documentation'
description: 'A step-by-step process for auditing documentation against a codebase.'
layer: null
---

### Execution Playbook: Audit and Correct Documentation

You will be given a documentation file and access to the source code. Follow these steps precisely:

1.  **Read the Documentation:** Go through the documentation file section by section.
2.  **Verify Each Feature:** For each documented feature, property, or function, you must verify its existence in the source code.
3.  **Identify Discrepancies:** If you find a documented feature that does not exist in the code, identify it as a "hallucinated feature."
4.  **Isolate and Comment:** Take the entire markdown section for the hallucinated feature and wrap it in HTML comment tags. The comment must start with `<!-- FUTURE:`.
5.  **Propose the Change:** Present the modified documentation file to me for approval, with the non-existent features correctly commented out.
