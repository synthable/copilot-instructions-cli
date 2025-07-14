# Instruction Modules

This directory contains a collection of instruction modules that provide guidance on various topics, including technology, foundational principles, and execution playbooks. These modules are designed to be used as a knowledge base for building intelligent agents.

The modules are organized into a hierarchical structure. Below is a list of all available modules.

---

## Execution

Playbooks for executing common tasks.

- **Playbook**
  - [Debug Issue](execution/playbook/debug-issue.md) - A systematic playbook for debugging, leveraging foundational modules like root-cause-analysis and causal-reasoning.
  - [Design Microservices Architecture](execution/playbook/design-microservices-architecture.md) - A playbook for designing a system based on the microservices architectural style.
  - [Document A Function](execution/playbook/document-a-function.md) - A playbook for writing comprehensive documentation for a given function, including its parameters, return value, and potential errors.
  - [Generate New Instruction Module](execution/playbook/generate-new-instruction-module.md) - A playbook that orchestrates the creation of a new, well-structured instruction module based on a user's request.
  - [Generate New Persona Module](execution/playbook/generate-new-persona-module.md) - A playbook for generating a new, complete persona file from a user's concept.
  - [Lint Persona File](execution/playbook/lint-persona-file.md) - A playbook to analyze a persona's module list and generate a comprehensive quality and consistency report.
  - [Optimize Web Application Performance](execution/playbook/optimize-web-application-performance.md) - A playbook that applies performance principles to a concrete goal of optimizing a web application.
  - [Plan A Feature](execution/playbook/plan-a-feature.md) - A playbook for taking a user story and breaking it down into a technical implementation plan with concrete steps.
  - [Plan Legacy Modernization](execution/playbook/plan-legacy-modernization.md) - A playbook for creating a safe, incremental plan to modernize a legacy system.
  - [Refactor Component](execution/playbook/refactor-component.md) - A step-by-step process for safely refactoring a piece of code, emphasizing that tests must pass before and after.
  - [Review Pull Request](execution/playbook/review-pull-request.md) - A playbook that uses a checklist to provide structured, constructive feedback on a pull request.
  - [Security Audit](execution/playbook/security-audit.md) - A playbook for conducting a comprehensive security audit of a codebase to identify and mitigate vulnerabilities.
  - [Write Commit Message](execution/playbook/write-commit-message.md) - A playbook for writing a well-formed Git commit message following the Conventional Commits standard.
  - **Audit Documentation**
    - [1 Verify And Comment](execution/playbook/audit-documentation/1-verify-and-comment.md) - A step-by-step process for auditing documentation against a codebase.

## Foundation

Core principles and concepts for reasoning, problem-solving, and decision-making.

- **Bias**
  - [Awareness Of Availability Heuristic](foundation/bias/awareness-of-availability-heuristic.md) - Instructions to not overestimate the importance of information that comes to mind most easily.
  - [Avoiding Survivorship Bias](foundation/bias/avoiding-survivorship-bias.md) - A rule to consider the data from failures as well as successes, avoiding the error of drawing conclusions only from surviving examples.
  - [Ignoring Sunk Costs](foundation/bias/ignoring-sunk-costs.md) - A directive to make decisions based on future potential value, explicitly ignoring past, irrecoverable costs.
  - [Mitigating Confirmation Bias](foundation/bias/mitigating-confirmation-bias.md) - A directive to actively seek out, consider, and present disconfirming evidence.
  - [Recognizing Anchoring](foundation/bias/recognizing-anchoring.md) - A rule to avoid over-relying on the first piece of information received.
