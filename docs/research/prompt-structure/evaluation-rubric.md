# UMS Prompt Structure Evaluation Rubric

## Test Task

**Prompt**: "Build a secure REST API for a task management system with user authentication. The API should allow users to create, read, update, and delete their own tasks. Include proper error handling and write tests."

**Expected Coverage**:
- REST API design (endpoints, methods, URLs)
- JWT authentication (login, token generation, middleware)
- Error handling (validation, logging, user-friendly messages)
- Testing (happy path, error cases, auth)

---

## Evaluation Dimensions

### 1. Technical Correctness (100 points)

#### 1.1 API Design Correctness (25 points)

| Score  | Criteria                                                                                                                                      |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | All endpoints follow REST conventions perfectly: resource-based URLs (plural nouns), correct HTTP methods, proper status codes, versioned API |
| **20** | Mostly correct REST design with 1-2 minor violations (e.g., missing versioning, one non-resource URL)                                         |
| **15** | Generally RESTful but has 3-4 issues (e.g., some verbs in URLs, inconsistent status codes)                                                    |
| **10** | Attempts REST but has significant issues (mixed conventions, many non-resource URLs)                                                          |
| **5**  | Minimal REST understanding (mostly verbs in URLs, wrong methods)                                                                              |
| **0**  | No REST conventions followed                                                                                                                  |

**Check for**:
- ✓ URLs use plural nouns: `/tasks`, `/tasks/{id}`
- ✓ No verbs in URLs: NOT `/getTasks`, `/createTask`
- ✓ Correct methods: POST (create), GET (read), PUT/PATCH (update), DELETE (delete)
- ✓ Proper status codes: 201 for creation, 404 for not found, 401 for auth failure
- ✓ API versioning: `/v1/tasks` or header-based

---

#### 1.2 Authentication Implementation (25 points)

| Score  | Criteria                                                                                                                                            |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Complete JWT auth: login endpoint, token generation, refresh tokens, auth middleware, HTTPS requirement, password hashing, token expiration ≤15 min |
| **20** | Good JWT auth with 1-2 omissions (e.g., no refresh tokens or missing HTTPS enforcement)                                                             |
| **15** | Basic JWT auth but missing important features (no token refresh, long expiration, weak password handling)                                           |
| **10** | Attempted JWT auth with significant gaps (no middleware, no expiration, insecure)                                                                   |
| **5**  | Minimal auth (basic hardcoded tokens or passwords)                                                                                                  |
| **0**  | No authentication                                                                                                                                   |

**Check for**:
- ✓ Login endpoint: `POST /auth/login` with credential validation
- ✓ Token generation: JWT with claims (user ID, expiration)
- ✓ Token expiration: Access token ≤15 minutes
- ✓ Refresh tokens: Separate refresh token with rotation
- ✓ Auth middleware: Validates token on protected endpoints
- ✓ Password hashing: bcrypt/scrypt/Argon2 mentioned
- ✓ HTTPS enforcement: Mentioned or enforced
- ✓ Rate limiting: Login attempts limited

---

#### 1.3 Error Handling Implementation (25 points)

| Score  | Criteria                                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Comprehensive error handling: typed error classes, validation at boundaries, detailed logging with context, user-friendly messages, no swallowed errors |
| **20** | Good error handling with 1-2 gaps (e.g., logging lacks context, some errors not typed)                                                                  |
| **15** | Basic error handling but missing key features (generic errors, minimal logging, technical messages exposed)                                             |
| **10** | Attempted error handling with significant issues (some swallowed errors, poor logging)                                                                  |
| **5**  | Minimal error handling (generic try-catch, no logging)                                                                                                  |
| **0**  | No error handling or all errors swallowed                                                                                                               |

