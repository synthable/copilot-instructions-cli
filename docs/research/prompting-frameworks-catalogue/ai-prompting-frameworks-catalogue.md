> See also: an expanded version with concrete templates in `docs/research/ai-prompting-frameworks-catalogue-expanded.md` and a structured JSON in `docs/research/ai-prompting-frameworks-catalogue.json` for programmatic use.

## I. Instruction-Following & Task Framing

Beginner Level:
    Simple Instruction Prompting
        Description: Direct natural-language instructions telling the model what to do (e.g., “Write a 200-word summary of this article”). This is the baseline prompting approach used by most applications.
        Strengths: Easy to write; accessible to non-experts; works well for straightforward tasks.
        Weaknesses: Sensitive to wording; can produce incomplete or inconsistent results for complex tasks.
        Example: “Summarize the following paragraph in one sentence.”

    Role-Based Prompting
        Description: Prefixing instructions with a role or persona (e.g., “You are an expert historian”) to guide tone and style.
        Strengths: Improves style and domain-specific behavior; simple to combine with other techniques.
        Weaknesses: Can be superficial—models may adopt persona inconsistently.
        Example: “You are a friendly customer support agent. Answer the question below.”

Intermediate Level:
    Chain-of-Thought (CoT) Prompting (few-shot)
        Description: Demonstrate step-by-step reasoning by providing one or more examples that show internal reasoning steps before the final answer. Encourages models to generate intermediate steps.
        Strengths: Dramatically improves reasoning on many tasks (math, logic, multi-step).
        Weaknesses: Increases verbosity; may expose the model’s internal reasoning which can be unreliable; performance varies with model size.
        Example: Provide worked examples of arithmetic problems showing each step.

    Instruction Templating / Prompt Engineering Patterns
        Description: Building reusable templates with placeholders (e.g., “Task: {task}\nInput: {input}\nConstraints: {constraints}\nAnswer:”).
        Strengths: Reusable, programmatic, easy to integrate into apps; helps with consistency.
        Weaknesses: Template brittleness; requires maintenance and testing across prompt permutations.
        Example: Use a template for summarization that always asks for audience, length, and tone.

Advanced Level:
    Instruction Chaining / Decomposition Prompts
        Description: Break a complex task into sub-tasks executed sequentially via multiple prompts (explicitly or via an orchestrator). Each step’s output is fed to the next prompt.
        Strengths: Improves reliability on complex workflows; modular; easier to debug and test.
        Weaknesses: Requires orchestration logic; accumulated error across steps; higher latency and cost.
        Example: Decompose “research and write a report” into (1) find sources, (2) extract facts, (3) outline, (4) write paragraphs.

    Self-Consistency (with CoT)
        Description: Run multiple CoT generations, then aggregate (majority vote or scoring) final answers to reduce reasoning errors.
        Strengths: Better accuracy on reasoning tasks; reduces hallucination from single-chain variance.
        Weaknesses: Costly; requires aggregation/validation logic.
        Reference: Wang et al., “Self-Consistency Improves Chain of Thought Reasoning” (2022).

## II. Few-Shot & Demonstration-Based Frameworks

Beginner Level:
    Zero-shot & One-shot Prompting
        Description: Provide no examples (zero-shot) or a single example (one-shot) along with the instruction to get the model to generalize.
        Strengths: Low effort; useful when examples are unavailable.
        Weaknesses: Lower performance than few-shot for complex tasks.

Intermediate Level:
    Few-Shot Prompting (Classic)
        Description: Provide several input-output examples in the prompt to demonstrate the mapping you want the model to perform.
        Strengths: Often yields substantial improvements; intuitive.
        Weaknesses: Context window limits number of examples; sensitive to example order and selection.
        Example: 5-10 labeled examples of text classification placed before the query.

    Example Selection / Retrieval-Augmented Example Selection
        Description: Use similarity search (embedding distance) to pick the most relevant few-shot examples from a larger dataset before building the prompt.
        Strengths: Scales examples beyond context window; more relevant examples improve performance.
        Weaknesses: Requires embeddings/indexing infrastructure; retrieval quality matters.
        Tools: semantic search, FAISS, Milvus.

Advanced Level:
    In-Context Learning Optimization (Automated Example Selection)
        Description: Systematically optimize which examples to include via evaluation-driven selection, clustering, or gradient-based methods.
        Strengths: Achieves near fine-tuning performance without weight updates in many tasks.
        Weaknesses: Computational overhead for selection; may overfit to validation distribution.
        Papers/Tools: “Which prompts are signal” style studies; research on example re-ordering.

    Meta-Prompting / Example Synthesis
        Description: Generate synthetic examples via models (or programmatic transformations) to expand the few-shot set, often combined with selection strategies.
        Strengths: Increases diversity and coverage; useful when labeled data is scarce.
        Weaknesses: Risk of introducing bias or noise from synthetically generated examples.

