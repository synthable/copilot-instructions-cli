import type { Module } from 'ums-sdk';
import { ComponentType, CognitiveLevel } from 'ums-sdk';

export const advancedApiSecurity: Module = {
  /**
   * @property {string} id - A unique, machine-readable identifier for the module.
   * @description This ID is the primary key for the module within the UMS ecosystem. It is used by the build system to resolve module references in persona files and to compose the final instruction set.
   */
  id: 'technology/security/advanced-api-security',
  /**
   * @property {string} version - The semantic version (SemVer 2.0.0) of the module.
   * @description This version string allows for precise dependency management. Personas can be configured to use specific versions of a module, enabling stable instruction sets even as modules evolve.
   */
  version: '1.0.0-beta',
  /**
   * @property {string} schemaVersion - The version of the UMS specification this module conforms to.
   * @description A declaration of conformity. Build tools use it to validate the module's structure and reject modules that use an incompatible schema.
   */
  schemaVersion: '2.0',
  /**
   * @property {string[]} capabilities - An array of functional capabilities the module provides.
   * @description Describes what the module *helps an AI do*. This is a primary field for discovery, allowing tools to find modules with specific capabilities to solve a task.
   */
  capabilities: [
    'api-security',
    'authentication',
    'authorization',
    'data-protection',
    'threat-modeling',
  ],
  /**
   * @property {number} cognitiveLevel - A number from 0-6 classifying the module's position in the cognitive abstraction hierarchy.
   * @description Guides the AI on *how to think*, structuring the final prompt from foundational reasoning (low numbers) to concrete procedures (high numbers). Level 5 indicates a focus on precise specifications and standards.
   */
  cognitiveLevel: CognitiveLevel.SPECIFICATIONS_AND_STANDARDS,
  /**
   * @property {string | string[]} domain - The technology, language, or field where this module is applicable.
   * @description Used to filter modules for a specific context. For example, a build tool could select modules with `domain: 'backend'` when building a persona for a backend developer.
   */
  domain: ['backend', 'api', 'language-agnostic'],

  /**
   * @property {object} metadata - A container for all human-readable and AI-discoverable metadata.
   * @description This object holds supplementary information used for search, discovery, and documentation generation. It is not typically rendered directly into the final prompt but is essential for the toolchain.
   */
  metadata: {
    /**
     * @property {string} name - A concise, human-readable, Title Case name for the module.
     * @description Used as the display name in UIs, search results, and build reports.
     */
    name: 'Advanced API Security',
    /**
     * @property {string} description - A clear, single-sentence summary of the module's function.
     * @description Used in tooltips, list views, and other places where a brief summary is required.
     */
    description:
      'A comprehensive guide to designing, implementing, and testing advanced security measures for modern APIs, based on OWASP Top 10 and industry best practices.',
    /**
     * @property {string} semantic - A detailed, semantically rich paragraph for vector embedding and semantic search.
     * @description This content is fed into embedding models to create a vector representation of the module, allowing discovery tools to find modules based on conceptual similarity to a user's query.
     */
    semantic:
      'API security, authentication (AuthN), authorization (AuthZ), JWT, OAuth2, OpenID Connect, rate limiting, input validation, output encoding, threat modeling, penetration testing, secure headers, content security policy (CSP), cross-site scripting (XSS), SQL injection (SQLi), broken object level authorization (BOLA), OWASP API Security Top 10.',
    /**
     * @property {string[]} tags - Additional lowercase keywords for search and filtering.
     * @description Tags provide another dimension for discovery, often capturing methodologies (`owasp`), patterns (`jwt`), or characteristics not covered by `capabilities` or `domain`.
     */
    tags: [
      'security',
      'owasp',
      'jwt',
      'oauth2',
      'authentication',
      'authorization',
      'best-practices',
    ],
    /**
     * @property {string} license - The SPDX license identifier for the module's content.
     * @description Clarifies the legal terms under which the module can be used and distributed.
     */
    license: 'MIT',
    /**
     * @property {string[]} authors - The primary authors or maintainers of the module.
     * @description Provides attribution and contact points for module maintenance.
     */
    authors: ['Gemini, AI Assistant <gemini@google.com>'],
    /**
     * @property {string} homepage - A URL to the source repository, documentation, or homepage for the module.
     */
    homepage: 'https://github.com/google/gemini',
    /**
     * @property {boolean} deprecated - A flag indicating that this module is deprecated and should no longer be used.
     * @description Build tools will warn users when a deprecated module is included in a persona.
     */
    deprecated: true,
    /**
     * @property {string} replacedBy - The ID of the module that supersedes this one.
     * @description Used in conjunction with `deprecated`, this tells tools which module to recommend as a replacement.
     */
    replacedBy: 'technology/security/next-gen-api-security-v2',
  },

  /**
   * @property {object[]} components - An array of reusable component blocks that constitute the module's content.
   * @description This is the core content of the module. The build process iterates through these components and renders them into the final Markdown prompt in the order they are defined.
   */
  components: [
    {
      /**
       * @property {string} type - The type of the component, which determines how its content is structured and rendered.
       * @description `ComponentType.Instruction` signifies that this component contains direct orders for the AI.
       */
      type: ComponentType.Instruction,
      /**
       * @property {object} metadata - Metadata specific to this component.
       * @description Provides context that can be used by the renderer or other tools, but is not part of the core instruction itself.
       */
      metadata: {
        /**
         * @property {string} purpose - The specific purpose of this component within the module.
         * @description Explains why this component exists, e.g., to provide the core workflow.
         */
        purpose:
          'Provide a step-by-step process for implementing a secure API development lifecycle.',
        /**
         * @property {string[]} context - Describes the situations or workflows where this component is most useful.
         * @description Helps tools or AIs understand when to apply this specific block of instructions.
         */
        context: ['api-development', 'security-review', 'code-hardening'],
      },
      /**
       * @property {string} purpose - The primary objective or goal of this instruction set.
       * @description Rendered as a high-level summary of the instructions to follow.
       */
      purpose:
        'To systematically apply security controls at every stage of the API lifecycle, from design to deployment.',
      /**
       * @property {Array<string | object>} process - A sequence of step-by-step procedural instructions.
       * @description Rendered as a numbered list for the AI to follow sequentially. Can contain simple strings or objects with a `step` and optional `notes`.
       */
      process: [
        {
          /**
           * @property {string} step - The main description of the action to perform in this step. Conditionals (e.g., "if X, then Y") should be included here.
           */
          step: 'Establish Strong Authentication during the initial design and authentication layer implementation',
          /**
           * @property {string[]} notes - Optional sub-bullets for clarification, examples, or verification steps.
           */
          notes: [
            'Implement a robust mechanism to verify the identity of clients and users. Prefer token-based standards like OAuth2 and OIDC over static API keys.',
            'Verify: Authentication mechanism uses a standard, well-vetted protocol (e.g., OAuth2 with PKCE).',
          ],
        },
        {
          step: 'Enforce Granular Authorization',
          notes: [
            'Implement authorization checks at the beginning of every request handler to ensure the authenticated principal has the required permissions to perform the requested action on the specific resource.',
            'Execute: Check permissions against a role or attribute-based access control (RBAC/ABAC) system.',
            'Verify: Every endpoint that modifies or accesses sensitive data performs an explicit authorization check.',
          ],
        },
        'Apply Rate Limiting and Resource Quotas',
        {
          step: 'Validate All Incoming Data at the edge, before any business logic is executed',
          notes: [
            'Rigorously validate all incoming data from clients, including path parameters, query strings, headers, and request bodies. Use a schema-based validation library.',
            'Verify: A validation schema is defined and enforced for every API endpoint.',
          ],
        },
      ],
      /**
       * @property {object[]} constraints - Non-negotiable rules that the AI must follow.
       * @description Rendered as a list of strict rules. Severity is indicated using RFC 2119 keywords (e.g., MUST, SHOULD NOT) in the rule text.
       */
      constraints: [
        {
          /**
           * @property {string} rule - The constraint rule. MUST use RFC 2119 keywords (MUST, SHOULD, MAY) for severity.
           */
          rule: 'MUST NOT trust user-supplied data.',
          /**
           * @property {string[]} notes - Optional notes for examples, rationale, or clarification.
           */
          notes: [
            'Good: const userId = schema.validate(req.params.id);',
            'Bad: const userId = req.params.id;',
          ],
        },
        {
          rule: 'SHOULD NOT expose internal identifiers in URLs or responses.',
          notes: ['Good: /users/a7b2c-d9e1f', 'Bad: /users/12345'],
        },
      ],
      /**
       * @property {string[]} principles - High-level guiding principles that should inform the AI's behavior.
       * @description These are less strict than constraints and are meant to guide decision-making. Each string is a distinct principle.
       */
      principles: [
        'Principle of Least Privilege',
        'Defense in Depth',
        'Fail Securely',
      ],
      /**
       * @property {object[]} criteria - A list of verification criteria to determine the success of the final output.
       * @description Rendered as a final checklist for the AI to review its work against. Priority is indicated using RFC 2119 keywords.
       */
      criteria: [
        {
          /**
           * @property {string} item - The verification criterion. MUST use RFC 2119 keywords (MUST, SHOULD, MAY) for priority.
           */
          item: 'All data access endpoints MUST be protected by authentication.',
          /**
           * @property {string} category - A string used to group related criteria together.
           * @description This can be used by rendering tools to organize criteria into sections.
           */
          category: 'Authentication',
        },
        {
          item: 'The API MUST implement object-level authorization checks.',
          category: 'Authorization',
        },
        {
          item: 'All user input SHOULD be validated against a strict schema.',
          category: 'Input Validation',
        },
        {
          item: 'Secure HTTP headers (e.g., CSP, HSTS) MAY be implemented.',
          category: 'Transport Security',
        },
      ],
    },
    {
      type: ComponentType.Knowledge,
      metadata: {
        purpose:
          'To educate on the theoretical foundations and common patterns of API security.',
        context: ['learning', 'security-architecture', 'threat-awareness'],
      },
      /**
       * @property {string} explanation - A high-level conceptual overview of the knowledge being imparted.
       * @description Rendered as an introductory paragraph in the knowledge section.
       */
      explanation:
        'Modern API security is a multi-layered discipline that goes beyond simple authentication. It involves understanding common threats, applying architectural patterns, and adopting a security-first mindset.',
      /**
       * @property {object[]} concepts - A list of core concepts to teach the AI.
       * @description Used to explain foundational ideas, terminology, and theories.
       */
      concepts: [
        {
          /**
           * @property {string} name - The name of the concept.
           */
          name: 'JWT (JSON Web Token)',
          /**
           * @property {string} description - A detailed explanation of the concept.
           */
          description:
            'A compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used for stateless authentication sessions.',
          /**
           * @property {string} rationale - An explanation of why this concept is important.
           */
          rationale:
            'JWTs allow services to verify identity and claims without needing to contact an identity provider on every request, improving scalability.',
          /**
           * @property {string[]} examples - Simple, illustrative examples of the concept.
           */
          examples: [
            'Header: {"alg": "HS256", "typ": "JWT"}',
            'Payload: {"sub": "12345", "name": "John Doe", "iat": 1516239022}',
          ],
          /**
           * @property {string[]} tradeoffs - A list of pros and cons or other trade-offs associated with the concept.
           */
          tradeoffs: [
            'Stateless nature makes immediate revocation difficult without a blacklist.',
            'Can become large if too many claims are included.',
          ],
        },
      ],
      /**
       * @property {object[]} examples - A list of rich, illustrative code examples.
       * @description This top-level `examples` property is used for standalone examples that are not tied to a specific pattern.
       */
      examples: [
        {
          /**
           * @property {string} title - The title of the example code snippet.
           */
          title: 'Secure JWT Validation Middleware',
          /**
           * @property {string} rationale - Explains what the code example demonstrates.
           */
          rationale:
            'Demonstrates a typical middleware pattern for validating a JWT bearer token in an Express.js application.',
          /**
           * @property {string} language - The programming language of the snippet, used for syntax highlighting.
           */
          language: 'typescript',
          /**
           * @property {string} snippet - The actual code snippet to be displayed.
           */
          snippet: `
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://<auth-provider>/.well-known/jwks.json'
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function validateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
}
            `,
        },
      ],
      /**
       * @property {object[]} patterns - A list of design patterns or other reusable solutions.
       * @description Used to teach the AI about established best practices and how to apply them.
       */
      patterns: [
        {
          /**
           * @property {string} name - The formal name of the pattern.
           */
          name: 'Rate Limiting Pattern',
          /**
           * @property {string} useCase - Describes the specific situations or contexts where this pattern is applicable.
           */
          useCase:
            'To prevent denial-of-service (DoS) attacks and brute-force attempts on authentication endpoints.',
          /**
           * @property {string} description - Explains the mechanics of the pattern: how it works.
           */
          description:
            'Track the number of requests from a specific IP address or user account within a given time window. If the count exceeds a threshold, temporarily block further requests.',
          /**
           * @property {string[]} advantages - Lists the benefits of applying the pattern.
           */
          advantages: [
            'Protects downstream services from being overwhelmed.',
            'Increases resilience against simple DoS attacks.',
          ],
          /**
           * @property {string[]} disadvantages - Lists the drawbacks or trade-offs of using the pattern.
           */
          disadvantages: [
            'Can inadvertently block legitimate high-volume users if not configured carefully.',
            'Distributed rate limiting can be complex to implement.',
          ],
          /**
           * @property {object} example - A concrete illustration of the pattern in action.
           */
          example: {
            title: 'IP-based Rate Limiter in Express.js',
            rationale:
              'A simple in-memory rate limiter for an Express.js application.',
            language: 'typescript',
            snippet: `
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
              `,
          },
        },
      ],
    },
    {
      type: ComponentType.Data,
      metadata: {
        purpose:
          'To provide structured, machine-readable data for reference, such as checklists and configurations.',
        context: ['security-auditing', 'configuration-as-code'],
      },
      /**
       * @property {string} format - The media type of the data (e.g., 'json', 'yaml').
       * @description This tells the renderer how to format the `value` content, e.g., as a JSON code block.
       */
      format: 'json',
      /**
       * @property {string} description - A human-readable description of what the data represents.
       * @description Rendered as a title or header for the data block.
       */
      description: 'OWASP API Security Top 10 (2023) Checklist',
      /**
       * @property {any} value - The actual data content. While the UMS spec defines this as `unknown`, this module provides a specific structure.
       * @description This value is serialized (e.g., to a JSON string) and placed inside a formatted code block for the AI to reference as a structured checklist.
       */
      value: {
        owaspApiTop10_2023: [
          {
            id: 'API1:2023',
            name: 'Broken Object Level Authorization',
            checked: false,
          },
          { id: 'API2:2023', name: 'Broken Authentication', checked: false },
          {
            id: 'API3:2023',
            name: 'Broken Object Property Level Authorization',
            checked: false,
          },
          {
            id: 'API4:2023',
            name: 'Unrestricted Resource Consumption',
            checked: false,
          },
          {
            id: 'API5:2023',
            name: 'Broken Function Level Authorization',
            checked: false,
          },
          {
            id: 'API6:2023',
            name: 'Unrestricted Access to Sensitive Business Flows',
            checked: false,
          },
          {
            id: 'API7:2023',
            name: 'Server Side Request Forgery',
            checked: false,
          },
          {
            id: 'API8:2023',
            name: 'Security Misconfiguration',
            checked: false,
          },
          {
            id: 'API9:2023',
            name: 'Improper Inventory Management',
            checked: false,
          },
          {
            id: 'API10:2023',
            name: 'Unsafe Consumption of APIs',
            checked: false,
          },
        ],
      },
    },
  ],
};
