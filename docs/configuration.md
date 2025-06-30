# Configuration

The Copilot Instructions Builder CLI uses a JavaScript configuration file, typically named `copilot-instructions.config.js`, to manage how your instruction files are built. This file defines profiles, modules, variables, and output settings.

## Table of Contents
- [Project Configuration File](#project-configuration-file)
  - [Example `copilot-instructions.config.js`](#example-copilot-instructionsconfigjs)
  - [Configuration Structure](#configuration-structure)
- [Using Profiles](#using-profiles)

## Project Configuration File

You can create this file manually or by using the `copilot-instructions init` command as described in the **[Getting Started Guide](./getting-started.md#initialize-a-new-project)**. It should be placed in the root directory of your project.

**Example `copilot-instructions.config.js`:**
```javascript
module.exports = {
  profiles: {
    development: {
      modules: ['programming-fundamentals', 'frontend/react', 'ui-components'],
      variables: {
        PROJECT_NAME: 'My App',
        FRAMEWORK: 'React',
      },
    },
    production: {
      modules: [
        'programming-fundamentals',
        'frontend/react',
        'ui-components',
        'performance-optimization',
      ],
      variables: {
        PROJECT_NAME: 'My Production App',
        FRAMEWORK: 'React',
      },
    },
  },
  output: {
    file: '.copilot-instructions.md', // Output file name
    template: 'default', // Output template (e.g., default, markdown, json)
  },
  // Optional: Global settings for all profiles
  // globalVariables: {
  //   COMPANY_NAME: 'My Company',
  // },
  // modulePaths: ['./custom-modules'], // Paths to custom module directories
};
```

### Configuration Structure:

The configuration object exported by `copilot-instructions.config.js` can have the following main properties:

*   **`profiles`**: (Object) A collection where each key is a profile name (e.g., `development`, `production`). Each profile object contains:
    *   **`modules`**: (Array of Strings) An array of module IDs to include for this profile. These modules define the actual instructions. For more on creating modules, see the **[Module Development Guide](./module-development.md)**.
    *   **`variables`**: (Object) Key-value pairs for template substitution within the instructions provided by the modules. These allow for dynamic content in your Copilot instructions.
*   **`output`**: (Object) Settings related to the generated output file.
    *   **`file`**: (String) The name of the generated Copilot instructions file (default: `.copilot-instructions.md`).
    *   **`template`**: (String) The template to use for formatting the output (e.g., `default`, `markdown`, `json`).
*   **`globalVariables`** (Optional Object): Defines variables that apply to all profiles. Profile-specific variables will override global variables if they share the same key.
*   **`modulePaths`** (Optional Array of Strings): Specifies directories where custom modules are located. This allows the CLI to discover modules beyond any built-in ones. Refer to the **[Module Development Guide](./module-development.md)** for creating custom modules.

## Using Profiles

Profiles allow you to maintain different instruction sets for various contexts (e.g., development vs. production, different project types). You can build instructions for a specific profile using the `--profile` flag with the `build` command:

```bash
copilot-instructions build --profile development
```
For more details on build commands, see the **[Usage Guide](./usage.md#configuration-driven-operations)**.

If no profile is specified when running `copilot-instructions build`, the CLI behavior might vary (e.g., use a profile named `default` if it exists, or require a profile to be explicitly named). Check the specific version's documentation or CLI help (`copilot-instructions build --help`) for precise default behaviors.
