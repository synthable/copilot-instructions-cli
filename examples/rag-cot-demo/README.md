# RAG + CoT Demo (Local, No External Services)

This example demonstrates a tiny Retrieval-Augmented Generation (RAG) flow paired with a Chain-of-Thought style reasoning stub, using a simple TF-IDF retriever implemented in pure JavaScript. No API keys or external dependencies are required.

## What it does

- Tokenizes a small local corpus (`data/corpus.json`)
- Retrieves top-K relevant documents for your query via TF-IDF
- Produces a step-by-step reasoning trace (stubbed) and a final answer that contrasts concepts

## Run

From the repository root:

```bash
node examples/rag-cot-demo/main.js "How do CoT and RAG differ?"
```

You can also omit the argument to use the default sample question.

## Files

- `data/corpus.json` — small knowledge corpus
- `main.js` — retrieval + reasoning script

## Notes

- This example does not call an LLM; the CoT section is a controlled stub to illustrate process without external services.
- For a production setup, replace the stub with an actual model call and plug in a real vector index.
