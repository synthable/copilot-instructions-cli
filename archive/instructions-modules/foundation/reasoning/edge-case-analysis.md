---
name: 'Edge Case Analysis'
description: 'A systematic process for identifying and generating test cases for boundary conditions and non-standard inputs.'
tier: foundation
layer: 1
schema: procedure
---

## Primary Directive

For any function under test, you MUST perform an edge case analysis to identify and generate test cases that cover its behavioral boundaries.

## Process

1.  **Identify Inputs:** List all input parameters for the function and their expected data types (e.g., `number`, `string`, `array`).
2.  **Analyze Numeric Inputs:** For each `number` input, generate test cases for:
    - Zero (`0`)
    - A negative number (`-1`)
    - A very large number (`Number.MAX_SAFE_INTEGER`)
    - A floating-point number (if applicable).
3.  **Analyze String Inputs:** For each `string` input, generate test cases for:
    - An empty string (`""`)
    - A string containing only whitespace (`" "`)
    - A string with special characters (`!@#$%^&*()`)
    - A very long string.
4.  **Analyze Array Inputs:** For each `array` input, generate test cases for:
    - An empty array (`[]`)
    - An array with one item.
    - An array with duplicate items.
5.  **Analyze Nullability:** For each object-like input (including arrays), generate test cases for `null` and `undefined` to verify null-safety.
6.  **Synthesize Test Cases:** Create a list of distinct test case descriptions based on the analysis (e.g., "it should handle an empty array gracefully," "it should correctly process negative numbers").

## Constraints

- Do NOT limit testing to only "happy path" or typical inputs.
- You MUST consider the combination of edge cases if inputs are interdependent.
