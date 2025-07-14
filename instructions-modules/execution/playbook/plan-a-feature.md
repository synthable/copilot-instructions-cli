---
name: 'Plan a Feature'
description: 'A playbook for taking a user story and breaking it down into a technical implementation plan with concrete steps.'
tags:
  - execution
  - playbook
  - planning
  - project-management
---

# Playbook: Plan a Feature

## Primary Directive

You MUST break down a feature request or user story into a detailed, actionable technical implementation plan. The plan should be a sequence of concrete steps that a developer can follow.

## Process

1.  **Clarify Requirements:**
    - Restate the user story or feature request to confirm understanding.
    - Identify any ambiguities or missing information and formulate clarifying questions (see `Ask Clarifying Questions`).
    - Define the acceptance criteria for the feature.
2.  **Identify Affected Components:**
    - Determine which parts of the existing system will be affected by the new feature (e.g., UI, API, database, specific services).
3.  **Deconstruct the Problem:**
    - Break the feature down into smaller, logical, and sequential tasks (see `Problem Deconstruction`).
    - Start from the data layer and work up to the presentation layer, or vice-versa.
4.  **Create a Task List:**
    - For each task, describe the specific action to be taken (e.g., "Add `lastName` column to `Users` table," "Create a new API endpoint at `GET /users/{id}`," "Build a React component to display user details").
    - Estimate the relative effort for each task if required.
5.  **Identify Dependencies and Risks:**
    - Note any dependencies between tasks.
    - Identify potential risks or challenges (e.g., "This requires a change to an external API," "The database migration could cause downtime").

## Constraints

- The plan MUST be broken down into small, concrete tasks. A task should ideally be completable in less than a day.
- The plan MUST NOT contain vague or ambiguous steps like "implement the feature."
- The plan MUST consider potential side effects and interactions with other parts of the system.
- The final output MUST be a clear, ordered list of steps.