## III. Reasoning & Chain-of-Thought Variants

Beginner Level:
    Stepwise Instruction (explicit steps)
        Description: Ask the model to produce steps explicitly (e.g., “List the steps you would take”).
        Strengths: Simple and often effective for planning or troubleshooting.
        Weaknesses: May produce generic or superficial steps.

Intermediate Level:
    Chain-of-Thought (CoT) prompting (zero/few-shot)
        Description: Encourage or provide examples of step-by-step reasoning inside the prompt.
        Strengths: Improved performance on arithmetic, logic, and reasoning benchmarks.
        Weaknesses: Reliability varies across models and tasks.

    Program-of-Thoughts / Tree-of-Thoughts (conceptual)
        Description: Encourage branching thought processes where multiple reasoning trajectories are considered before selecting an answer.
        Strengths: Theorized to capture diverse solution paths and avoid local minima.
        Weaknesses: Hard to implement purely in prompt; requires orchestration and search strategies.
        Reference: “Tree of Thoughts” (2023) — a search-based approach that uses LLMs to explore thought trees.

Advanced Level:
    Tree of Thoughts (ToT) (implemented)
        Description: Explicitly implements Tree-of-Thoughts search: generate candidate reasoning steps, expand promising branches, and backtrack—often with scoring heuristics and pruning.
        Strengths: Strong improvements on hard reasoning tasks; principled search.
        Weaknesses: Needs external controller, scoring, and many LLM calls (costly and complex).
        Reference: Sun et al., “Tree of Thoughts” (2023).

    Programmatic Reasoning (LLM + External Execution)
        Description: Use LLMs to generate code or symbolic reasoning steps which are executed by a deterministic runtime (e.g., calculators, Python interpreter) then fed back.
        Strengths: Precise computation, deterministic checks, and debuggability.
        Weaknesses: Extra engineering for sandboxing, security; requires prompt-to-code translation robustness.
        Tools/Patterns: ReAct, Toolformer, LLM-to-API patterns.

## IV. Retrieval & Knowledge Integration

Beginner Level:
    Contextual Retrieval (manual)
        Description: Append retrieved context (documents, facts) to the prompt before the instruction.
        Strengths: Reduces hallucination; brings external facts into the model.
        Weaknesses: Increases prompt length; needs retrieval pipeline.

Intermediate Level:
    Retrieval-Augmented Generation (RAG)
        Description: Retrieve relevant passages from a vector store or search index, then condition generation on those passages. Often used with a re-ranker and answer synthesis step.
        Strengths: Scales knowledge beyond model context; supports up-to-date info.
        Weaknesses: Complex pipeline; requires embeddings infrastructure and retrieval tuning.
        Libraries/Tools: Haystack, LlamaIndex (formerly GPT Index), LangChain, OpenSearch/Elastic + FAISS.

    Citation and Attribution Prompts
        Description: Instruct the model to cite retrieved passages or provide sources inline (e.g., “Answer using only the following sources and cite them”).
        Strengths: Better traceability and auditability.
        Weaknesses: Models may still hallucinate citations; requires prompt engineering and verification.

Advanced Level:
    Closed-Loop Retrieval (Retriever-Generator Feedback)
        Description: Iteratively refine retrieval: generator suggests missing info or keywords; retriever fetches improved documents; repeat until confidence threshold.
        Strengths: Focused context and higher factuality.
        Weaknesses: More LLM calls and orchestration complexity.

    Retrieval + Reasoning Hybrid (RAG + CoT)
        Description: Combine retrieval with chain-of-thought reasoning—retrieve evidence, then reason step-by-step using evidence.
        Strengths: Handles complex queries requiring both facts and reasoning.
        Weaknesses: Heavy compute and careful prompt design to avoid mixing unsupported reasoning with evidence.

## V. Tool Use, Action & Interaction Frameworks

Beginner Level:
    Tool-Call Prompts (explicit)
        Description: Prompt the model with clear instructions about when and how to call external tools (e.g., calculators, search APIs), but orchestration is manual.
        Strengths: Simple to adopt; immediate improvements for grounded tasks.
        Weaknesses: Requires external code for tool invocation and result handling.

