# Frequently Asked Questions

## General Questions

### What is Copilot Instructions Builder?

It's a CLI tool that helps you create modular, reusable instruction sets for GitHub Copilot. Instead of maintaining a single monolithic instructions file, you can compose instructions from focused modules.

### Why use a four-tier system?

The four-tier system (Foundation → Principle → Technology → Execution) ensures logical layering from abstract concepts to concrete actions. This makes instructions more maintainable and allows for better reuse across projects.

### Can I use this without GitHub Copilot?

Yes! While designed for GitHub Copilot, the generated instruction files can be used with any AI assistant that accepts markdown-formatted prompts.

## Usage Questions

### How do I share modules between projects?

Use the centralized workflow:

1. Create a global modules directory: `~/.copilot-modules/`
2. Reference it in your commands: `copilot-instructions build -m ~/.copilot-modules`
3. Or set it in persona files: `"modulesPath": "~/.copilot-modules"`

<!-- FUTURE:
### Can I override module content without editing the original?
Yes, use the priority system:
1. Create a local module with the same ID but higher priority
2. Use the `merge_strategy` in your module to control how content combines
3. Or create a new module that extends the original with `dependencies`
-->

### How do I handle multiple programming languages?

Create separate personas for each language:

- `personas/python-developer.persona.json`
- `personas/javascript-developer.persona.json`
- `personas/go-developer.persona.json`

<!--
### What's the difference between `modules` and `optional_modules`?
- `modules`: Required modules that must exist
- `optional_modules`: Modules included if they exist, ignored if not found
-->

## Troubleshooting Questions

### Why isn't my module showing up in searches?

1. Run `copilot-instructions index` to update the index
2. Check that your module has valid frontmatter
3. Verify the module is in the correct tier directory

### How do I debug glob patterns?

Use the `list` command with your glob:

```bash
copilot-instructions list --filter "technology/react/*"
```

<!-- FUTURE:
### Can I use environment variables in modules?
Yes, use the template syntax:
```markdown
Project name: {{PROJECT_NAME}}
API endpoint: {{API_URL || 'http://localhost:3000'}}
```
-->

## Advanced Questions

<!-- FUTURE:
### How do I create conditional content?
Use the `conditions` field in module sections:
```json
{
  "conditions": {
    "include_if": ["typescript", "strict-mode"],
    "exclude_if": ["javascript"]
  }
}
```
-->

### Can I add custom commands?

The architecture supports extensions. Create a new command in `src/commands/` following the existing pattern.

<!-- FUTURE:
### How do I version my modules?
1. Add `version` field to frontmatter
2. Use semantic versioning (e.g., "1.2.3")
3. Document breaking changes in the module
-->

<!-- FUTURE:
### Is there a module registry?
Not yet, but it's planned for a future release. For now, share modules via:
- Git repositories
- npm packages
- Direct file sharing
-->

## Performance Questions

### How can I speed up builds with many modules?

1. Keep the index updated: `copilot-instructions index`
2. Use specific globs instead of wildcards
3. Minimize module dependencies
<!--4. Use `optional_modules` for non-critical modules-->

### What's the maximum number of modules supported?

There's no hard limit, but performance may degrade with 1000+ modules. The system is optimized for typical use cases of 50-200 modules.

## Contributing Questions

### How can I contribute modules?

1. Fork the repository
2. Add modules following the [Module Development Guide](./module-development.md)
3. Submit a pull request
4. Ensure all tests pass

### Where should I report bugs?

Create an issue on [GitHub](https://github.com/yourusername/copilot-instructions-builder/issues) with:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- System information
