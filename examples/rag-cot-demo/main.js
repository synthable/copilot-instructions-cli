#!/usr/bin/env node
/**
 * RAG + CoT Demo (Local, No External Services)
 * --------------------------------------------
 * Demonstrates a minimal retrieval-augmented generation plus chain-of-thought style
 * reasoning pipeline using a tiny TF-IDF implementation and a stub LLM reasoning function.
 *
 * This is intentionally lightweight and deterministic for instructional purposes.
 */

import fs from 'node:fs';
import path from 'node:path';

// --- Config ---
const CORPUS_PATH = path.resolve(
  process.cwd(),
  'examples/rag-cot-demo/data/corpus.json'
);
const TOP_K = 3;
const QUESTION =
  process.argv.slice(2).join(' ') || 'How do CoT and RAG differ?';

// --- Helpers ---
function tokenize(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) || [];
}

function buildInvertedIndex(docs) {
  const index = new Map(); // term -> Set(docId)
  for (const doc of docs) {
    const seen = new Set();
    for (const token of tokenize(doc.text)) {
      if (seen.has(token)) continue; // simple unique terms per doc for df
      seen.add(token);
      if (!index.has(token)) index.set(token, new Set());
      index.get(token).add(doc.id);
    }
  }
  return index;
}

function tfidfScore(queryTokens, doc, corpus, invIndex) {
  const docTokens = tokenize(doc.text);
  const tfCounts = docTokens.reduce(
    (acc, t) => ((acc[t] = (acc[t] || 0) + 1), acc),
    {}
  );
  let score = 0;
  for (const qt of queryTokens) {
    const tf = tfCounts[qt] || 0;
    const df = invIndex.get(qt)?.size || 0;
    if (tf === 0 || df === 0) continue;
    const idf = Math.log((corpus.length + 1) / (df + 0.5));
    score += (tf / docTokens.length) * idf;
  }
  return score;
}

function retrieve(query, corpus, invIndex, k) {
  const qTokens = tokenize(query);
  const scored = corpus.map(doc => ({
    doc,
    score: tfidfScore(qTokens, doc, corpus, invIndex),
  }));
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter(s => s.score > 0);
}

// Stub LLM reasoning: mimic CoT by citing evidence then summarizing.
function chainOfThoughtAnswer(question, retrieved) {
  const evidenceSummary = retrieved
    .map(r => `[#${r.doc.id}] ${r.doc.title}`)
    .join('\n');
  const rankedIds = retrieved.map(r => r.doc.id);
  let compareTarget = 'RAG';
  for (const id of rankedIds) {
    if (id === 'react') {
      compareTarget = 'ReAct';
      break;
    }
    if (id === 'rag') {
      compareTarget = 'RAG';
      break;
    }
    if (id === 'tot') {
      compareTarget = 'ToT';
      break;
    }
  }

  const thoughts = [
    `I have ${retrieved.length} relevant snippets.`,
    'I will align the question terms with retrieved concepts.',
    'CoT focuses on explicit reasoning steps.',
    `${compareTarget} addresses a different capability (either tool use, retrieval, or search over thoughts).`,
    'I will contrast their purposes and typical usage.',
  ];

  let finalAnswer;
  if (compareTarget === 'ReAct') {
    finalAnswer = `Chain-of-Thought (CoT) guides the model to lay out intermediate reasoning steps before the final answer. ReAct interleaves reasoning with actions: the model decides on a tool call (Action), observes results, and continues reasoning. Use CoT to structure thinking; use ReAct when external tools or APIs are needed to gather facts or compute results.`;
  } else if (compareTarget === 'RAG') {
    finalAnswer = `Chain-of-Thought (CoT) exposes intermediate reasoning steps to improve multi-step problem solving. Retrieval-Augmented Generation (RAG) augments the prompt with externally retrieved passages to ground facts. Combined, RAG supplies evidence while CoT structures reasoning.`;
  } else if (compareTarget === 'ToT') {
    finalAnswer = `Chain-of-Thought (CoT) is a single reasoning trajectory laid out step-by-step. Tree of Thoughts (ToT) explores multiple candidate reasoning branches with scoring and backtracking. CoT is simpler and faster; ToT can solve harder problems at higher computational cost.`;
  } else {
    finalAnswer = `Chain-of-Thought (CoT) structures reasoning step-by-step. Depending on the task, pair CoT with retrieval (RAG), tool use (ReAct), or search (ToT) to improve reliability and grounding.`;
  }

  return { thoughts, finalAnswer, evidenceSummary };
}

function main() {
  const corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
  const invIndex = buildInvertedIndex(corpus);
  const retrieved = retrieve(QUESTION, corpus, invIndex, TOP_K);
  const { thoughts, finalAnswer, evidenceSummary } = chainOfThoughtAnswer(
    QUESTION,
    retrieved
  );
  // Output
  console.log('Question:', QUESTION);
  console.log('\nRetrieved Context (Top', TOP_K, '):');
  for (const r of retrieved) {
    console.log(
      `- [${r.doc.id}] score=${r.score.toFixed(4)} :: ${r.doc.title}`
    );
  }
  console.log('\nEvidence Summary:\n' + evidenceSummary);
  console.log('\nChain-of-Thought:');
  thoughts.forEach((t, i) => console.log(`Step ${i + 1}: ${t}`));
  console.log('\nAnswer:', finalAnswer);
}

main();
