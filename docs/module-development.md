# Module Development

Developing custom modules allows you to tailor GitHub Copilot's guidance to your project's specific needs, coding standards, and architectural patterns. This guide explains the structure of a module and how to create your own.

## Table of Contents
- [Module Structure](#module-structure)
  - [Example JSON Structure](#example-json-structure)
  - [Key Fields Explained](#key-fields-explained)
- [Creating Custom Modules](#creating-custom-modules)

## Module Structure

Each instruction module is a JSON file that defines its properties, dependencies, and the instructions it provides.

### Example JSON Structure
```json
{
  "id": "module-identifier",
  "name": "Module Display Name",
  "type": "base|domain|task",
  "version": "1.0.0",
  "dependencies": ["required-module-ids"],
  "conflicts": ["conflicting-module-ids"],
  "tags": ["react", "frontend", "ui"],
  "priority": 100,
  "metadata": {
    "description": "A concise description of what this module does.",
    "author": "Your Name or Team",
    "category": "frontend|backend|testing|devops|general|custom"
  },
  "instructions": {
    "sections": [
      {
        "id": "section-identifier",
        "title": "Descriptive Section Title",
        "priority": 100,
        "merge_strategy": "replace|append|prepend|smart_merge",
        "content": [
          "Instruction point 1: Be clear and concise.",
          "Instruction point 2: Use active voice.",
          "Instruction point 3: Provide examples where helpful, like {{EXAMPLE_VARIABLE}}."
        ],
        "conditions": {
          "include_if": ["tag1", "another-module-id"],
          "exclude_if": ["specific-tag-to-avoid"],
          "require_modules": ["essential-module-dependency"]
        }
      }
    ]
  },
  "variables": {
    "EXAMPLE_VARIABLE": "This is an example value for a variable.",
    "projectName": "{{PROJECT_NAME}}",
    "framework": "{{FRAMEWORK || 'DefaultFramework'}}"
  }
}
```

### Key Fields Explained:

*   **`id`**: (String) A unique identifier for the module (e.g., `custom-auth-rules`). This ID is used in dependencies and configurations.
*   **`name`**: (String) A human-readable name for the module (e.g., "Custom Authentication Rules").
*   **`type`**: (String) The type of module. Must be one of:
    *   `base`: Foundational instructions, broadly applicable.
    *   `domain`: Instructions specific to a technology or area (e.g., `frontend/react`, `backend/nodejs`).
    *   `task`: Instructions for a specific development task (e.g., `api-design`, `ui-component-style`).
*   **`version`**: (String) The version of the module (e.g., `1.0.0`), following semantic versioning if possible.
*   **`dependencies`**: (Array of Strings) A list of module IDs that this module depends on. These will be loaded and processed before this module.
*   **`conflicts`**: (Array of Strings) A list of module IDs that this module conflicts with. The CLI will attempt to resolve these conflicts based on its configuration.
*   **`tags`**: (Array of Strings) Keywords or tags associated with the module, used for searching and conditional inclusion (e.g., `security`, `performance`, `react`).
*   **`priority`**: (Number) A numerical value indicating the importance of this module or its instructions relative to others. Higher numbers typically mean higher priority.
*   **`metadata`**: (Object) Contains additional information about the module.
    *   **`description`**: (String) A brief explanation of the module's purpose.
    *   **`author`**: (String) The creator of the module.
    *   **`category`**: (String) Helps in organizing modules (e.g., `frontend`, `data`, `utils`).
*   **`instructions`**: (Object) Defines the actual instructional content.
    *   **`sections`**: (Array of Objects) Modules can have one or more sections, each representing a block of related instructions.
        *   **`id`**: (String) A unique identifier for the section within the module.
        *   **`title`**: (String) The title of the instruction section, often used as a heading.
        *   **`priority`**: (Number) Priority for this specific section, influencing its order or precedence during merges.
        *   **`merge_strategy`**: (String) How this section's content should be merged if another module provides a section with the same ID or title. Options:
            *   `replace`: This section replaces the other.
            *   `append`: Content from this section is added after the other.
            *   `prepend`: Content from this section is added before the other.
            *   `smart_merge`: The CLI attempts an intelligent merge (details depend on CLI capabilities).
        *   **`content`**: (Array of Strings) The actual lines of instruction.
        *   **`conditions`**: (Object) Rules to determine if this section should be included.
            *   `include_if`: (Array of Strings) Include if any of these tags or module IDs are active.
            *   `exclude_if`: (Array of Strings) Exclude if any of these tags or module IDs are active.
            *   `require_modules`: (Array of Strings) Include only if all these module IDs are present and active.
*   **`variables`**: (Object) Defines variables that can be used within the `content` of instructions (e.g., `{{MY_VARIABLE}}`). These can be placeholders for values provided by profiles or global settings from the `copilot-instructions.config.js`. Supports default values like `{{VAR || 'default_value'}}`. For more on how variables are supplied, see the **[Configuration Guide](./configuration.md#configuration-structure)**.

## Creating Custom Modules:

1.  **Create a JSON File**: Start by creating a new `.json` file for your module (e.g., `my-custom-auth.json`).
2.  **Define the Module**: Populate the file using the structure and fields described above. Ensure you provide at least `id`, `name`, `type`, and `instructions`.
3.  **Place Your Module**: Put your custom module file into a directory that the CLI can access. It's recommended to create a dedicated folder (e.g., `custom-modules/`) in your project.
4.  **Configure Module Path**: Add the path to this directory in your `copilot-instructions.config.js` file under the `modulePaths` array. For example:
    ```javascript
    // in copilot-instructions.config.js
    module.exports = {
      // ... other configurations
      modulePaths: ['./custom-modules'], // CLI will look for modules here
    };
    ```
    See the **[Configuration Guide](./configuration.md#configuration-structure)** for more on `modulePaths`.
5.  **Use Your Module**: Reference the module by its `id` in the `modules` array of any profile within your `copilot-instructions.config.js`.
    ```javascript
    // in copilot-instructions.config.js
    module.exports = {
      profiles: {
        myProfile: {
          modules: ['base-common', 'my-custom-auth'], // Added your custom module
          // ...
        },
      },
      // ...
    };
    ```

By following these steps, you can extend the capabilities of the Copilot Instructions Builder with your own tailored instruction sets. This allows for fine-grained control over the guidance GitHub Copilot receives, ensuring it aligns perfectly with your project's unique requirements.