**Check for**:
- ✓ Typed error classes: `ValidationError`, `NotFoundError`, `AuthenticationError`
- ✓ Input validation: At API boundaries with clear error messages
- ✓ Logging with context: Includes request ID, user ID, error details
- ✓ User-friendly messages: No technical details exposed ("Invalid email" not "Null pointer exception")
- ✓ No swallowed errors: All catch blocks log and/or rethrow
- ✓ Structured logging: JSON format mentioned
- ✓ Sensitive data redaction: Passwords/tokens not logged

---

#### 1.4 Testing Implementation (25 points)

| Score  | Criteria                                                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Comprehensive tests: happy path for all endpoints, error cases (400, 401, 403, 404), auth tests, edge cases, isolated and deterministic |
| **20** | Good test coverage with 1-2 gaps (e.g., missing some error cases or edge cases)                                                         |
| **15** | Basic tests but incomplete coverage (only happy path, minimal error testing)                                                            |
| **10** | Attempted tests with significant gaps (few endpoints tested, no auth tests)                                                             |
| **5**  | Minimal tests (1-2 basic tests only)                                                                                                    |
| **0**  | No tests                                                                                                                                |

**Check for**:
- ✓ Happy path tests: All CRUD endpoints have success case tests
- ✓ Error case tests: 400 (validation), 401 (no auth), 403 (wrong user), 404 (not found)
- ✓ Auth tests: Endpoints reject missing/invalid/expired tokens
- ✓ Edge cases: Empty strings, null, long strings, special characters
- ✓ Test isolation: Fresh data per test, no shared state
- ✓ Deterministic: No random values, mocked dependencies
- ✓ Response verification: Status code AND body structure checked

---

### 2. Adherence to Guidance (100 points)

#### 2.1 REST API Design Guidance (25 points)

| Score  | Criteria                                                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Explicitly follows ALL REST guidance: cites Resource-Based URLs concept, uses HTTP Method Semantics, references status codes data, follows all constraints |
| **20** | Follows most REST guidance with 1-2 missed elements                                                                                                        |
| **15** | Follows key REST principles but misses several guidance points                                                                                             |
| **10** | Partially follows REST guidance, many missed elements                                                                                                      |
| **5**  | Minimal adherence to REST guidance                                                                                                                         |
| **0**  | No evidence of following REST guidance                                                                                                                     |

**Evidence of adherence**:
- ✓ Mentions "resource-based URLs" or "nouns not verbs"
- ✓ Discusses HTTP method semantics (GET safe/idempotent, etc.)
- ✓ References status code meanings
- ✓ Explicitly avoids verbs in URLs as per constraint
- ✓ Uses plural nouns as per constraint
- ✓ Follows URL hierarchy guidance for relationships

---

#### 2.2 Error Handling Guidance (25 points)

| Score  | Criteria                                                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Explicitly follows ALL error handling guidance: cites "Never Swallow Errors", logs with context, provides user-friendly messages, follows all constraints |
| **20** | Follows most error handling guidance with 1-2 missed elements                                                                                             |
| **15** | Follows key error principles but misses several guidance points                                                                                           |
| **10** | Partially follows error guidance, many missed elements                                                                                                    |
| **5**  | Minimal adherence to error handling guidance                                                                                                              |
| **0**  | No evidence of following error handling guidance                                                                                                          |

**Evidence of adherence**:
- ✓ Mentions "fail fast, recover gracefully" or similar principle
- ✓ Explicitly avoids swallowing errors (cites principle or constraint)
- ✓ Implements typed error classes as guided
- ✓ Logs with context (request ID, user ID, etc.) as specified
- ✓ Separates user-facing vs internal error messages
- ✓ Validates at boundaries as per process steps
- ✓ Redacts sensitive data from logs

---

#### 2.3 Authentication Guidance (25 points)

| Score  | Criteria                                                                                                                                       |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Explicitly follows ALL auth guidance: cites JWT concepts, implements defense in depth, uses least privilege, follows all constraints and specs |
| **20** | Follows most auth guidance with 1-2 missed elements                                                                                            |
| **15** | Follows key auth principles but misses several guidance points                                                                                 |
| **10** | Partially follows auth guidance, many missed elements                                                                                          |
| **5**  | Minimal adherence to auth guidance                                                                                                             |
| **0**  | No evidence of following auth guidance                                                                                                         |