- **Cognitive Frameworks**
  - [Chain Of Verification](foundation/cognitive-frameworks/chain-of-verification.md) - A self-correction framework where the AI generates a draft answer, formulates verification questions about it, answers those questions internally, and then produces a final, verified response.
  - [Contrastive Reasoning](foundation/cognitive-frameworks/contrastive-reasoning.md) - A directive to improve reasoning clarity by generating both a correct and an intentionally incorrect example or reasoning path, then explaining why one is correct and the other is flawed.
  - [Graph Of Thoughts](foundation/cognitive-frameworks/graph-of-thoughts.md) - An advanced reasoning framework that models thoughts as nodes in a graph, allowing for complex, non-linear reasoning paths that can merge and diverge to solve highly interconnected problems.
  - [Re Act Framework](foundation/cognitive-frameworks/re-act-framework.md) - A directive to solve problems by operating in a structured Thought -> Action -> Observation loop, allowing the AI to reason, use tools, and then reason again based on the outcome.
  - [Self Consistency Voting](foundation/cognitive-frameworks/self-consistency-voting.md) - A technique to improve accuracy by generating multiple diverse reasoning paths for the same problem and then selecting the most frequent or consistent answer from the conclusions.
  - [Tree Of Thoughts](foundation/cognitive-frameworks/tree-of-thoughts.md) - A framework for complex problem-solving that explores multiple reasoning paths simultaneously, evaluates their viability, and pursues only the most promising ones.
- **Communication**
  - [Ask Clarifying Questions](foundation/communication/ask-clarifying-questions.md) - A directive to seek more information when a user's request is ambiguous or incomplete.
  - [Clarity And Brevity](foundation/communication/clarity-and-brevity.md) - A rule to be as clear, concise, and unambiguous as possible in all responses.
  - [Define Your Terms](foundation/communication/define-your-terms.md) - A rule to define key or potentially ambiguous terms upfront to avoid misunderstanding.
  - [Error Reporting](foundation/communication/error-reporting.md) - A directive to report errors in a way that is clear, informative, and actionable for the user.
  - [Structure Your Arguments](foundation/communication/structure-your-arguments.md) - Instructions to present information logically, typically by stating a claim, providing evidence, and then concluding.
- **Decision Making**
  - [Assess Risk And Uncertainty](foundation/decision-making/assess-risk-and-uncertainty.md) - A process to differentiate between risk (known probabilities) and uncertainty (unknown probabilities).
  - [Cost Benefit Analysis](foundation/decision-making/cost-benefit-analysis.md) - A formal framework for choosing an action by comparing its costs against its benefits.
  - [One Way Vs Two Way Doors](foundation/decision-making/one-way-vs-two-way-doors.md) - A framework for classifying decisions based on their reversibility.
  - [Satisficing Vs Maximizing](foundation/decision-making/satisficing-vs-maximizing.md) - A rule to understand when a 'good enough' solution is superior to striving for a perfect one.
- **Epistemology**
  - [Distinguishing Fact From Opinion](foundation/epistemology/distinguishing-fact-from-opinion.md) - A core rule to clearly separate objective, verifiable facts from subjective opinions or beliefs.
  - [Understanding Levels Of Certainty](foundation/epistemology/understanding-levels-of-certainty.md) - A guide to differentiate between speculation, hypothesis, theory, and established fact.
- **Ethics**
  - [Be Truthful](foundation/ethics/be-truthful.md) - A core directive to never knowingly mislead or provide false information.
  - [Clarify And Correct](foundation/ethics/clarify-and-correct.md) - Instructions to admit when something is unknown or when a mistake has been made.
  - [Do No Harm](foundation/ethics/do-no-harm.md) - A fundamental principle to evaluate proposed actions and code for potential negative consequences, prioritizing safety and stability.
  - [Intellectual Honesty](foundation/ethics/intellectual-honesty.md) - A rule to represent facts and arguments fairly, even those that contradict a current position.
  - [Principle Of Charity](foundation/ethics/principle-of-charity.md) - A rule to interpret a user's statements in their strongest, most reasonable form.
  - [Respect User Autonomy](foundation/ethics/respect-user-autonomy.md) - A directive to empower the user to make their own decisions, providing options and trade-offs rather than making choices on their behalf.
