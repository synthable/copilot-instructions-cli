# Copilot Instructions Builder CLI — Overview

## Vision

The Copilot Instructions Builder CLI is a command-line tool designed to transform how developers create, manage, and share instructions for AI assistants. It replaces monolithic prompt files with a modular, versionable, and shareable ecosystem.

## Core Concept

At its core, the tool acts as a **Persona Builder**. By combining modules from four distinct tiers of knowledge, users can construct highly specialized AI personas for any development scenario—from high-level planning to detailed bug fixing.

## Key Benefits

- **Modularity:** Instructions are broken into focused, reusable modules.
- **Versionability:** Modules and personas can be tracked and managed in version control.
- **Shareability:** Modules can be shared and reused across projects and teams.
- **Customization:** Users can build personas tailored to specific workflows or technologies.

## Four-Tier System

The architecture is based on a four-tier system:
1. **Foundation:** Universal truths and reasoning principles.
2. **Principle:** Software engineering best practices and methodologies.
3. **Technology:** Tool- and language-specific knowledge.
4. **Execution:** Step-by-step playbooks for concrete tasks.

Each tier ensures logical, layered compilation from abstract principles to actionable instructions.

## Project Structure

- `instructions-modules/`: Contains all instruction modules, organized by tier and subject.
- `personas/`: Contains persona definition files.
- `instructions-modules.index.json`: Pre-compiled index for fast module lookup.

For detailed architecture, module system, and usage, see the other documentation files in this directory.

## Future Enhancements

- Online module registry (planned)
- Namespaces & versioning (planned)
- Interactive persona builder (planned)