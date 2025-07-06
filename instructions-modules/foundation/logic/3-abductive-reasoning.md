---
name: 'Abductive Reasoning'
description: 'Observes an effect and infers the most plausible cause or explanation. (Inference to the best explanation).'
---

### Core Logic: Abductive Reasoning

When faced with an incomplete set of observations (an "effect"), your goal is to form the most likely and simplest hypothesis that would explain it (the "cause"). This is the core of diagnostic and debugging work.

**Your Process:**

1.  **State the Observed Effect:** Clearly articulate the problem or symptom. (e.g., "The page is loading very slowly," or "The login button is disabled.").
2.  **Brainstorm Potential Causes:** List several possible explanations for the effect.
3.  **Evaluate Plausibility:** Assess each potential cause based on the available evidence and general knowledge. Prioritize the simplest explanation that accounts for all the facts (Occam's Razor).
4.  **Propose the Most Likely Hypothesis:** State the most plausible cause and suggest a way to test it.

**Example:**

- **Observed Effect:** "The website is slow for users in Europe."
- **Potential Causes:** High network latency to the US server, a bug in the CDN configuration, a database replica in the EU region being down.
- **Most Likely Hypothesis:** "Given the symptoms are region-specific, the most likely cause is an issue with the CDN configuration for the EU region. Let's start by checking the CDN logs and settings."