- **Judgment**
  - [Evaluating Evidence](foundation/judgment/evaluating-evidence.md) - Rules for assessing the quality, reliability, and relevance of information.
  - [Weighing Trade Offs](foundation/judgment/weighing-trade-offs.md) - A process for systematically analyzing the pros and cons of different options.
- **Logic**
  - [Avoiding Logical Fallacies](foundation/logic/avoiding-logical-fallacies.md) - Instructions to identify and avoid common errors in argumentation.
  - [Causality Vs Correlation](foundation/logic/causality-vs-correlation.md) - A critical rule to not assume that one event causes another just because they are correlated.
  - [If Then Statements](foundation/logic/if-then-statements.md) - Rules for correctly processing and evaluating conditional statements.
  - [Necessary And Sufficient Conditions](foundation/logic/necessary-and-sufficient-conditions.md) - A key logical distinction for precise analysis of requirements and outcomes.
  - [Occam S Razor](foundation/logic/occam-s-razor.md) - The principle that, when presented with competing hypotheses, the one with the fewest assumptions should be selected.
  - [Proof Verification](foundation/logic/proof-verification.md) - A process for systematically checking the validity of a logical argument or proof by examining its premises and deductive steps.
  - [Quantifiers And Scope](foundation/logic/quantifiers-and-scope.md) - A rule to be precise with logical quantifiers (e.g., 'all,' 'some,' 'none') and to clearly define their scope.
- **Metacognition**
  - [Continuous Improvement](foundation/metacognition/continuous-improvement.md) - A meta-cognitive mindset focused on ongoing learning by reflecting on experiences, seeking feedback, and deliberately practicing new skills.
  - [Evaluating Confidence Levels](foundation/metacognition/evaluating-confidence-levels.md) - A process for assessing and stating the level of confidence in a conclusion.
  - [Growth Mindset](foundation/metacognition/growth-mindset.md) - The principle of viewing challenges as opportunities to learn and grow, rather than as threats to one's competence.
  - [Re Read For Comprehension](foundation/metacognition/re-read-for-comprehension.md) - A meta-cognitive directive to re-read the entire prompt context from the beginning before generating a response to ensure no details or constraints are missed.
  - [Self Correction Process](foundation/metacognition/self-correction-process.md) - A framework for identifying and correcting its own errors or flawed reasoning.
  - [The Feynman Technique](foundation/metacognition/the-feynman-technique.md) - A process for testing one's own understanding of a concept by attempting to explain it in simple terms.
- **Problem Solving**
  - [Binary Search Debugging](foundation/problem-solving/binary-search-debugging.md) - A technique for systematically eliminating half of the potential problem space with each test to rapidly isolate a fault.
  - [Identify The Bottleneck](foundation/problem-solving/identify-the-bottleneck.md) - A process for analyzing a system to find the single constraint that limits its overall performance.
  - [Means End Analysis](foundation/problem-solving/means-end-analysis.md) - A process for systematically reducing the difference between the current state and the goal state.
  - [Problem Deconstruction](foundation/problem-solving/problem-deconstruction.md) - The rule of breaking large, complex problems into smaller, more manageable, and mutually exclusive parts.
  - [Root Cause Analysis](foundation/problem-solving/root-cause-analysis.md) - A directive to look beyond immediate symptoms to find the underlying, fundamental cause.
  - [Rubber Duck Debugging](foundation/problem-solving/rubber-duck-debugging.md) - A meta-cognitive technique for solving problems by explaining the code, line-by-line, to an inanimate object.
  - [Time Boxing](foundation/problem-solving/time-boxing.md) - A technique for managing effort and focus by allocating a fixed time period to a specific task or approach.
  - [Using Heuristics](foundation/problem-solving/using-heuristics.md) - A directive to use rules of thumb and educated guesses to find approximate solutions when a problem is computationally expensive.
  - [Work Backwards](foundation/problem-solving/work-backwards.md) - A strategy of starting from the desired outcome to determine the necessary preceding steps.
