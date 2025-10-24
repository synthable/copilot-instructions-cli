# Writing Module Content: Machine-Centric Language

**Previous**: [Authoring the Module Body: The 7 Directives](./04-authoring-the-body.md)

---

This specification defines the standard for writing all instructional content within the `body` of a `.module.yml` file. The goal is to produce imperative, unambiguous, and machine-interpretable language by treating instructions as configuration code, not as a tutorial. This ensures predictable and consistent AI execution.

> ## Key Takeaways for Authors
>
> - **Use Formal Keywords:** Your most important tools are `MUST`, `SHOULD`, and `MUST NOT`. Use them in uppercase to define the weight of an instruction.
> - **Be Specific & Measurable:** Replace subjective words like "good" or "fast" with concrete, verifiable metrics (e.g., "90% test coverage," "response time under 150ms").
> - **Use the Right Directive:** The AI relies on you to put instructions in the correct block. `process` is for steps, `constraints` is for rules.
> - **Write for a Tool, Not a Colleague:** The AI is a literal-minded tool. It will not infer your intent. You must state everything explicitly.

All instructional content **MUST** be written for a machine, not a human. The language must be direct, explicit, and structured to eliminate ambiguity.

| ✅ Good Example (Machine-Centric)                                                      | ❌ Bad Example (Human-Centric)                                    |
| :------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| `You MUST validate all user-provided input against a strict schema before processing.` | `It's very important to think about validating user input.`       |
| `Do NOT attempt to sanitize or correct invalid input.`                                 | `Try not to change the user's input, as that could be confusing.` |

## The Three Pillars of Machine-Centric Writing 🏛️

Every instruction you write should be evaluated against these three principles.

### 1. Determinism: Ensure One Path of Execution

A deterministic instruction has only one possible, correct interpretation. The AI should not have to guess or choose between multiple valid options. This is achieved by using imperative commands and formally defined keywords.

**Why This Matters:** The AI uses RFC 2119 keywords to calculate the "cost" of violating an instruction. A `MUST` constraint has an infinite cost, while a `SHOULD` has a high but finite cost. Using these keywords correctly is the primary way you control the AI's decision-making process and prevent it from making incorrect assumptions.

#### Formal Keyword Interpretation (RFC 2119)

To convey the precise level of constraint, capitalized requirement keywords **MUST** be used and interpreted according to their formal RFC 2119 definitions.

- **`MUST` / `SHALL`**: An absolute requirement.
- **`MUST NOT` / `SHALL NOT`**: An absolute prohibition.
- **`SHOULD` / `RECOMMENDED`**: A strong recommendation that can only be ignored if the full implications are understood and justified.
- **`SHOULD NOT` / `NOT RECOMMENDED`**: A strong discouragement against a course of action.
- **`MAY` / `OPTIONAL`**: Truly optional.

### 2. Precision: Use Specific and Quantifiable Language

Precision means replacing vague, subjective descriptions with concrete, objective, and measurable parameters. Vague descriptors like `fast`, `clean`, or `better` **MUST NOT** be used.

**Why This Matters:** Vague terms force the AI to guess, and its guesses can change based on context, leading to inconsistent and unreliable behavior. Concrete metrics produce the same result every time, making the AI's actions predictable and testable.

| Vague & Subjective         | Precise & Objective                                                                                                                                     |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "Make it fast"             | "The API response time `MUST` be less than 100ms on the 95th percentile."                                                                               |
| "A lot of tests"           | "The function `MUST` have a minimum of 90% branch test coverage."                                                                                       |
| "Handle errors gracefully" | "On a database connection failure, you `MUST` return a `503 Service Unavailable` error with a JSON body: `{"error": "Database offline"}`."              |
| "A secure password"        | "A password that is a minimum of 16 characters and contains at least one uppercase letter, one number, and one special character from the set `!@#$%`." |

### 3. Structure: Use Directives as an API

The structure of the `body` block is the **Application Programming Interface (API)** for the AI's understanding. Each directive (`purpose`, `process`, `constraints`, etc.) communicates a different type of instruction. Using the correct directive for the correct purpose is essential for the AI to parse the instructions correctly.

**Why This Matters:** The AI is not reading a document; it is parsing structured data from the YAML `body`. The directive (`purpose`, `process`, etc.) tells the AI what _kind_ of information it is receiving. Putting steps in a `constraints` block will confuse the AI and cause it to execute the task incorrectly, just as passing a string to a function that expects an integer would cause a program to crash.

The build tool renders these directives into a predictable Markdown format.

## Common Pitfalls to Avoid

- **Are you being too conversational?** Instructions should be direct commands, not prose. Avoid filler words, apologies, or rhetorical questions.
- **Are you leaving room for interpretation?** Words like "maybe," "perhaps," or "try to" create ambiguity. If an instruction is not mandatory, use the `MAY` or `SHOULD` keywords to define its exact weight.
- **Are you using lowercase "should"?** If you mean `SHOULD`, be sure to write it in uppercase. Lowercase "should" is ambiguous and will be ignored.

## Example Transformation

This example demonstrates the transformation from a vague, suggestive instruction to a precise, deterministic, and structured one.

#### Snippet: Human-Centric (Incorrect)

"You should probably handle errors. It's a good idea to make sure the user gets a helpful message if something goes wrong."

#### Snippet: Machine-Centric (Correct)

```yaml
# In a 'constraints' directive
- |
  Upon a database connection failure, you MUST:
  - Return an HTTP status code of 503 Service Unavailable.
  - The response body MUST be a JSON object with the exact structure: {"error": "Database offline", "retryable": true}.
  - The response body MUST NOT include a stack trace or any other internal system details.
```

---

**Next**: [The Persona Definition File (`persona.yml`)](../06-persona-definition-file.md)
