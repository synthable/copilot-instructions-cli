# Example Workflow: Auditing AI-Generated Documentation

### Problem: Documentation "Hallucination"

A common issue when using Large Language Models (LLMs) to generate documentation is that they can "hallucinate" or invent features, properties, or CLI options that don't actually exist in the current version of the code. While these ideas can be valuable for a future roadmap, they make the official documentation inaccurate and misleading for users.

Manually auditing these files is tedious and error-prone.

### Solution: The "Doc Auditor" Persona

We can solve this problem by using the **Instructions Builder CLI** to create a highly specialized AI persona whose only job is to be a meticulous, skeptical documentation auditor. This persona will be given a strict set of rules and a playbook to follow, ensuring it corrects the documentation reliably every time.

This workflow will guide you through creating the persona file and using it to audit a document.

---

### Step 1: Create the "Doc Auditor" Persona

First, we need to define the persona. This file combines foundational reasoning principles with the specific principle of documentation accuracy and the playbook for performing an audit.

Create a new file at `personas/doc-auditor.persona.jsonc` and add the following content:

```jsonc
{
  "output": "doc-audit-instructions.md",
  "foundation": [
    "reasoning/deductive-reasoning",
    "judgment/evaluating-evidence",
  ],
  "principle": ["documentation/1-docs-must-match-code"],
  "execution": ["playbook/audit-documentation/1-verify-and-comment"],
}
```

_Note: This step assumes you have already created the modules referenced above (e.g., `instructions-modules/principle/documentation/1-docs-must-match-code.md`) and have run `copilot-instructions index`._

---

### Step 2: Use the Persona to Audit a File

You are now ready to use your new specialist AI.

#### A. Build the Persona's Instructions

Run the `build` command to create the instruction set for your auditor persona. This reads your new persona file and compiles the content of all the specified modules into a single file.

```bash
copilot-instructions build personas/doc-auditor.persona.jsonc
```

This command will create a new file named `doc-audit-instructions.md` in your project root.

#### B. Prompt Your LLM

Finally, use the generated instructions in a prompt to your preferred LLM. The structure below is highly effective.

1.  **Provide the Instructions:** Paste the entire content of the generated `doc-audit-instructions.md` file.
2.  **Provide the Source of Truth:** Paste the relevant source code or CLI help text that the AI should use for verification.
3.  **Provide the Document to Audit:** Paste the AI-generated documentation that you suspect contains errors.
4.  **Give the Command:** Tell the AI to perform the audit.

**Prompt Template:**

```text
--- START OF INSTRUCTIONS ---
[...paste the entire content of the generated `doc-audit-instructions.md` file here...]
--- END OF INSTRUCTIONS ---

Here is the source code for my CLI tool which should be considered the source of truth:
--- START OF SOURCE CODE ---
[...paste the relevant source code, e.g., the output of `cli --help` or the content of `src/commands/build.ts`...]
--- END OF SOURCE CODE ---

Here is the documentation file that needs to be audited:
--- START OF DOCUMENTATION ---
[...paste the AI-generated documentation that you suspect contains errors...]
--- END OF DOCUMENTATION ---

Please perform the audit according to your instructions and provide the corrected documentation file as your final output.
```

---

### Expected Result

The LLM, constrained by the highly specific persona, will return the corrected documentation. Any features that it could not verify in the source code will be wrapped in HTML comments, ready for you to review and commit.

**Example Corrected Output:**

```markdown
### `build [personaFile]` (Implemented)

Compiles instructions into a final output file.

<!-- FUTURE:
### `publish [personaFile]` (Not Implemented)
Publishes a persona to the online registry. This feature allows you to share your personas with other users.
-->

### `index` (Implemented)

Scans the module directory and creates/updates the index file.
```

This workflow demonstrates how the Instructions Builder CLI can be used to create reliable, specialized AI tools to solve complex and repetitive development tasks.