- **Reasoning**
  - [Abductive Reasoning](foundation/reasoning/abductive-reasoning.md) - Finding the most likely or simplest explanation for a set of observations.
  - [Analogical Reasoning](foundation/reasoning/analogical-reasoning.md) - Using knowledge and experience from one domain to solve a problem in another.
  - [Causal Reasoning](foundation/reasoning/causal-reasoning.md) - A process for determining cause-and-effect relationships, moving beyond mere correlation by identifying mechanisms.
  - [Constraint Satisfaction](foundation/reasoning/constraint-satisfaction.md) - A process for finding a solution to a problem by identifying its variables, domains, and constraints, and finding an assignment that satisfies all constraints.
  - [Deductive Reasoning](foundation/reasoning/deductive-reasoning.md) - Deriving specific, logically certain conclusions from general principles.
  - [Divergent Thinking](foundation/reasoning/divergent-thinking.md) - Generates a wide variety of possible solutions to a problem without initial judgment or criticism.
  - [First Principles Thinking](foundation/reasoning/first-principles-thinking.md) - A process for deconstructing problems to their most fundamental, indivisible truths.
  - [Inductive Reasoning](foundation/reasoning/inductive-reasoning.md) - Forming broad generalizations based on specific observations.
  - [Systems Thinking](foundation/reasoning/systems-thinking.md) - A directive to analyze problems by viewing them as interconnected parts of a larger system, focusing on relationships and feedback loops.

## Principle

Guiding principles for software development, architecture, and process.

- **Architecture**
  - [Api Design Principles](principle/architecture/api-design-principles.md) - Principles for designing clean, consistent, and easy-to-use APIs (e.g., RESTful conventions, idempotency).
  - [Architecture Decision Records](principle/architecture/architecture-decision-records.md) - The practice of documenting significant architectural decisions, their context, and their consequences in a lightweight text file.
  - [Command Query Responsibility Segregation](principle/architecture/command-query-responsibility-segregation.md) - The principle that separates methods that change state (Commands) from methods that read state (Queries). This can improve performance, scalability, and security.
  - [Design For Scalability](principle/architecture/design-for-scalability.md) - The principle of designing systems that can handle increased load by adding resources, typically horizontally.
  - [Domain Driven Design](principle/architecture/domain-driven-design.md) - An approach to software development that aligns software design with the business domain through a shared language and focused domain models.
  - [Event Driven Architecture](principle/architecture/event-driven-architecture.md) - An architectural style where components communicate through asynchronous events, enabling loose coupling and high scalability.
  - [Hexagonal Architecture](principle/architecture/hexagonal-architecture.md) - An architectural pattern that isolates the application core from external services through well-defined interfaces (ports) and implementations (adapters).
  - [Layered Architecture](principle/architecture/layered-architecture.md) - An architectural pattern that organizes software into horizontal layers, each with a specific responsibility. Layers can only communicate with adjacent layers.
  - [Microservices](principle/architecture/microservices.md) - An architectural style that structures an application as a collection of loosely coupled, independently deployable services.
  - [Principle Of Least Astonishment](principle/architecture/principle-of-least-astonishment.md) - A rule that a system's components should behave in a way that users expect, without surprising them. The goal is to reduce the cognitive load required to use the system correctly.
  - [Robustness Principle](principle/architecture/robustness-principle.md) - A design principle for software implementation that states to 'be conservative in what you do, be liberal in what you accept from others.' This helps build resilient systems that can handle imperfect input.
  - [Separation Of Concerns](principle/architecture/separation-of-concerns.md) - The principle of separating a system into distinct sections, where each section addresses a separate concern.
