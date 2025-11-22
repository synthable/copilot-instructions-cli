# Evaluate Cross-Reference Navigation Test

## Expected Answer Elements:

1. **References "Resource-Based URLs" concept** (25 points)
   - Must mention "Resource-Based URLs" by name or clearly reference this concept
   
2. **Provides correct examples** (25 points)
   - Correct example: `/users`, `/users/123`, `/orders` (plural nouns)
   - Incorrect example: `/user`, `/getUser`, `/createUser` (singular or verbs)
   
3. **Cites cognitive level** (25 points)
   - Must identify Level 3 (Domain Guidance) or "Domain-Specific Guidance"
   
4. **Connects to broader principles** (25 points)
   - Mentions REST conventions, resource-based design, or related principles
   - OR explains the rationale (resources are stable, operations change)

## Scoring Instructions:

For each criterion:
- Award full points if clearly met
- Award 0 points if not met
- No partial credit

Check the response for exact matches or clear paraphrasing of expected elements.

## Output your evaluation in JSON format:
```json
{
  "test": "Test 1: Cross-Reference Navigation",
  "criterion_1_references_concept": {
    "met": true/false,
    "points": 0 or 25,
    "evidence": "quote from response"
  },
  "criterion_2_correct_examples": {
    "met": true/false,
    "points": 0 or 25,
    "evidence": "quote from response"
  },
  "criterion_3_cites_level": {
    "met": true/false,
    "points": 0 or 25,
    "evidence": "quote from response"
  },
  "criterion_4_connects_principles": {
    "met": true/false,
    "points": 0 or 25,
    "evidence": "quote from response"
  },
  "total_score": 0,
  "percentage": 0.0
}
```