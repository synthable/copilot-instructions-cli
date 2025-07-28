---
tier: principle
name: 'Single Source of Truth (SSoT)'
description: 'Software architecture principle requiring that every data element, business rule, and system configuration must be stored in exactly one authoritative location to ensure data integrity, consistency, and eliminate synchronization conflicts.'
tier: principle
layer: null
schema: specification
---

## Core Concept

Single Source of Truth (SSoT) mandates that every data element, business rule, configuration parameter, and piece of system knowledge must be stored in exactly one authoritative location within the software architecture, with all other system components referencing this canonical source to ensure data consistency, eliminate synchronization issues, and prevent data corruption from conflicting updates.

## Key Rules

- **Data Element Uniqueness:** Each distinct piece of data including user information, business entities, configuration values, and system state MUST be stored in exactly one designated location that serves as the authoritative source for that information across the entire system.
- **Authoritative Source Designation:** For every data type and business entity, there MUST be a clearly identified and documented system component (database table, service, configuration file, or API) that serves as the definitive source of truth with exclusive write permissions for that data.
- **Reference-Only Architecture:** All system components requiring access to data MUST reference the authoritative source directly through APIs, database queries, or configuration lookups rather than maintaining local copies or duplicated storage.
- **Synchronization Elimination:** Manual processes, batch synchronization jobs, or periodic data reconciliation procedures MUST NOT be required to maintain data consistency between different system components or storage locations.
- **Read-Only Replica Constraint:** When performance requirements necessitate data replication for caching, denormalization, or geographic distribution, these copies MUST be marked as read-only, non-authoritative replicas with automatic synchronization mechanisms.
- **Update Authority Control:** Write operations for any data element MUST be restricted to the designated authoritative source, with all modifications flowing through a single, controlled interface that maintains data integrity and audit trails.

## Best Practices

- Implement centralized configuration management systems for application settings, environment variables, and deployment parameters with version control and rollback capabilities.
- Design database schemas that eliminate redundant storage through proper normalization while balancing performance requirements with data integrity constraints.
- Use service-oriented architectures where each microservice owns and manages a specific domain of data with well-defined APIs for external access.
- Establish clear data ownership policies and documentation that specify which system components are responsible for maintaining specific types of information.
- Implement automated testing and monitoring to detect data inconsistencies, synchronization failures, or violations of SSoT principles across system boundaries.
- Create data lineage documentation that traces how information flows from authoritative sources through various system components and transformations.

## Anti-Patterns

- **Distributed data ownership:** Allowing multiple system components to maintain and update the same logical data entities without clear authority and coordination mechanisms.
- **Manual synchronization processes:** Relying on scheduled jobs, batch processes, or human intervention to keep duplicated data consistent across different storage locations.
- **Configuration scattering:** Storing the same configuration values, connection strings, or business parameters in multiple configuration files, environment scripts, or deployment manifests.
- **Denormalization without control:** Creating denormalized database tables or data structures for performance without implementing proper synchronization and update mechanisms.
- **Cache authority confusion:** Treating cached data as authoritative or allowing cache updates that bypass the original data source, leading to stale or inconsistent information.
- **Cross-service data duplication:** Allowing multiple microservices or system components to maintain their own copies of shared business entities without establishing clear ownership boundaries.