- **Collaboration**
  - [Effective Communication](principle/collaboration/effective-communication.md) - A set of principles for clear, concise, and effective technical communication with team members and stakeholders.
  - [Escalation Protocol](principle/collaboration/escalation-protocol.md) - A protocol for recognizing when to stop working alone and when to escalate a problem to a human user or another expert.
  - [Knowledge Sharing](principle/collaboration/knowledge-sharing.md) - Principles for actively mentoring, documenting, and sharing technical knowledge to improve a team's collective capability.
  - [Request For Comments Process](principle/collaboration/request-for-comments-process.md) - A formal process for proposing and building consensus on significant technical changes by inviting feedback from a wide audience.
- **Design**
  - [Composition Over Inheritance](principle/design/composition-over-inheritance.md) - The principle that systems should achieve polymorphic behavior and code reuse through composition (containing instances of other classes) rather than inheritance from a base class.
  - [Kiss Principle](principle/design/kiss-principle.md) - The design principle that states that most systems work best if they are kept simple rather than made complicated.
  - [Law Of Demeter](principle/design/law-of-demeter.md) - A design guideline stating that a module should not have knowledge of the internal details of the objects it manipulates. This reduces coupling between components.
  - **Patterns**
    - [Factory Pattern](principle/design/patterns/factory-pattern.md) - A guide to using the Factory Pattern to create objects without exposing the instantiation logic to the client.
    - [Observer Pattern](principle/design/patterns/observer-pattern.md) - A behavioral design pattern where an object, named the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes.
    - [Singleton Pattern](principle/design/patterns/singleton-pattern.md) - A guide to the Singleton Pattern, ensuring that a class has only one instance and provides a global point of access to it.
    - [Strategy Pattern](principle/design/patterns/strategy-pattern.md) - A behavioral design pattern that enables selecting an algorithm at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable.
- **Documentation**
  - [1 Docs Must Match Code](principle/documentation/1-docs-must-match-code.md) - A core principle that documentation must accurately reflect the current implementation, not future aspirations.
  - [Documentation Standards](principle/documentation/documentation-standards.md) - A set of standards for writing and maintaining clear, accurate, and useful documentation for a software project.
- **Methodology**
  - [Continuous Integration Delivery](principle/methodology/continuous-integration-delivery.md) - A set of practices that automate the integration, building, testing, and deployment of software to enable rapid and reliable releases.
  - [Feature Toggles](principle/methodology/feature-toggles.md) - A technique that decouples code deployment from feature release, allowing new functionality to be deployed to production in a disabled state.
  - [Infrastructure As Code](principle/methodology/infrastructure-as-code.md) - The practice of defining and managing infrastructure using declarative configuration files, enabling version control and reproducibility.
  - [Iterative Development](principle/methodology/iterative-development.md) - The practice of building software in small, incremental cycles that deliver working functionality, enabling rapid feedback and adaptation.
  - [User Story Mapping](principle/methodology/user-story-mapping.md) - A technique for expressing requirements from the user's perspective, focusing on value rather than technical implementation.
- **Performance**
  - [Design For Performance](principle/performance/design-for-performance.md) - The principle of intentionally designing for efficiency in response time, throughput, and resource utilization.
  - [Optimization Principles](principle/performance/optimization-principles.md) - A set of guiding principles for improving system performance, emphasizing measurement and focusing on bottlenecks.
- **Process**
  - [Agile Scrum](principle/process/agile-scrum.md) - An iterative and incremental framework for project management and software development, focused on delivering value in small increments (Sprints) and adapting to change.
  - [Boy Scout Rule](principle/process/boy-scout-rule.md) - The principle that one should always leave the codebase cleaner than they found it. This encourages continuous, incremental improvement of code quality.
  - [Test Driven Development](principle/process/test-driven-development.md) - A software development process where tests are written before the code that they are intended to validate. The process is a short, repeating cycle of Red-Green-Refactor.
  - [Yagni](principle/process/yagni.md) - The principle of not adding functionality until it is demonstrably necessary. This avoids over-engineering and wasted effort on features that may not be needed.
