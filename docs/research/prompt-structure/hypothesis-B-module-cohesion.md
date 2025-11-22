# Persona: Backend API Developer

## Module: rest-api-design

*Capabilities: api-design, rest, http*
*Cognitive levels: 3, 4, 5*

### Level 3: Domain Guidance

#### Concept: Resource-Based URLs

REST APIs use resource-based URLs where endpoints represent things (nouns), not actions (verbs). Operations are expressed through HTTP methods.

URLs identify resources using nouns; HTTP methods specify operations.

**Rationale**: Resources are stable, operations change. Separation improves API evolution and maintainability.

**Examples**:
- Good: `GET /users/123` (resource: user #123)
- Bad: `GET /getUser?id=123` (action in URL)
- Good: `POST /orders` (create order)
- Bad: `POST /createOrder` (redundant verb)

**Trade-offs**:
- Pro: Intuitive, follows web standards
- Pro: Cacheable with standard HTTP mechanisms
- Con: May feel limiting for complex operations initially

#### Concept: HTTP Method Semantics

Each HTTP method has specific meaning and idempotency guarantees.

**Rationale**: Proper method usage ensures predictable behavior and enables HTTP infrastructure (caches, proxies) to function correctly.

**Examples**:
- GET: Retrieve resource (safe, idempotent)
- POST: Create resource (not idempotent)
- PUT: Replace resource (idempotent)
- PATCH: Partial update (not idempotent)
- DELETE: Remove resource (idempotent)

---

### Level 4: Procedures

#### Purpose: Implement REST Endpoints

Design and implement RESTful API endpoints following industry standards.

**Process**:

1. **Identify resources (nouns, not verbs)**
   - Resources are the things your API exposes: users, products, orders
   - Use plural nouns for collections: /users, /products, /orders
   - See Concept: Resource-Based URLs above

2. **Map HTTP methods to CRUD operations**
   - POST /users → Create user
   - GET /users/{id} → Read user
   - PUT /users/{id} → Update user (full replacement)
   - PATCH /users/{id} → Update user (partial)
   - DELETE /users/{id} → Delete user
   - See Concept: HTTP Method Semantics above

3. **Design URL hierarchy for relationships**
   - Nested resources: /users/{id}/orders
   - Keep nesting shallow (max 2-3 levels)
   - Consider query parameters for filtering: /users?role=admin

4. **Choose appropriate status codes for each endpoint**
   - Use standard HTTP status codes consistently
   - See HTTP Status Codes reference below

5. **Version your API from day one**
   - URL versioning: /v1/users
   - Header versioning: Accept: application/vnd.api+json;version=1
   - Choose one strategy and stick with it

**Constraints**:

- **URLs MUST use plural nouns for collections**
  - Good: /users, /users/123, /users/123/orders
  - Bad: /user, /getUser, /createUser

- **URLs MUST NOT contain verbs**
  - Use HTTP methods to express actions
  - Bad: /getUsers, /createUser, /updateUser, /deleteUser
  - Good: GET /users, POST /users, PUT /users/{id}, DELETE /users/{id}

- All endpoints MUST return appropriate HTTP status codes

- API MUST be versioned from initial release

**Criteria**:

- [ ] Are all endpoints resource-based (nouns only)?
- [ ] Do endpoints use correct HTTP methods for operations?
- [ ] Are status codes used appropriately?
- [ ] Is the API versioned?
- [ ] Can relationships be navigated through URLs?

---

### Level 5: Specifications

#### Data: HTTP Status Codes Reference

HTTP Status Code Quick Reference for REST APIs
```json
{
  "2xx_success": {
    "200": "OK - Request succeeded, resource returned",
    "201": "Created - Resource created successfully",
    "204": "No Content - Success, no response body needed"
  },
  "4xx_client_errors": {
    "400": "Bad Request - Invalid request syntax or validation failure",
    "401": "Unauthorized - Authentication required",
    "403": "Forbidden - Authenticated but not authorized",
    "404": "Not Found - Resource does not exist",
    "409": "Conflict - Request conflicts with current state (e.g., duplicate)",
    "422": "Unprocessable Entity - Validation error with details"
  },
  "5xx_server_errors": {
    "500": "Internal Server Error - Unexpected server error",
    "502": "Bad Gateway - Upstream service error",
    "503": "Service Unavailable - Temporary unavailability"
  }
}
```

---

## Module: error-handling

*Capabilities: error-handling, logging, resilience*
*Cognitive levels: 2, 4*

### Level 2: Universal Patterns

#### Concept: Fail Fast, Recover Gracefully

Errors are inevitable. How we handle them determines system reliability, debuggability, and user experience.

Detect errors as early as possible, handle them at the appropriate level.

**Rationale**: Early detection prevents error propagation. Graceful recovery maintains system availability.

**Examples**:
- Validate input at API boundary → fail fast
- Retry transient network failures → recover gracefully
- Log detailed error context → enable debugging

**Trade-offs**:
- Pro: Easier to debug when errors surface quickly
- Pro: Prevents cascading failures
- Con: Requires careful error categorization

#### Concept: Never Swallow Errors

Empty catch blocks and ignored errors lead to silent failures.

**Rationale**: Silent failures are the hardest bugs to diagnose. Every error should be handled explicitly.

**Examples**:
- Bad: `try { risky(); } catch (e) { /* nothing */ }`
- Good: `try { risky(); } catch (e) { logger.error(e); throw new CustomError(e); }`

---

### Level 4: Procedures

#### Purpose: Implement Error Handling

Implement robust error handling that aids debugging and maintains system reliability.

**Process**:

1. **Define typed error classes for different failure modes**
   - Create error hierarchy: BaseError → ValidationError, NotFoundError, etc.
   - Include error codes, user messages, and debug context
   - See Concept: Never Swallow Errors above

2. **Validate input at system boundaries**
   - API endpoints validate before processing
   - Fail fast with clear validation errors (HTTP 400/422)
   - Include which fields failed and why

3. **Log errors with sufficient context**
   - Include: error message, stack trace, request ID, user ID, timestamp
   - Use structured logging (JSON) for machine parsing
   - Sensitive data MUST be redacted from logs

4. **Handle errors at the appropriate level**
   - Business logic: throw typed errors
   - Service layer: catch, enrich with context, rethrow or recover
   - API layer: catch, log, return appropriate HTTP response

5. **Provide actionable error messages to users**
   - User-facing: "Email address is invalid"
   - NOT user-facing: "Null pointer exception in UserValidator.java:42"
   - See error message examples in constraints

**Constraints**:

- **MUST NOT swallow errors silently**
  - Bad: `try { operation(); } catch (e) { /* empty */ }`
  - Bad: `promise.catch(() => {});`
  - Good: `try { operation(); } catch (e) { logger.error(e); throw e; }`

- **MUST log errors with context**
  - Include: error type, message, stack, request ID, user ID
  - Good: `logger.error('Failed to create user', { userId, email, error })`
  - Bad: `console.error(error)`

- **MUST NOT expose internal errors to users**
  - Bad: "Database connection failed: ECONNREFUSED"
  - Good: "Unable to process request. Please try again later."
  - Log full details internally, show safe message externally

- Error responses MUST include error codes for programmatic handling

- Sensitive data (passwords, tokens) MUST be redacted from logs

**Criteria**:

### Coverage
- [ ] Are all error paths explicitly handled?

### Debuggability
- [ ] Do errors include sufficient debugging context?

### User Experience
- [ ] Are user-facing error messages clear and actionable?

### Security
- [ ] Is sensitive data redacted from logs?

---

## Module: authentication

*Capabilities: authentication, security, jwt*
*Cognitive levels: 2, 3, 4, 5*

### Level 2: Universal Patterns

#### Concept: Defense in Depth

Authentication verifies identity. Poor authentication enables unauthorized access to systems and data.

Layer multiple authentication mechanisms; don't rely on single point of failure.

**Rationale**: If one layer is compromised, others provide backup protection.

**Examples**:
- Password + MFA (multi-factor)
- Token expiration + refresh rotation
- Rate limiting + account lockout

#### Concept: Principle of Least Privilege

Grant minimum necessary access; default deny.

**Rationale**: Limits damage if credentials are compromised.

**Examples**:
- API tokens scoped to specific resources/operations
- Short-lived tokens for sensitive operations
- Separate read-only vs write tokens

---

### Level 3: Domain Guidance

#### Concept: JWT Structure

JWT (JSON Web Tokens) enable stateless authentication for APIs. Tokens contain claims and are cryptographically signed.

JWTs consist of header, payload, and signature.

**Rationale**: Self-contained tokens reduce database lookups; signature ensures integrity.

**Examples**:
- Header: algorithm and token type
- Payload: claims (sub, exp, iat, custom claims)
- Signature: HMAC or RSA signature

**Trade-offs**:
- Pro: Stateless, scales horizontally
- Pro: No session storage needed
- Con: Cannot revoke before expiration
- Con: Token size grows with claims

#### Concept: Access vs Refresh Tokens

Short-lived access tokens, long-lived refresh tokens.

**Rationale**: Balance security (short access token lifetime) with UX (refresh without re-login).

**Examples**:
- Access token: 15 minutes, used for API calls
- Refresh token: 7 days, used to get new access token
- Refresh token rotation: issue new refresh on each refresh

---

### Level 4: Procedures

#### Purpose: Implement JWT Authentication

Implement secure JWT-based authentication for REST APIs.

**Process**:

1. **Create login endpoint that validates credentials**
   - POST /auth/login with username/password
   - Validate against user database (hashed passwords)
   - Use timing-safe comparison to prevent timing attacks
   - Rate limit login attempts (see Security Specifications below)

2. **Generate access and refresh tokens on successful login**
   - Access token: short TTL (15 min), includes user ID and claims
   - Refresh token: longer TTL (7 days), includes user ID only
   - Sign tokens with strong secret (min 256-bit)
   - See Concept: JWT Structure above

3. **Create token refresh endpoint**
   - POST /auth/refresh with refresh token
   - Validate refresh token signature and expiration
   - Issue new access token and refresh token (rotation)
   - Invalidate old refresh token to prevent reuse

4. **Protect API endpoints with authentication middleware**
   - Extract token from Authorization header: Bearer <token>
   - Verify token signature
   - Check token expiration
   - Attach user info to request context
   - Return 401 if invalid/missing token

5. **Implement token revocation for logout and security events**
   - Store revoked token IDs in Redis/database
   - Check revocation list in auth middleware
   - Automatic cleanup of expired revocations

**Constraints**:

- **MUST use HTTPS for all authentication endpoints**
  - Tokens transmitted in plain HTTP can be intercepted
  - Enforce HTTPS in production environments
  - Redirect HTTP to HTTPS automatically

- **MUST hash passwords with strong algorithm**
  - Use bcrypt, scrypt, or Argon2
  - NEVER store passwords in plain text
  - NEVER use weak hashing (MD5, SHA1)

- **Access tokens MUST have short expiration (≤15 minutes)**
  - Limits window of opportunity if token is stolen
  - Use refresh tokens for longer sessions
  - See Concept: Access vs Refresh Tokens above

- **MUST rotate refresh tokens on each use**
  - Prevents refresh token reuse attacks
  - Issue new refresh token when old one is used
  - Invalidate previous refresh token

- Secrets MUST be at least 256 bits for signing tokens

- MUST rate limit authentication endpoints (see Security Specifications below)

**Criteria**:

### Security
- [ ] Are all auth endpoints HTTPS-only?
- [ ] Are passwords hashed with strong algorithm?
- [ ] Do access tokens expire within 15 minutes?
- [ ] Are refresh tokens rotated on use?
- [ ] Is rate limiting implemented on login?

### Functionality
- [ ] Can tokens be revoked (logout, security events)?

---

### Level 5: Specifications

#### Data: Security Specifications

Authentication Security Specifications
```json
{
  "password_requirements": {
    "min_length": 12,
    "require_uppercase": true,
    "require_lowercase": true,
    "require_digit": true,
    "require_special_char": true,
    "prohibited_patterns": ["password123", "qwerty", "12345678"]
  },
  "token_expiration": {
    "access_token_ttl": "15 minutes",
    "refresh_token_ttl": "7 days",
    "max_refresh_token_age": "30 days"
  },
  "rate_limiting": {
    "login_attempts": {
      "max_attempts": 5,
      "window": "15 minutes",
      "lockout_duration": "30 minutes"
    },
    "token_refresh": {
      "max_attempts": 10,
      "window": "1 hour"
    }
  },
  "token_signing": {
    "algorithm": "HS256 or RS256",
    "min_secret_bits": 256,
    "secret_rotation_interval": "90 days"
  }
}
```

---

## Module: testing

*Capabilities: testing, api-testing, quality-assurance*
*Cognitive levels: 2, 4*

### Level 2: Universal Patterns

#### Concept: Test Pyramid

Tests are executable specifications. They document behavior, catch regressions, and enable confident refactoring.

Many unit tests, fewer integration tests, minimal end-to-end tests.

**Rationale**: Unit tests are fast and pinpoint failures. Integration tests verify interactions. E2E tests validate user flows.

**Examples**:
- Base: Unit tests (70%) - fast, isolated
- Middle: Integration tests (20%) - verify component interactions
- Top: E2E tests (10%) - validate critical user paths

**Trade-offs**:
- Pro: Fast feedback from unit tests
- Pro: Pinpoints exact failure location
- Con: Need all layers for confidence

#### Concept: Tests Should Be Deterministic

Same inputs always produce same results; no flaky tests.

**Rationale**: Flaky tests erode trust and slow development.

**Examples**:
- Bad: tests depend on current time or random values
- Bad: tests depend on external services
- Good: mock time and external dependencies

---

### Level 4: Procedures

#### Purpose: Implement API Tests

Write thorough, maintainable tests for REST APIs.

**Process**:

1. **Test happy path for each endpoint**
   - Verify correct status code (200, 201, 204)
   - Verify response body structure and data
   - Verify side effects (database records created/updated)

2. **Test error cases for each endpoint**
   - Invalid input → 400 with validation errors
   - Missing auth → 401
   - Insufficient permissions → 403
   - Resource not found → 404
   - Conflicts → 409
   - See rest-api-design module: HTTP Status Codes

3. **Test authentication and authorization**
   - Endpoints reject requests without valid token
   - Endpoints reject expired tokens
   - Endpoints enforce role-based access
   - See authentication module: Implement JWT Authentication

4. **Test edge cases and boundary conditions**
   - Empty strings, null values, undefined
   - Very long strings (exceed limits)
   - Special characters, Unicode
   - Concurrent requests (race conditions)

5. **Use test fixtures and factories for test data**
   - Create reusable test data builders
   - Isolate tests with fresh data per test
   - Clean up test data after tests complete

**Constraints**:

- **Tests MUST be deterministic (no flaky tests)**
  - Mock external dependencies (databases, APIs, time)
  - Use fixed test data, not random values
  - Bad: `expect(result).toBe(Math.random())`
  - Good: `expect(result).toBe(expectedValue)`

- **Tests MUST be isolated (no shared state)**
  - Each test should run independently
  - Tests should not depend on execution order
  - Use fresh database/fixtures per test

- **Tests MUST cover all error cases**
  - Every error response should have a test
  - Test all validation failures
  - Test authentication/authorization failures
  - See error-handling module: Implement Error Handling

- Critical paths MUST have integration tests covering full request/response cycle

- API tests MUST verify both status code and response body structure

**Criteria**:

### Coverage
- [ ] Does every endpoint have happy path test?
- [ ] Are all error responses tested?

### Security
- [ ] Are authentication requirements tested?

### Quality
- [ ] Are tests deterministic and isolated?

### Performance
- [ ] Do tests run quickly (< 5 seconds for unit tests)?

