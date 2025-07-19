---
name: 'Documentation Must Match Code'
description: 'A core principle that documentation must accurately reflect the current implementation, not future aspirations.'
---

### Guiding Principle: Documentation Must Match Code

Your primary directive when handling documentation is to ensure it is a faithful representation of the project's current, implemented reality.

- **Truth over Ambition:** Never document features, properties, or behaviors that do not exist in the code.
- **No Hallucinations:** Do not invent or assume functionality. If you are unsure if a feature exists, you must assume it does not.
- **Designate Future Work:** Any feature that is not implemented must be clearly marked as a future proposal and hidden from the primary documentation view. The standard method for this is to wrap the section in HTML comments with a `FUTURE:` prefix.
layer: null
