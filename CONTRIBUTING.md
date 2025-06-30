# Contributing to Copilot Instructions Builder CLI

First off, thank you for considering contributing to the Copilot Instructions Builder CLI! Your help is greatly appreciated. Whether it's reporting a bug, discussing improvements, or submitting a pull request, every contribution is valuable.

## How to Contribute

We follow a standard GitHub workflow for contributions:

1.  **Fork the Repository**: Start by forking the [main repository]([YOUR_GITHUB_REPO_URL_HERE]) to your own GitHub account.
2.  **Clone Your Fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/copilot-instructions-builder.git
    ```
3.  **Create a Branch**: Create a new branch for your changes. Choose a descriptive name (e.g., `feature/add-new-command` or `bugfix/resolve-merge-conflict`).
    ```bash
    git checkout -b your-branch-name
    ```
4.  **Make Your Changes**: Implement your feature, fix the bug, or improve the documentation.
5.  **Test Your Changes**: If you've added code that should be tested, please add tests and ensure all tests pass (`npm test`).
6.  **Commit Your Changes**: Write clear, concise commit messages.
    ```bash
    git commit -m "feat: Add new feature" -m "Detailed description of the feature."
    ```
7.  **Push to Your Fork**: Push your changes to your forked repository.
    ```bash
    git push origin your-branch-name
    ```
8.  **Submit a Pull Request (PR)**: Open a pull request from your branch to the `main` branch of the original repository. Provide a clear description of your changes in the PR.

## Updating Documentation

Our user-facing documentation is located in the `/docs` folder. This content is used to generate our GitHub Pages documentation site.

Key documentation files include:
- `docs/index.md`: The main landing page for the documentation.
- `docs/getting-started.md`: Installation and initial setup.
- `docs/usage.md`: How to use the CLI commands.
- `docs/configuration.md`: Details on the `copilot-instructions.config.js` file.
- `docs/module-development.md`: How to create custom modules.

**If your contribution affects any user-facing aspects of the project (e.g., new commands, changes to existing commands, configuration options, module structure), please ensure you update the relevant parts of the documentation in the `/docs` folder.**

Updates to these files will be reflected on the GitHub Pages site after they are merged.

## Code of Conduct

While we don't have a formal Code of Conduct document yet, we expect all contributors to interact respectfully and constructively. Please be kind and considerate when communicating.

---

Thank you again for your interest in contributing!