Intermediate Level:
    ReAct (Reasoning + Acting)
        Description: Interleave reasoning traces with explicit actions (API calls, function calls) in the model’s output. The model emits “Thought: …”, “Action: …”, and “Observation: …” tokens to cooperate with an external controller.
        Strengths: Enables models to plan and act; good for multi-step tasks that use tools.
        Weaknesses: Requires parsing model outputs and reliable action grammar; potential safety concerns if actions include side-effects.
        Reference: Yao et al., “ReAct: Synergizing Reasoning and Acting” (2022).

    Toolformer / Self-supervised Tool-Use
        Description: Train or prompt LLMs to decide when to call tools via self-supervised signals, often fine-tuning with instrumental tokens representing API calls.
        Strengths: Automates tool-use decisions; reduces prompt engineering.
        Weaknesses: Often requires model fine-tuning or specialized prompts and dataset construction.
        Reference: Toolformer (Schick et al., 2023).

Advanced Level:
    Agent Frameworks / Multi-Agent Orchestration
        Description: Full agent systems where multiple LLM agents (or roles) coordinate, call tools, and negotiate responsibilities (planner, researcher, writer, critic).
        Strengths: Models complex workflows; modular and extensible.
        Weaknesses: High engineering complexity; orchestration, state management, and failure modes need careful handling.
        Tools: AutoGPT, BabyAGI, LangChain agents, Microsoft Semantic Kernel.

## VI. Optimization, Calibration & Robustness

Beginner Level:
    Prompt Calibration (temperature, instructions)
        Description: Adjust generation parameters (temperature, top-p) and use explicit constraints (format, length) to make outputs more deterministic.
        Strengths: Low-cost tweaks that improve reliability.
        Weaknesses: Limited ability to fix logical errors; trade-offs between creativity and consistency.

Intermediate Level:
    Prompt Tuning (soft prompts) — Interface-level (no weight updates)
        Description: Use continuous (soft) prompt vectors prepended to inputs, optimized via gradient updates to improve model behavior without changing model weights.
        Strengths: Compact, parameter-efficient; good for domain adaptation.
        Weaknesses: Requires access to model gradients or specialized APIs; less interpretable.

    Prefix Tuning / Adapter Prompts
        Description: Train small prefix layers or adapters that steer model behavior; similar to prompt tuning but usually with lightweight parameter updates.
        Strengths: Efficient fine-tuning alternative.
        Weaknesses: Requires more infra and model access.

Advanced Level:
    Prompt Engineering + Fine-Tuning Hybrid
        Description: Combine prompt design with few-shot or full fine-tuning for best performance: use prompts to guide structure and fine-tune to improve core behaviors.
        Strengths: Best performance for many tasks; control and reliability.
        Weaknesses: Expensive; requires dataset curation and model access for fine-tuning.

    Automatic Prompt Optimization (APO)
        Description: Algorithmic search (evolutionary algorithms, Bayesian optimization, gradient-based) over prompt templates or soft prompts to maximize task metrics.
        Strengths: Finds high-performing prompts automatically.
        Weaknesses: Computationally expensive; risk of overfitting to validation set.

## VII. Evaluation, Safety & Alignment Prompts

Beginner Level:
    Output Constraints and Templates
        Description: Force output formats (JSON schema, bullet lists) via explicit instructions and examples.
        Strengths: Easier parsing and post-processing; reduces malformed outputs.
        Weaknesses: Models may still violate constraints; requires validation.

    Red-Teaming Prompting (manual)
        Description: Use adversarial prompts to probe model failure modes.
        Strengths: Reveals weaknesses and vulnerabilities early.
        Weaknesses: Labor-intensive; needs skilled adversaries.

Intermediate Level:
    Self-Evaluation / Chain-of-Thought Verification
        Description: After generation, ask the model to critique, verify, or rate its own answer (e.g., “Check the above for errors and provide a confidence score”).
        Strengths: Often catches mistakes and reduces hallucinations.
        Weaknesses: Models can be overconfident; may fail to catch subtle errors.

    Contrastive & Counterfactual Prompting
        Description: Ask the model to generate counterfactual answers or compare options to detect hallucinations and inconsistencies.
        Strengths: Improves robustness and exposes contradictions.
        Weaknesses: More compute; requires aggregation logic.

Advanced Level:
    Ensemble & Cross-Checking Prompts
        Description: Use multiple LLMs or multiple prompt styles independently, then cross-check or reconcile outputs via a separate verifier agent.
        Strengths: Higher reliability and reduced single-model bias.
        Weaknesses: Costly; requires reconciliation policies.

    Formal Verification via LLMs + Symbolic Tools
        Description: For outputs requiring correctness (e.g., code or math), combine LLM outputs with symbolic verification tools (type checkers, unit tests, theorem provers).
        Strengths: Strong correctness guarantees when applicable.
        Weaknesses: Limited scope; engineering overhead.

