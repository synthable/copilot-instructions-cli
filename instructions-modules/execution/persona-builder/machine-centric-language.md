---
tier: execution
name: 'Machine-Centric Language'
description: 'A style guide for using imperative, unambiguous, and direct language suitable for programming an AI.'
tags:
  - language
  - style guide
  - imperative
  - unambiguous
  - prompt engineering
  - clarity
layer: null
---

# Machine-Centric Language

## Primary Directive

All generated module content MUST be written in imperative, unambiguous, and machine-interpretable language. The module is a configuration file, not a tutorial.

## Process

1.  **Use Modal Verbs of Obligation:** All directives MUST use words like "MUST," "WILL," "SHALL."
    - _Correct:_ "You MUST validate the input."
    - _Incorrect:_ "You should validate the input."
2.  **Use Active Voice:** The AI is the subject performing the action.
    - _Correct:_ "You WILL analyze the data."
    - _Incorrect:_ "The data will be analyzed."
3.  **Be Specific and Quantifiable:** Replace vague terms with precise instructions.
    - _Correct:_ "If cyclomatic complexity is greater than 10, you MUST refactor."
    - _Incorrect:_ "If the code is too complex, you should refactor."
4.  **Define All Terms:** Do not assume the AI will infer the correct meaning of a specialized term within the context of the module.
    - _Correct:_ "Apply the '5 Whys' technique, where you recursively ask 'Why?' to trace a symptom to its root cause."
    - _Incorrect:_ "Do a root cause analysis."

## Constraints

- Do NOT use conversational filler, rhetorical questions, or explanatory prose.
- Do NOT use hedging language (e.g., "maybe," "perhaps," "it seems like").
- Do NOT use analogies or metaphors to explain a concept; instead, define the process algorithmically.
