# AI Prompting Frameworks Catalogue (Expanded)

This expanded version adds concrete prompt templates and runnable examples you can adapt. Templates use placeholder syntax like `{INPUT}` or `{EXAMPLES}` for programmatic insertion.

- [1. Instruction-Following \& Task Framing](#1-instruction-following--task-framing)
  - [Role-Based Prompting](#role-based-prompting)
  - [Instruction Templating](#instruction-templating)
  - [Instruction Chaining / Decomposition](#instruction-chaining--decomposition)
  - [Self-Consistency (Aggregation Controller Pseudocode)](#self-consistency-aggregation-controller-pseudocode)
- [2. Few-Shot \& Demonstration-Based](#2-few-shot--demonstration-based)
  - [Few-Shot Classification Template](#few-shot-classification-template)
  - [Retrieval-Augmented Example Selection (Controller Logic)](#retrieval-augmented-example-selection-controller-logic)
- [3. Reasoning Variants](#3-reasoning-variants)
  - [Chain-of-Thought Prompt](#chain-of-thought-prompt)
  - [Tree-of-Thought (Controller Outline)](#tree-of-thought-controller-outline)
- [4. Retrieval \& Knowledge Integration](#4-retrieval--knowledge-integration)
  - [Simple RAG Prompt](#simple-rag-prompt)
  - [RAG + CoT Hybrid](#rag--cot-hybrid)
- [5. Tool Use \& Interaction](#5-tool-use--interaction)
  - [ReAct Pattern](#react-pattern)
  - [Tool-Call Guardrails](#tool-call-guardrails)
- [6. Optimization \& Robustness](#6-optimization--robustness)
  - [Output Constraints Template](#output-constraints-template)
  - [Automatic Prompt Optimization Loop (Pseudo)](#automatic-prompt-optimization-loop-pseudo)
- [7. Evaluation \& Safety](#7-evaluation--safety)
  - [Self-Evaluation Prompt](#self-evaluation-prompt)
  - [Counterfactual Prompt](#counterfactual-prompt)
- [8. Creativity \& Content Generation](#8-creativity--content-generation)
  - [Iterative Revision Workflow](#iterative-revision-workflow)
  - [Prompted Template Filling](#prompted-template-filling)
- [9. Specialized \& Emerging](#9-specialized--emerging)
  - [Multimodal (Image + Text)](#multimodal-image--text)
  - [Instruction Distillation Template](#instruction-distillation-template)
- [Sample Controller Snippets (Language-Agnostic Pseudocode)](#sample-controller-snippets-language-agnostic-pseudocode)
  - [Majority Vote Self-Consistency](#majority-vote-self-consistency)
  - [Simple TF-IDF Retrieval (JS Outline)](#simple-tf-idf-retrieval-js-outline)
- [Notes](#notes)
- [Next Ideas](#next-ideas)


## 1. Instruction-Following & Task Framing

### Role-Based Prompting
**Template:**
```
You are an expert {ROLE}.
Task: {TASK}
Audience: {AUDIENCE}
Constraints:
- Tone: {TONE}
- Length: {LENGTH}
Output: Provide a clear, concise response.
```
**Example (Historian):**
```
You are an expert historian.
Task: Explain the significance of the Magna Carta.
Audience: High school students
Constraints:
- Tone: Neutral and educational
- Length: ~120 words
Output: Provide a clear, concise response.
```

### Instruction Templating
**Generic Template Skeleton:**
```
[INSTRUCTION SYSTEM BLOCK]
Task: {TASK}
Input:
"""
{INPUT}
"""
Constraints:
- Format: {FORMAT}
- Length: {LENGTH}
- Style: {STYLE}
Steps:
1. Clarify task
2. Transform input
3. Validate constraints
4. Output final result
Return only the final output.
```

### Instruction Chaining / Decomposition
Break complex tasks into sequential prompts.
**Planning Prompt Template:**
```
Task: {TASK}
Goal: Produce a decomposition plan with numbered steps.
Constraints: Steps should be atomic and testable.
Return JSON array of steps.
```
**Execution Step Template:**
```
Context so far:
{ACCUMULATED_CONTEXT}
Current Step: {STEP_DESCRIPTION}
Produce output for this step. If information missing, respond with:
{"status":"needs-info","missing":"<describe>"}
Otherwise:
{"status":"ok","output":"<result>"}
```

### Self-Consistency (Aggregation Controller Pseudocode)
```
for i in range(N):
  chains[i] = llm(prompt_with_cot())
answers = [extract_final_answer(c) for c in chains]
final = majority_vote(answers)
```
**Voting Prompt (Optional Self-Check):**
```
Given candidate answers: {ANSWERS}
Select the most plausible final answer. Explain reasoning briefly then output:
Final: <answer>
```

## 2. Few-Shot & Demonstration-Based

### Few-Shot Classification Template
```
You are a text classifier.
Labels: {LABELS}
Examples:
{EXAMPLES}
Text: {TEXT}
Respond with one label only.
```
**Example:**
```
You are a text classifier.
Labels: Positive | Negative | Neutral
Examples:
Text: "I love this product" -> Positive
Text: "This is the worst" -> Negative
Text: "It works as expected" -> Neutral
Text: "The quality is amazing" ->
```

### Retrieval-Augmented Example Selection (Controller Logic)
```
query_embed = embed(query)
exs = top_k(similarity(query_embed, example_index), k=5)
prompt = build_few_shot_prompt(exs, query)
response = llm(prompt)
```

## 3. Reasoning Variants

### Chain-of-Thought Prompt
```
Solve the problem step-by-step. Show reasoning then final answer on a separate line starting with "Answer:".
Problem: {PROBLEM}
```
**Example:**
```
Solve the problem step-by-step. Show reasoning then final answer on a separate line starting with "Answer:".
Problem: If a train travels 60 km in 1.5 hours, what is its average speed in km/h?
```

### Tree-of-Thought (Controller Outline)
```
root = initial_state(problem)
for depth in range(MAX_DEPTH):
  candidates = expand(root, branching_factor=B)
  scored = [(c, score(c)) for c in candidates]
  root = select_best(scored)
return extract_answer(root)
```

## 4. Retrieval & Knowledge Integration

### Simple RAG Prompt
```
Use ONLY the provided context snippets to answer.
Context:
{SNIPPETS}
Question: {QUESTION}
Instructions: Cite snippet indices used and avoid extraneous knowledge.
Output format:
Answer: <text>
Sources: [i,j]
```

### RAG + CoT Hybrid
```
You are a reasoning assistant.
Context:
{SNIPPETS}
Question: {QUESTION}
Perform:
1. Evidence listing (snippet indices)
2. Step-by-step reasoning referencing evidence
3. Final answer
Return all sections.
```

## 5. Tool Use & Interaction

### ReAct Pattern
```
You are an agent that can reason and act.
Format:
Thought: <your reasoning>
Action: <tool_name>[arguments]
Observation: <result>
... (repeat)
Final: <answer>
Task: {TASK}
Begin.
```

### Tool-Call Guardrails
```
Only call tools when necessary. If no tool is required, output:
Final: <answer>
If tool needed:
Thought: <reason>
Action: {TOOL}[{ARGS}]
```

## 6. Optimization & Robustness

### Output Constraints Template
```
Task: {TASK}
Output MUST be valid JSON matching schema:
{SCHEMA}
If impossible, output:
{"error":"constraint-unsatisfied","reason":"<text>"}
```

### Automatic Prompt Optimization Loop (Pseudo)
```
for generation in range(G):
  variants = mutate(base_prompt)
  scores = [evaluate(v) for v in variants]
  base_prompt = select_best(variants, scores)
return base_prompt
```

## 7. Evaluation & Safety

### Self-Evaluation Prompt
```
Answer the question, then critique your answer.
Question: {QUESTION}
Sections:
1. Draft Answer
2. Critique (list potential errors or uncertainties)
3. Confidence (0-1)
```

### Counterfactual Prompt
```
Original Answer:
{ANSWER}
Generate two plausible alternative answers and list how they differ in assumptions.
```

## 8. Creativity & Content Generation

### Iterative Revision Workflow
Draft Prompt:
```
Write a {GENRE} about {TOPIC} (~{LENGTH} words). Emphasize: {EMPHASIS}.
```
Revision Prompt:
```
Original Draft:
"""
{DRAFT}
"""
Revise to improve: {CRITIQUE_POINTS}. Keep length within ±10%. Output revised draft only.
```

### Prompted Template Filling
```
Story Skeleton:
Characters: {CHARACTERS}
Setting: {SETTING}
Beats:
1. {BEAT1}
2. {BEAT2}
3. {BEAT3}
Fill in vivid scene descriptions for each beat.
```

## 9. Specialized & Emerging

### Multimodal (Image + Text)
```
You are an image analysis assistant.
Image Description: {ALT_TEXT}
Task: {TASK}
Provide:
1. Key visual elements
2. Interpretation
3. Answer
```

### Instruction Distillation Template
```
Long Instruction Set:
{LONG_INSTRUCTIONS}
Distill into <=10 atomic modules. Each module: id, objective, constraints.
Return JSON array.
```

## Sample Controller Snippets (Language-Agnostic Pseudocode)

### Majority Vote Self-Consistency
```
chains = [generate(prompt) for _ in range(5)]
answers = [final(a) for a in chains]
final = mode(answers)
```

### Simple TF-IDF Retrieval (JS Outline)
```
const docs = [...];
const query = '...';
const scores = docs.map(d => tfidfScore(query, d));
const top = selectTop(scores, 3);
```

## Notes
- Adapt placeholders programmatically for repeatable flows.
- Add evaluation harnesses to measure quality (accuracy, latency, cost).
- Consider separating reasoning (hidden) vs final answer (concise) for production.

## Next Ideas
- Add JSON schema for the full catalogue (see accompanying .json file).
- Provide executable examples for RAG + CoT (see `examples/rag-cot-demo`).