**Evidence of adherence**:
- ✓ Mentions JWT structure (header, payload, signature)
- ✓ Uses access + refresh token pattern as described
- ✓ Access token ≤15 min as specified in constraints
- ✓ Rotates refresh tokens as specified
- ✓ Enforces HTTPS as per constraints
- ✓ Uses strong password hashing (bcrypt/scrypt/Argon2)
- ✓ Implements rate limiting per security specs
- ✓ References defense in depth or least privilege principles

---

#### 2.4 Testing Guidance (25 points)

| Score  | Criteria                                                                                                                                  |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Explicitly follows ALL testing guidance: cites test pyramid, ensures deterministic tests, covers all error cases, follows all constraints |
| **20** | Follows most testing guidance with 1-2 missed elements                                                                                    |
| **15** | Follows key testing principles but misses several guidance points                                                                         |
| **10** | Partially follows testing guidance, many missed elements                                                                                  |
| **5**  | Minimal adherence to testing guidance                                                                                                     |
| **0**  | No evidence of following testing guidance                                                                                                 |

**Evidence of adherence**:
- ✓ Mentions test pyramid or testing levels
- ✓ Tests are deterministic (mocks time/external deps)
- ✓ Tests are isolated (fresh data per test)
- ✓ Covers all error cases as specified in process
- ✓ Tests authentication requirements
- ✓ Verifies both status code and body as per constraint
- ✓ Mentions test fixtures/factories as suggested

---

### 3. Cross-Referencing & Knowledge Integration (50 points)

#### 3.1 Internal Cross-References (25 points)

| Score  | Criteria                                                                                                                                                     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **25** | Frequently references concepts/guidance from the prompt: cites specific concepts by name, connects procedures to principles, uses cross-references naturally |
| **20** | Good cross-referencing with occasional explicit citations                                                                                                    |
| **15** | Some cross-referencing but mostly implicit                                                                                                                   |
| **10** | Minimal cross-referencing, mostly standalone thinking                                                                                                        |
| **5**  | Rare cross-references                                                                                                                                        |
| **0**  | No cross-references to prompt content                                                                                                                        |

**Examples of good cross-references**:
- "Using resource-based URLs as described in the REST API design concepts..."
- "Following the 'Never Swallow Errors' principle, I'm logging and rethrowing..."
- "As per the JWT structure concept, the token includes header, payload, and signature..."
- "The access token expires in 15 minutes per the authentication specifications..."

---

#### 3.2 Multi-Level Integration (25 points)

| Score  | Criteria                                                                                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Seamlessly integrates guidance across cognitive levels: applies principles (Level 2) to procedures (Level 4), references specifications (Level 5), shows deep understanding of how levels connect |
| **20** | Good integration across levels with minor gaps                                                                                                                                                    |
| **15** | Some integration but mostly focuses on procedures                                                                                                                                                 |
| **10** | Minimal integration, treats levels independently                                                                                                                                                  |
| **5**  | Rare integration across levels                                                                                                                                                                    |
| **0**  | No integration across cognitive levels                                                                                                                                                            |

**Examples of multi-level integration**:
- Applies "Defense in Depth" principle (L2) → implements token expiration + refresh rotation (L4) → uses specific values from specs (L5)
- Applies "Fail Fast" principle (L2) → validates at boundaries (L4) → returns appropriate status codes (L5)
- Applies "Least Privilege" principle (L2) → scopes tokens to resources (L4)

---

### 4. Completeness (50 points)

#### 4.1 Feature Coverage (30 points)