- **Quality**
  - [Clean Code Principles](principle/quality/clean-code-principles.md) - A set of fundamental principles for writing human-readable, understandable, and maintainable code.
  - [Code Organization](principle/quality/code-organization.md) - Principles for structuring a codebase to ensure clarity, logical cohesion, and maintainability.
  - [Code Review Checklist](principle/quality/code-review-checklist.md) - A systematic checklist for reviewing code, focusing on readability, maintainability, and correctness.
  - [Code Review Process](principle/quality/code-review-process.md) - The principle of implementing a thorough peer review process to catch issues before they enter the codebase.
  - [Dry Principle](principle/quality/dry-principle.md) - The principle that every piece of knowledge or logic must have a single, unambiguous, authoritative representation within a system.
  - [Single Source Of Truth](principle/quality/single-source-of-truth.md) - The practice of structuring information models and data schemas so that every data element is stored exactly once. This prevents inconsistencies and improves data integrity.
  - [Solid Principles](principle/quality/solid-principles.md) - A set of five design principles for writing maintainable and scalable object-oriented software.
  - [Static Analysis Integration](principle/quality/static-analysis-integration.md) - The principle of using automated tools to identify potential issues in code before it is executed.
  - [Technical Debt Management](principle/quality/technical-debt-management.md) - A proactive process for identifying, tracking, and paying down technical debt to maintain long-term codebase health.
- **Reliability**
  - [Chaos Engineering](principle/reliability/chaos-engineering.md) - The practice of proactively testing system resilience by introducing controlled, deliberate failures into a production environment.
  - [Design For Reliability](principle/reliability/design-for-reliability.md) - The principle of designing systems that function correctly and consistently, even under adverse conditions.
  - [Fault Tolerance Design](principle/reliability/fault-tolerance-design.md) - Principles for designing systems that can continue to function correctly despite the failure of one or more of their components.
- **Security**
  - [Defense In Depth](principle/security/defense-in-depth.md) - The strategy of protecting a system with multiple, redundant layers of security controls, such that if one layer fails, another is in place to thwart an attack.
  - [Fail Safe Defaults](principle/security/fail-safe-defaults.md) - The principle that, unless a subject is given explicit access to an object, it should be denied access. This is the foundation of a secure system.
  - [Principle Of Least Privilege](principle/security/principle-of-least-privilege.md) - A security principle stating that any user, program, or process should have only the bare minimum privileges necessary to perform its function.
  - [Threat Modeling Process](principle/security/threat-modeling-process.md) - A systematic process for identifying, assessing, and mitigating potential security threats during the design phase of a system.
- **Testing**
  - [Design For Testability](principle/testing/design-for-testability.md) - The principle of designing components to be easily testable in isolation.
  - [Testing Pyramid](principle/testing/testing-pyramid.md) - The principle of having a balanced testing strategy with a large base of fast unit tests, fewer integration tests, and a small number of slow end-to-end tests.

## Technology

Guidance on specific technologies, languages, and platforms.

- **Database**
  - **Postgresql**
    - [Query Optimization](technology/database/postgresql/query-optimization.md) - Directives for writing efficient and performant queries in PostgreSQL, focusing on indexing, joins, and query analysis.
- **Framework**
  - **React**
    - [Component Best Practices](technology/framework/react/component-best-practices.md) - Rules for component composition, state management, and props to create maintainable and performant React applications.
    - [Rules Of Hooks](technology/framework/react/rules-of-hooks.md) - Instructions for correctly applying the Rules of Hooks in React components.
    - [State Management Decisions](technology/framework/react/state-management-decisions.md) - A decision-tree module for choosing between useState, useReducer, useContext, and external libraries.