## VIII. Creativity & Content-Generation Frameworks

Beginner Level:
    Style & Tone Prompts
        Description: Provide explicit style guides or examples to shape voice (e.g., “Write like Hemingway”).
        Strengths: Immediate stylistic control.
        Weaknesses: Subjective; may over-constrain creativity.

Intermediate Level:
    Iterative Refinement / Revision Prompts
        Description: Ask the model to produce a draft, then request revisions with specific feedback (e.g., “Make the tone friendlier and shorten paragraphs”).
        Strengths: Structured editing workflows; improves output quality.
        Weaknesses: Multi-pass increases cost and complexity.

    Prompted Template Filling (story skeletons)
        Description: Provide narrative scaffolds (characters, beats) and ask the model to fill in scenes.
        Strengths: Efficient generation with controllable structure.
        Weaknesses: May produce clichés if scaffolding is narrow.

Advanced Level:
    Co-Creation & Collaborative Prompts
        Description: Define roles for model and human (or multiple models) for iterative collaboration, with checkpoints, constraints, and shared memory.
        Strengths: Powerful for creative teams and large projects.
        Weaknesses: Requires process design and tooling.

## IX. Specialized & Emerging Frameworks

Beginner/Intermediate:
    Prompting for Multimodal Models
        Description: Include or reference images, audio, or video with instructions (e.g., “Describe the emotion in this image”). Often uses model-specific APIs for multimodal inputs.
        Strengths: Expands capabilities across modalities.
        Weaknesses: Tooling is still evolving; prompt formats vary by provider.

    Few-Shot Program Synthesis Prompts
        Description: Provide examples of input-output code pairs to get the model to synthesize code for similar tasks.
        Strengths: Fast prototyping of code; can produce working snippets.
        Weaknesses: Risk of insecure code, licensing issues, and subtle bugs.

Advanced/Emerging:
    Latent Space Steering & Activation Engineering
        Description: Manipulate internal activations or steer latent representations (research-level) to produce desired behaviors.
        Strengths: Deep control over model behavior.
        Weaknesses: Highly experimental; requires model internals and specialized research.

    Instruction Distillation & Modular Persona Composition
        Description: Distill large instruction sets into compact modules and compose them programmatically to create personas or capability bundles.
        Strengths: Reusable modules, better maintainability and governance.
        Weaknesses: Requires systematic module design and testing.

    Prompt-as-Policy (for RL/Decision tasks)
        Description: Treat prompts as policies for decision-making agents; optimize prompts using reinforcement learning or policy gradient methods.
        Strengths: Formal framework for optimizing interactive prompts.
        Weaknesses: Complex to implement; requires environment simulation and reward engineering.

## Notes, Sources & Caveats

- Coverage: This list emphasizes widely used and well-documented frameworks as of late 2025 but is not exhaustive; the field evolves rapidly. Some items overlap across categories (e.g., RAG is both retrieval and reasoning).
- References & Reading (selective):
    - “Chain of Thought Prompting Elicits Reasoning in Large Language Models” (Wei et al., 2022)
    - “Tree of Thoughts” (Sun et al., 2023)
    - “ReAct: Synergizing Reasoning and Acting in Language Models” (Yao et al., 2022)
    - “Toolformer” (Schick et al., 2023)
    - RAG and LlamaIndex / LangChain documentation
    - Papers and blog posts on prompt tuning, prefix tuning, and soft prompts
- Best Practices:
    - Start simple (clear instructions + constraints), then iterate with few-shot, CoT, and retrieval as needed.
    - Use templates and automated selection for repeatable prompts.
    - Add verification and evaluation steps (self-check, unit tests, symbolic checks) where correctness matters.
    - Keep prompts small and modular; orchestrate multi-step flows programmatically rather than relying purely on a single monolithic prompt.
- Links: Where possible, consult the original papers above and tool docs (LangChain, LlamaIndex, Haystack, FAISS) for implementation details.

Completion summary
- All planned tasks completed: categories defined, frameworks described with complexity gradings, strengths/weaknesses, examples, and references.
- Limitations: Not exhaustive; recommended follow-ups include adding short concrete prompt templates and curated example libraries for each framework, or converting this catalogue into a searchable markdown or JSON for programmatic use.

If you'd like, I can:
- Expand any category with concrete prompt templates and runnable examples.
- Produce a downloadable markdown/JSON file with this content.
- Create a small test harness (JS/TS or Python) demonstrating RAG + CoT on a sample query.