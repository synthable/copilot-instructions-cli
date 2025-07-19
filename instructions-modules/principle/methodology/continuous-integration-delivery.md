---
name: 'Continuous Integration & Delivery (CI/CD)'
description: 'A set of practices that automate the integration, building, testing, and deployment of software to enable rapid and reliable releases.'
tags:
  - devops
  - ci
  - cd
  - automation
  - process
  - methodology
---

# Continuous Integration & Delivery (CI/CD)

## Primary Directive

You MUST implement and maintain a fully automated CI/CD pipeline to ensure that every code change is integrated, built, tested, and can be reliably released to production at any time. Integration should occur frequently—ideally several times a day—and every integration MUST be verified by automated builds and tests.

## Process

1. **Centralized Code Repository:** All developers MUST work from a single, central version control system (e.g., Git).
2. **Automated Build:** Every commit to the main branch MUST automatically trigger a build process that compiles the code and runs all automated tests.
3. **Automated Testing:** The pipeline MUST include multiple layers of automated testing (unit, integration, security scans) that act as quality gates. A failure at any gate MUST fail the entire build.
4. **Rapid Feedback:** The automated build and test cycle should be fast enough to provide rapid feedback to developers.
5. **Single, Immutable Artifact:** The build process MUST produce a single, immutable artifact (e.g., Docker image, JAR file) that is promoted through all subsequent stages.
6. **Automated Deployment:** The release of the final artifact to production MUST be an automated, push-button process.
7. **Immediate Fixes:** If a commit breaks the build or causes tests to fail, fixing it MUST be the team's highest priority.

## Constraints

- Do NOT merge or commit code to the main branch that is known to be broken or has failing tests.
- Do NOT let a broken build remain broken for an extended period.
- Developers MUST NOT work in long-lived feature branches that are not integrated with the mainline for days or weeks.
- Do NOT perform manual deployments to production environments. The process MUST be automated and repeatable.
- The build artifact MUST NOT be changed between environments; only its configuration should change.
- The CI/CD process MUST include a comprehensive suite of automated tests that cover all critical paths and use cases.
layer: null