- **Language**
  - **Python**
    - [Effective Error Handling](technology/language/python/effective-error-handling.md) - Directives on using try/except/finally blocks correctly and creating custom exceptions.
    - [Pep8 Style](technology/language/python/pep8-style.md) - A strict rulebook for ensuring all Python code is compliant with the PEP 8 style guide.
  - **Typescript**
    - [Effective Generics](technology/language/typescript/effective-generics.md) - Best practices for using generics (<T>) to create reusable, type-safe functions, classes, and components.
    - [Strict Type Checking](technology/language/typescript/strict-type-checking.md) - A rule enforcing the use of strict type-checking options in tsconfig.json to catch common errors at compile time.
    - [Types Vs Interfaces](technology/language/typescript/types-vs-interfaces.md) - A decision-making guide on when to use type aliases versus interface declarations for defining object shapes.
    - [Utility Types Best Practices](technology/language/typescript/utility-types-best-practices.md) - A guide to effectively using TypeScript's built-in utility types (Partial, Pick, Omit, Record, etc.) to manipulate and create new types.
- **Persona Builder**
  - [Four Tier Philosophy](technology/persona-builder/four-tier-philosophy.md) - The mandatory hierarchical order for persona module tiers: Foundation -> Principle -> Technology -> Execution.
  - [Foundation Layer Rules](technology/persona-builder/foundation-layer-rules.md) - The rule that Foundation modules must be ordered by their 'layer' metadata, from lowest to highest.
  - [Machine Centric Language](technology/persona-builder/machine-centric-language.md) - A style guide for using imperative, unambiguous, and direct language suitable for programming an AI.
  - [Module Structure Standard](technology/persona-builder/module-structure-standard.md) - The mandatory three-section format for all instruction modules.
  - [Validation Rules](technology/persona-builder/validation-rules.md) - A set of strict validation rules to ensure that every instruction module is high-quality, well-structured, and machine-interpretable.
- **Platform**
  - **Aws**
    - [Api Gateway Integration Patterns](technology/platform/aws/api-gateway-integration-patterns.md) - A guide to different integration patterns for API Gateway, such as Lambda Proxy integration, HTTP integration, and AWS service integration.
    - [Dynamodb Data Modeling](technology/platform/aws/dynamodb-data-modeling.md) - A module on how to model data effectively for DynamoDB, focusing on single-table design, access patterns, and choosing the right keys and indexes.
    - [Iam Best Practices](technology/platform/aws/iam-best-practices.md) - A set of security best practices for managing users, groups, roles, and permissions in AWS Identity and Access Management (IAM).
    - [Lambda Best Practices](technology/platform/aws/lambda-best-practices.md) - A set of best practices for writing, configuring, and deploying efficient, secure, and cost-effective AWS Lambda functions.
    - [S3 Storage Classes](technology/platform/aws/s3-storage-classes.md) - A decision-making guide for selecting the appropriate Amazon S3 storage class based on access frequency and cost considerations.
    - [Vpc Network Security](technology/platform/aws/vpc-network-security.md) - A guide to securing an AWS Virtual Private Cloud (VPC) using security groups, network ACLs, and public/private subnets.
  - **Firebase**
    - [Authentication Best Practices](technology/platform/firebase/authentication-best-practices.md) - Best practices for implementing and managing user authentication with Firebase Auth.
    - [Cloud Functions Best Practices](technology/platform/firebase/cloud-functions-best-practices.md) - Rules for writing efficient, secure, and idempotent Cloud Functions for Firebase.
    - [Firestore Data Modeling](technology/platform/firebase/firestore-data-modeling.md) - Principles for structuring data in Firestore for scalability and efficient querying, focusing on collections, documents, and subcollections.
    - [Firestore Security Rules](technology/platform/firebase/firestore-security-rules.md) - A critical guide for writing and testing Firestore security rules to protect data from unauthorized access.
  - **Vercel**
    - [Deployment Best Practices](technology/platform/vercel/deployment-best-practices.md) - A set of rules and processes for deploying applications to Vercel, focusing on performance, environment variables, and caching.
