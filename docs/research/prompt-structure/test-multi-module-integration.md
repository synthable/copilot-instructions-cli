# Evaluate Multi-Module Integration Test

## Expected Requirements (any 5 of these):

From **authentication** module:
- Hash passwords with bcrypt/scrypt/Argon2
- Rate limit login attempts
- Use HTTPS
- Access token expiration ≤15 minutes
- Rotate refresh tokens

From **error-handling** module:
- Log errors with context (request ID, user ID)
- Validate input at boundaries
- Never swallow errors
- Provide user-friendly error messages

From **rest-api-design** module:
- Return proper HTTP status codes (401 unauthorized, 400 bad request)
- Use POST method for login endpoint
- Version the API

## Scoring Instructions:

1. **Requirement Points** (50 points max):
   - Award 10 points for each valid requirement from the list above
   - Max 5 requirements counted (50 points total)

2. **Module Attribution Points** (50 points max):
   - Award 10 points for each correctly attributed module
   - Must match: authentication, error-handling, or rest-api-design
   - Max 5 attributions counted (50 points total)

## Output format:
```json
{
  "test": "Test 2: Multi-Module Integration",
  "requirements": [
    {
      "requirement": "quote from response",
      "valid": true/false,
      "points": 10 or 0
    }
  ],
  "attributions": [
    {
      "module_cited": "authentication",
      "correct": true/false,
      "points": 10 or 0
    }
  ],
  "requirement_points": 0,
  "attribution_points": 0,
  "total_score": 0,
  "percentage": 0.0
}
```