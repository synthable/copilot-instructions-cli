# Prompt Structure Testing

Test how LLMs treat the same modules/components content structured in different ways.

Global cognitive level sections, modules split across sections with namespace prefixes ([Hypothesis A: Cognitive Hierarchy](./hypothesis-a-cognitive-hierarchy.md))

Modules stay together as cohesive blocks, components sorted by cognitive level within each module ([Hypothesis B: Module Cohesion](./hypothesis-b-module-cohesion.md))

Modules in persona order, components in authored order (no reordering) ([Hypothesis C: Author Order](./hypothesis-c-author-order.md))

## Summary of Differences

| Aspect                  | Hypothesis A                | Hypothesis B                        | Hypothesis C            |
| ----------------------- | --------------------------- | ----------------------------------- | ----------------------- |
| **Structure**           | Global cognitive sections   | Module blocks with internal sorting | Sequential module order |
| **Component Order**     | By cognitive level globally | By cognitive level within module    | As authored             |
| **Module Cohesion**     | Split across sections       | Preserved                           | Preserved               |
| **Cross-References**    | Long (across sections)      | Short (within module)               | Short (within module)   |
| **Namespace Prefixes**  | Critical for navigation     | Helpful for attribution             | Less necessary          |
| **Cognitive Hierarchy** | Very visible                | Visible within modules              | Not emphasized          |
| **Token Count**         | ~6,200 tokens               | ~6,000 tokens                       | ~5,800 tokens           |
| **Complexity**          | High (scattered content)    | Medium (sorted but grouped)         | Low (sequential)        |

---

## UMS Prompt Structure Evaluation Rubric

[Evaluation Rubric](./evaluation-rubric.md)

## Comparative Analysis Framework

### Per-Hypothesis Scoring

| Metric                    | Hypothesis A | Hypothesis B | Hypothesis C |
| ------------------------- | ------------ | ------------ | ------------ |
| **Technical Correctness** | ___ / 100    | ___ / 100    | ___ / 100    |
| **Adherence to Guidance** | ___ / 100    | ___ / 100    | ___ / 100    |
| **Cross-Referencing**     | ___ / 50     | ___ / 50     | ___ / 50     |
| **Completeness**          | ___ / 50     | ___ / 50     | ___ / 50     |
| **Code Quality**          | ___ / 50     | ___ / 50     | ___ / 50     |
| **Raw Total**             | ___ / 350    | ___ / 350    | ___ / 350    |
| **Weighted Score**        | ___ / 100    | ___ / 100    | ___ / 100    |

### Qualitative Observations

For each hypothesis, note:

1. **Strengths**: What did this structure enable?
2. **Weaknesses**: What did this structure hinder?
3. **Citation Patterns**: How did the LLM reference the guidance?
4. **Organization**: Did the LLM seem to follow the prompt's organization in its output?
5. **Surprises**: Any unexpected behaviors?

### Cross-Model Comparison

| Model               | Best Hypothesis | Score | Notes |
| ------------------- | --------------- | ----- | ----- |
| **Claude Sonnet 4** | ?               | ?     |       |
| **GPT-4 Turbo**     | ?               | ?     |       |
| **Llama 3 70B**     | ?               | ?     |       |

### Key Questions to Answer

1. **Does cognitive hierarchy (A) produce better adherence?**
   - Compare Adherence scores: A vs B vs C
   - Check cross-referencing patterns

2. **Does module cohesion (B) improve integration?**
   - Compare Multi-Level Integration scores
   - Check if LLM connects related concepts better

3. **Is there a prompt length effect?**
   - A is longest, C is shortest
   - Compare scores relative to token count

4. **Do models differ in sensitivity to structure?**
   - Which model benefits most from A?
   - Which is most robust (similar scores across A/B/C)?

---

## Testing Protocol

### Step 1: Prepare Inputs

- [ ] Save each hypothesis prompt as separate file
- [ ] Prepare identical task prompt
- [ ] Set temperature = 0.7 (for some variability but consistency)
- [ ] Set max tokens = 4000 (enough for complete implementation)

### Step 2: Run Tests

For each combination (3 hypotheses × 3 models = 9 tests):

1. Submit hypothesis prompt + task
2. Save complete response
3. Note response time and token usage
4. Run twice for consistency check

### Step 3: Blind Evaluation

- [ ] Anonymize responses (label as A1, A2, B1, B2, C1, C2)
- [ ] Score each response independently
- [ ] Reveal labels after scoring
- [ ] Calculate inter-rater reliability if multiple evaluators

### Step 4: Analysis

- [ ] Calculate scores per rubric
- [ ] Compare across hypotheses
- [ ] Compare across models
- [ ] Identify patterns and insights
- [ ] Document findings

---

## Quick Evaluation Checklist

For rapid assessment, use this abbreviated checklist:

