# Troubleshooting Guide

## Common Issues and Solutions

### Module Not Found

**Error:** `Module 'principle/testing/unit-tests' not found`

**Causes & Solutions:**

1. **Module not indexed**: Run `copilot-instructions index` to update the index
2. **Typo in module ID**: Check the exact path in `instructions-modules.index.json`
3. **Wrong modules path**: Verify your `--modules-path` setting

<!--### Circular Dependencies

**Error:** `Circular dependency detected: A -> B -> C -> A`

**Solution:**
- Review the `dependencies` field in your module frontmatter
- Remove unnecessary dependencies
- Consider restructuring modules to break the cycle

### Conflicting Modules

**Error:** `Module conflict detected between 'react-hooks' and 'vue-composition'`

**Solutions:**
1. Choose one framework per persona
2. Use `optional_modules` instead of `modules` for conditional inclusion
3. Create separate personas for different tech stacks
-->

### Build Output Issues

**Problem:** Generated file is empty or incomplete

**Checklist:**

- Verify all modules have valid frontmatter
- Check that module content follows the frontmatter
- Ensure no syntax errors in markdown files
- Run `copilot-instructions validate` to check configuration

### Performance Issues

**Problem:** Commands running slowly with large module sets

**Solutions:**

1. Ensure index is up-to-date: `copilot-instructions index`
2. Use specific globs instead of wildcards: `technology/react/*` vs `technology/**/*`
3. Consider splitting large modules into smaller, focused ones

## Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Set debug environment variable
DEBUG=copilot-instructions:* copilot-instructions build

# Or use the verbose flag
copilot-instructions build -v
```

## Getting Help

1. Check existing [GitHub Issues](https://github.com/yourusername/copilot-instructions-builder/issues)
2. Review the [FAQ](./faq.md)
3. Join our [Discord community](https://discord.gg/yourserver)
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Expected behavior
   - System information (Node version, OS)
