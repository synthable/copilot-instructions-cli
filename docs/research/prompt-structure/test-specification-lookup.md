# Evaluate Specification Lookup Test

## Expected Exact Answers:

1. Maximum login attempts: **5**
2. Lockout duration: **30 minutes**
3. Minimum password length: **12**
4. HTTP status for not found: **404**
5. Maximum access token TTL: **15 minutes**

## Scoring Instructions:

Check each answer for exact match:
- Must be exact value (5, not "five")
- Must include units where applicable (30 minutes, not just 30)
- Award 20 points per correct answer
- 0 points if incorrect or missing

## Output format:
```json
{
  "test": "Test 3: Specification Lookup",
  "answers": {
    "q1_max_login_attempts": {
      "expected": "5",
      "actual": "extracted from response",
      "correct": true/false,
      "points": 20 or 0
    },
    "q2_lockout_duration": {
      "expected": "30 minutes",
      "actual": "extracted from response",
      "correct": true/false,
      "points": 20 or 0
    },
    "q3_min_password_length": {
      "expected": "12",
      "actual": "extracted from response",
      "correct": true/false,
      "points": 20 or 0
    },
    "q4_http_not_found": {
      "expected": "404",
      "actual": "extracted from response",
      "correct": true/false,
      "points": 20 or 0
    },
    "q5_max_access_token_ttl": {
      "expected": "15 minutes",
      "actual": "extracted from response",
      "correct": true/false,
      "points": 20 or 0
    }
  },
  "total_score": 0,
  "percentage": 0.0
}
```