### REST API (10 checks)
- [ ] URLs use plural nouns (no `/getTask`)
- [ ] Correct HTTP methods (POST create, GET read, etc.)
- [ ] Proper status codes (201, 404, 401, etc.)
- [ ] API versioned
- [ ] Resource hierarchy (e.g., `/users/{id}/tasks`)

### Authentication (10 checks)
- [ ] Login endpoint with credential validation
- [ ] JWT token generation
- [ ] Access token ≤15 min expiration
- [ ] Refresh token implemented
- [ ] Refresh token rotation
- [ ] Auth middleware on protected routes
- [ ] Password hashing (bcrypt/scrypt/Argon2)
- [ ] HTTPS enforcement
- [ ] Rate limiting on login
- [ ] Token revocation capability

### Error Handling (10 checks)
- [ ] Typed error classes
- [ ] Input validation at boundaries
- [ ] No swallowed errors (all catch blocks log/rethrow)
- [ ] Logging with context (request ID, user ID)
- [ ] User-friendly error messages (no technical details)
- [ ] Structured logging (JSON)
- [ ] Sensitive data redaction
- [ ] Error codes for programmatic handling
- [ ] Validation errors return 400/422
- [ ] Clear error messages in responses

### Testing (10 checks)
- [ ] Happy path tests for all CRUD operations
- [ ] Error case tests (400, 401, 403, 404)
- [ ] Authentication tests (reject invalid tokens)
- [ ] Authorization tests (user can't access others' tasks)
- [ ] Edge case tests (null, empty, long strings)
- [ ] Tests are deterministic (mocked dependencies)
- [ ] Tests are isolated (fresh data per test)
- [ ] Both status code and body verified
- [ ] Integration tests for critical paths
- [ ] Test fixtures/factories for data

### Cross-Referencing (5 checks)
- [ ] Cites specific concepts by name
- [ ] References principles when implementing
- [ ] Connects procedures to domain concepts
- [ ] Uses guidance from multiple cognitive levels
- [ ] Explains why choices made based on guidance

**Quick Score**: Count checkmarks
- 40-45: Excellent
- 30-39: Good
- 20-29: Acceptable
- 10-19: Needs improvement
- 0-9: Poor

---

## Expected Outcomes

### If Hypothesis A Wins:
- Higher Adherence scores (easier to find relevant guidance)
- Better Multi-Level Integration (sees all Level 2 principles together)
- More explicit cross-references (navigates via cognitive hierarchy)

### If Hypothesis B Wins:
- Higher Technical Correctness (cohesive context improves understanding)
- Better integration within domains (e.g., all auth concepts→procedures→specs together)
- Shorter, more natural cross-references

### If Hypothesis C Wins:
- Similar scores across the board (structure doesn't matter much)
- Model quality dominates over prompt structure
- Simpler is better (less cognitive load on LLM)

### If Results Are Mixed:
- Different models prefer different structures
- Some dimensions benefit from hierarchy, others from cohesion
- Hybrid approach might be optimal

---

## Documentation Template

After testing, document results like this:

[Report Template](./report-template.md)

---

## Usage Instructions

To use this evaluator prompt:

### Prepare the prompt

Replace [INSERT THE LLM'S RESPONSE HERE] with the actual response from Hypothesis A/B/C

### Submit to evaluator LLM

Use Claude Opus/Sonnet or GPT-5.1 as the evaluator.
Set temperature = 0.3 (for consistency but some reasoning flexibility)
Set max tokens = 4000-8000 (enough for detailed evaluation)

### Run for each test case

3 hypotheses × 3 models = 9 evaluations
Keep evaluations separate for comparison

### Extract scores

Parse the JSON output
Compare scores across hypotheses
Identify patterns

## Calibration Test
Before running the full evaluation, calibrate the evaluator with a sample response:

### Sample Response Fragment (Deliberately flawed for calibration)

```typescript
// Task Management API
app.post('/getTasks', (req, res) => {
  const tasks = database.tasks;
  res.send(tasks);
});

app.post('/createTask', (req, res) => {
  const task = req.body;
  database.tasks.push(task);
  res.send('OK');
});

app.get('/login', (req, res) => {
  if (req.query.password === 'admin123') {
    res.send({ token: 'fake-token' });
  }
});
```

### Expected Evaluation:

- API Design: ~5/25 (verbs in URLs, wrong methods, no status codes, no versioning)
- Authentication: ~5/25 (no JWT, hardcoded password, no hashing, GET for login)
- Error Handling: ~0/25 (no error handling)
- Testing: ~0/25 (no tests)
- Adherence: ~0/100 (no evidence of following guidance)
- Cross-Referencing: ~0/50 (no references)

If evaluator scores this >20/350, recalibrate the prompt or try a different evaluator model.
