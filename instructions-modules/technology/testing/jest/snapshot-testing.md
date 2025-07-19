---
tier: technology
name: 'Jest Snapshot Testing'
description: 'Guidelines for using snapshot tests in Jest to verify the output of UI components and large data structures.'
tags:
  - testing
  - jest
  - javascript
  - snapshot-testing
layer: null
---

# Jest Snapshot Testing

## Primary Directive

You MUST use snapshot tests to verify the output of large, complex data structures or the rendered output of UI components. Snapshots should be used as a tool to detect unexpected changes, not as a replacement for traditional assertions.

## Process

1.  **Generate a Snapshot:** Use `toMatchSnapshot()` to create a snapshot of a component's rendered output or a data structure's value.
2.  **Review and Commit Snapshots:** When a snapshot is created, you MUST review it to ensure that it is correct. Once verified, the snapshot file should be committed to your version control system.
3.  **Update Snapshots Intentionally:** When the output of a component or data structure changes intentionally, you MUST update the snapshot by running Jest with the `--updateSnapshot` or `-u` flag.
4.  **Keep Snapshots Small and Focused:** Snapshots should be as small and focused as possible. Large, complex snapshots are difficult to review and maintain.
5.  **Combine with Other Assertions:** Do not rely solely on snapshot tests. Use them in combination with other assertions to verify specific behaviors and properties.

## Constraints

- You MUST NOT blindly update snapshots without reviewing the changes. This defeats the purpose of snapshot testing.
- You MUST NOT use snapshot tests for code with complex logic or many possible states. Snapshots are best suited for code with deterministic output.
- You MUST NOT commit large, auto-generated snapshot files without a clear understanding of their contents.
