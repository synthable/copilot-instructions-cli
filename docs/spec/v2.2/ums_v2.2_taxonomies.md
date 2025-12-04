# UMS v2.2 Pre-defined Taxonomies

To promote consistency and discoverability, this document provides recommended, non-exhaustive lists of pre-defined values for `domain`, `capabilities`, and `metadata.tags`. These fields all support multiple values (arrays of strings) and are free-form.

Module authors SHOULD prioritize using values from this list to improve searchability. However, if the pre-defined values are insufficient, authors are free to add their own custom values.

## Recommended Domains

Domains specify the technology, language, or field a module applies to.

### Languages

- `c`
- `clojure`
- `cpp`
- `csharp`
- `dart`
- `elixir`
- `erlang`
- `fsharp`
- `go`
- `haskell`
- `java`
- `javascript`
- `kotlin`
- `language-agnostic`
- `lua`
- `objective-c`
- `perl`
- `php`
- `powershell`
- `python`
- `r`
- `ruby`
- `rust`
- `scala`
- `shell`
- `sql`
- `swift`
- `typescript`

### Platforms & Environments

- `android`
- `backend`
- `bun`
- `cloud`
- `container`
- `deno`
- `desktop`
- `docker`
- `dotnet`
- `frontend`
- `ios`
- `jvm`
- `kubernetes`
- `linux`
- `macos`
- `mobile`
- `nodejs`
- `serverless`
- `database`
- `wasm` (WebAssembly)
- `web`
- `windows`

### Frameworks & Libraries

- **Frontend:** `angular`, `astro`, `ember`, `jquery`, `nextjs`, `react`, `remix`, `svelte`, `vue`
- **Backend:** `aspnet`, `django`, `express`, `fastapi`, `fiber`, `flask`, `gin`, `laravel`, `nestjs`, `phoenix`, `rails`, `spring`
- **Mobile:** `flutter`, `jetpack-compose`, `react-native`, `swiftui`
- **Testing:** `chai`, `cypress`, `jest`, `junit`, `mocha`, `playwright`, `pytest`, `selenium`, `vitest`, `xunit`
- **Data Science / ML:** `keras`, `numpy`, `pandas`, `pytorch`, `scikit-learn`, `tensorflow`

### Cloud Providers

- `aws`
- `azure`
- `digitalocean`
- `fly-io`
- `gcp`
- `heroku`
- `netlify`
- `vercel`

### Databases

- **SQL:** `mariadb`, `mysql`, `oracle`, `postgresql`, `sql-server`, `sqlite`
- **NoSQL:** `cassandra`, `couchbase`, `dynamodb`, `elasticsearch`, `firebase-firestore`, `mongodb`, `redis`

---

## Recommended Capabilities

Capabilities declare what functional capabilities a module provides (what it helps you do).

- `api-design`: Designing and defining APIs (e.g., REST, GraphQL, gRPC).
- `architecture`: High-level system design and structure.
- `authentication`: User login and identity verification (e.g., OAuth, JWT, OpenID Connect).
- `authorization`: Permissions and access control (e.g., RBAC, ABAC).
- `caching`: Implementing and managing caches (e.g., client-side, server-side, CDN).
- `ci-cd`: Continuous integration and deployment pipelines.
- `component-composition`: Building UIs from components.
- `concurrency`: Managing parallel execution (e.g., multithreading, async/await).
- `configuration-management`: Managing application configuration.
- `containerization`: Packaging applications in containers (e.g., Docker).
- `data-ingestion`: Importing and processing data from various sources.
- `data-modeling`: Designing data structures and schemas.
- `data-pipelines`: Creating and managing ETL/ELT jobs.
- `data-validation`: Validating input and data integrity.
- `debugging`: Finding and fixing bugs.
- `deployment`: Deploying applications to production.
- `documentation`: Writing and maintaining documentation.
- `error-handling`: Graceful error management and reporting.
- `feature-flagging`: Toggling features on and off.
- `file-system-operations`: Reading from and writing to the file system.
- `infrastructure-as-code`: Managing infrastructure with code (e.g., Terraform, CloudFormation, Bicep).
- `internationalization`: Adapting applications for different languages and regions (i18n).
- `localization`: Translating application content for specific locales (l10n).
- `logging`: Recording application events.
- `memory-management`: Managing memory allocation and garbage collection.
- `messaging`: Using message queues and brokers (e.g., RabbitMQ, Kafka, SQS).
- `monitoring`: Observing and tracking system health (e.g., metrics, traces).
- `networking`: Working with network protocols (e.g., HTTP, TCP, UDP).
- `observability`: Gaining insights into system behavior (logs, metrics, traces).
- `orchestration`: Coordinating distributed systems (e.g., Kubernetes).
- `performance-optimization`: Improving application speed and efficiency.
- `quality-assurance`: Ensuring code quality.
- `query-optimization`: Improving database query performance.
- `rate-limiting`: Controlling the rate of incoming requests.
- `reactive-programming`: Programming with asynchronous data streams.
- `refactoring`: Improving code structure without changing behavior.
- `release-management`: Managing software releases.
- `resource-management`: Managing system resources (memory, CPU).
- `scalability`: Designing systems to handle growth.
- `schema-design`: Designing database or API schemas.
- `security`: Protecting against threats and vulnerabilities.
- `serialization`: Converting data structures to a storable format (e.g., JSON, XML, Protobuf).
- `service-discovery`: Locating services in a distributed system.
- `state-management`: Managing application state (e.g., Redux, MobX, Zustand).
- `static-analysis`: Analyzing code without executing it.
- `storage-management`: Managing data persistence and storage.
- `testing`: Writing and running tests (unit, integration, e2e, performance, contract).
- `type-safety`: Using types to prevent errors.
- `user-experience-design`: Improving the overall user experience.
- `user-interface-design`: Designing user interfaces.

---

## Recommended Tags

Tags provide additional, less-structured keywords for search and filtering.

### Architectural Patterns

- `clean-architecture`
- `cqrs` (Command Query Responsibility Segregation)
- `event-driven`
- `event-sourcing`
- `hexagonal-architecture` (Ports and Adapters)
- `microservices`
- `monolith`
- `onion-architecture`
- `serverless-architecture`
- `service-oriented-architecture` (SOA)

### Design Patterns & Principles

- `adapter-pattern`
- `bdd` (Behavior-Driven Development)
- `composite-pattern`
- `decorator-pattern`
- `dependency-injection`
- `ddd` (Domain-Driven Design)
- `dry`
- `facade-pattern`
- `factory-pattern`
- `kiss`
- `mvc` (Model-View-Controller)
- `mvp` (Model-View-Presenter)
- `mvvm` (Model-View-ViewModel)
- `observer-pattern`
- `proxy-pattern`
- `repository-pattern`
- `service-locator`
- `singleton-pattern`
- `solid`
- `strategy-pattern`
- `tdd` (Test-Driven Development)
- `yagni`

### Methodologies

- `agile`
- `devops`
- `devsecops`
- `gitops`
- `kanban`
- `lean`
- `mob-programming`
- `pair-programming`
- `scrum`
- `waterfall`
- `xp` (Extreme Programming)

### Code Characteristics

- `async`
- `declarative`
- `functional`
- `immutable`
- `imperative`
- `mutable`
- `object-oriented`
- `procedural`
- `reactive`
- `sync`

### General Keywords

- `accessibility` (a11y)
- `anti-patterns`
- `best-practices`
- `clean-code`
- `code-review`
- `conventions`
- `legacy-code`
- `maintainability`
- `performance`
- `readability`
- `scalability`
- `security`
- `style-guide`
- `usability`