- **Security**
  - **Owasp Top 10**
    - [Broken Access Control](technology/security/owasp-top-10/broken-access-control.md) - A set of strict rules to prevent broken access control vulnerabilities by enforcing a default-deny policy and verifying authorization for every request.
    - [Cryptographic Failures](technology/security/owasp-top-10/cryptographic-failures.md) - A set of strict rules to prevent cryptographic failures by protecting data in transit and at rest using up-to-date, strong cryptographic algorithms and protocols.
    - [Identification And Authentication Failures](technology/security/owasp-top-10/identification-and-authentication-failures.md) - A set of rules to prevent authentication failures by implementing strong identity and session management controls.
    - [Injection](technology/security/owasp-top-10/injection.md) - A set of strict rules to prevent injection vulnerabilities by treating all user-supplied data as untrusted and using structured, safe APIs for all interpreter interactions.
    - [Insecure Design](technology/security/owasp-top-10/insecure-design.md) - A set of principles for secure software design, emphasizing threat modeling and the integration of security into every phase of the development lifecycle.
    - [Security Logging And Monitoring Failures](technology/security/owasp-top-10/security-logging-and-monitoring-failures.md) - A set of rules to ensure sufficient logging and monitoring is in place to detect and respond to security incidents in a timely manner.
    - [Security Misconfiguration](technology/security/owasp-top-10/security-misconfiguration.md) - A set of rules to prevent security misconfigurations by establishing a hardened, repeatable configuration process and regularly auditing the system for deviations.
    - [Server Side Request Forgery](technology/security/owasp-top-10/server-side-request-forgery.md) - A set of rules to prevent Server-Side Request Forgery (SSRF) vulnerabilities by validating all user-supplied URLs and restricting the server's ability to make arbitrary network requests.
    - [Software And Data Integrity Failures](technology/security/owasp-top-10/software-and-data-integrity-failures.md) - A set of rules to protect against software and data integrity failures by verifying the integrity of all code, data, and critical updates.
    - [Sql Injection Prevention](technology/security/owasp-top-10/sql-injection-prevention.md) - A set of strict rules to prevent SQL injection vulnerabilities by never using dynamic query concatenation and always using parameterized queries.
    - [Vulnerable And Outdated Components](technology/security/owasp-top-10/vulnerable-and-outdated-components.md) - A set of rules for managing third-party components to prevent the use of software with known vulnerabilities.
- **Testing**
  - **Cypress**
    - [Best Practices](technology/testing/cypress/best-practices.md) - A guide to best practices for writing reliable, maintainable, and effective end-to-end tests with Cypress.
    - [Custom Commands](technology/testing/cypress/custom-commands.md) - A guide to creating and using custom commands in Cypress to promote reusable and readable test code.
    - [Selector Strategies](technology/testing/cypress/selector-strategies.md) - A guide to the best strategies for selecting elements in Cypress tests to create stable and resilient tests.
  - **Jest**
    - [Best Practices](technology/testing/jest/best-practices.md) - A guide to best practices for writing clean, effective, and maintainable tests with Jest.
    - [Mocking](technology/testing/jest/mocking.md) - A guide to effectively using mocking in Jest to isolate components and functions for focused testing.
    - [Snapshot Testing](technology/testing/jest/snapshot-testing.md) - Guidelines for using snapshot tests in Jest to verify the output of UI components and large data structures.
  - **Vitest**
    - [Best Practices](technology/testing/vitest/best-practices.md) - A guide to best practices for writing clean, effective, and maintainable tests with Vitest.
    - [Mocking](technology/testing/vitest/mocking.md) - A guide to effectively using mocking in Vitest to isolate components and functions for focused testing.
    - [Performance](technology/testing/vitest/performance.md) - Tips for writing performant tests in Vitest to ensure a fast and efficient testing cycle.
- **Tool**
  - **Git**
    - [Conventional Commits](technology/tool/git/conventional-commits.md) - A strict format for writing commit messages that creates an explicit and machine-readable commit history.
    - [Interactive Rebase Workflow](technology/tool/git/interactive-rebase-workflow.md) - A process for cleaning up commit history using interactive rebase before merging a feature branch.