| Score  | Criteria                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **30** | Implements ALL required features: Full CRUD for tasks, user authentication, user-specific task access (isolation), error handling, comprehensive tests |
| **25** | Implements most features with 1-2 minor omissions                                                                                                      |
| **20** | Implements core features but missing important elements (e.g., no user isolation or incomplete CRUD)                                                   |
| **15** | Implements some features with significant gaps                                                                                                         |
| **10** | Minimal feature implementation                                                                                                                         |
| **0**  | No meaningful features implemented                                                                                                                     |

**Required features**:
- ✓ Create task (POST /tasks)
- ✓ Read task (GET /tasks/{id})
- ✓ Update task (PUT/PATCH /tasks/{id})
- ✓ Delete task (DELETE /tasks/{id})
- ✓ List tasks (GET /tasks)
- ✓ User authentication (login, tokens)
- ✓ User can only access their own tasks (authorization)
- ✓ Error handling on all endpoints
- ✓ Tests for all endpoints

---

#### 4.2 Code Structure & Organization (20 points)

| Score  | Criteria                                                                                                                                     |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **20** | Well-structured code: clear separation of concerns (routes, middleware, controllers, services), proper file organization, clean and readable |
| **15** | Good structure with minor organizational issues                                                                                              |
| **10** | Basic structure but lacks clear separation                                                                                                   |
| **5**  | Poor structure, everything mixed together                                                                                                    |
| **0**  | No discernible structure                                                                                                                     |

**Check for**:
- ✓ Separate files/modules for routes, controllers, middleware, services
- ✓ Auth middleware extracted and reusable
- ✓ Error handling centralized
- ✓ Typed error classes in separate file
- ✓ Test files organized by feature
- ✓ Clear naming conventions

---

### 5. Code Quality (50 points)

#### 5.1 Type Safety & Best Practices (25 points)

| Score  | Criteria                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **25** | Excellent TypeScript usage: proper types for all functions, interfaces for request/response, no `any`, type guards where needed |
| **20** | Good TypeScript usage with minor type gaps                                                                                      |
| **15** | Basic TypeScript usage, some `any` types or missing types                                                                       |
| **10** | Minimal TypeScript features, mostly untyped                                                                                     |
| **5**  | Barely uses TypeScript features                                                                                                 |
| **0**  | No TypeScript or JavaScript only                                                                                                |

---

#### 5.2 Security Practices (25 points)

| Score  | Criteria                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **25** | Security-first approach: HTTPS enforcement, strong password hashing, short token expiration, refresh rotation, rate limiting, input validation, SQL injection prevention |
| **20** | Good security with 1-2 minor gaps                                                                                                                                        |
| **15** | Basic security but missing important features                                                                                                                            |
| **10** | Minimal security considerations                                                                                                                                          |
| **5**  | Security afterthought, major vulnerabilities                                                                                                                             |
| **0**  | No security considerations                                                                                                                                               |

**Check for**:
- ✓ Password hashing (bcrypt/scrypt/Argon2)
- ✓ Token expiration ≤15 min
- ✓ Refresh token rotation
- ✓ HTTPS enforcement mentioned
- ✓ Input validation/sanitization
- ✓ SQL injection prevention (parameterized queries or ORM)
- ✓ Rate limiting on auth endpoints
- ✓ Sensitive data not logged

---

## Scoring Summary

| Category                     | Max Points | Weight   |
| ---------------------------- | ---------- | -------- |
| **1. Technical Correctness** | 100        | 30%      |
| **2. Adherence to Guidance** | 100        | 30%      |
| **3. Cross-Referencing**     | 50         | 15%      |
| **4. Completeness**          | 50         | 15%      |
| **5. Code Quality**          | 50         | 10%      |
| **TOTAL**                    | **350**    | **100%** |

### Weighted Score Calculation

```
Final Score = (
  (Technical Correctness / 100) × 30 +
  (Adherence to Guidance / 100) × 30 +
  (Cross-Referencing / 50) × 15 +
  (Completeness / 50) × 15 +
  (Code Quality / 50) × 10
) × 100

Range: 0-100
```