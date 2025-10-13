# Pre-commit Setup Documentation

This document explains the comprehensive pre-commit setup for the Hashbuzz Frontend project.

## 🔧 Overview

The pre-commit setup ensures code quality and consistency by automatically running checks before commits are allowed. This prevents broken code from entering the repository and maintains high code standards.

## 🛠️ Components

### 1. **Husky** - Git Hooks Manager

- Manages Git hooks in the `.husky/` directory
- Ensures hooks run consistently across all environments
- Version: 9.1.7+

### 2. **lint-staged** - Staged Files Processor

- Runs linters only on staged files (faster than full project linting)
- Prevents unnecessary processing of unchanged files
- Version: 16.1.5+

### 3. **ESLint** - JavaScript/TypeScript Linter

- Enforces code quality and style rules
- Auto-fixes common issues when possible
- Configured with React and TypeScript rules

### 4. **Prettier** - Code Formatter

- Ensures consistent code formatting
- Auto-formats code according to project standards
- Handles TypeScript, JavaScript, JSON, CSS, and Markdown

### 5. **TypeScript Compiler** - Type Checker

- Validates TypeScript types before commit
- Catches type errors early in development
- Runs with `--noEmit` flag for checking only

## 📋 Git Hooks

### Pre-commit Hook (`.husky/pre-commit`)

Runs before each commit and performs:

1. **Staged Files Check** - Verifies there are staged files
2. **Lint-staged Execution** - Runs formatters and linters on staged files
3. **TypeScript Check** - Validates types for TypeScript files
4. **Security Scan** - Checks for potential secrets and sensitive data
5. **Code Quality Warnings** - Identifies TODO comments, console.log statements, large files

**Automatic Fixes:**

- ESLint auto-fixes (`--fix` flag)
- Prettier auto-formatting
- Import organization

### Commit Message Hook (`.husky/commit-msg`)

Enforces conventional commit message format:

```
type(scope): description

Examples:
feat(auth): add social media login integration
fix(campaign): resolve creation form validation
docs(readme): update installation instructions
```

**Valid Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Formatting changes
- `refactor` - Code restructuring
- `test` - Adding/updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Revert previous commit

### Pre-push Hook (`.husky/pre-push`)

Additional checks before pushing to remote:

1. **Branch Protection** - Extra checks for main branch
2. **Complete Type Check** - Full project TypeScript validation
3. **Production Build Test** - Ensures code builds successfully
4. **Commit Quality Check** - Reviews recent commit messages
5. **Security Review** - Scans recent commits for sensitive data

## ⚙️ Configuration Files

### `.lintstagedrc`

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix --max-warnings 0", "prettier --write"],
  "*.{json,css,md,yaml,yml}": ["prettier --write"],
  "src/**/*.{ts,tsx}": ["bash -c 'tsc --noEmit --skipLibCheck'"]
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "pre-commit": "lint-staged",
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint src --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write 'src/**/*.{ts,tsx,js,jsx,json,css,md}'",
    "format:check": "prettier --check 'src/**/*.{ts,tsx,js,jsx,json,css,md}'",
    "type-check": "tsc --noEmit",
    "fix-all": "yarn lint:fix && yarn format",
    "check-all": "yarn type-check && yarn lint && yarn format:check"
  }
}
```

## 🚀 Setup Instructions

### Automatic Setup

Run the setup script:

```bash
./setup-dev.sh
```

### Manual Setup

1. **Install Dependencies:**

   ```bash
   yarn add --dev husky lint-staged
   ```

2. **Initialize Husky:**

   ```bash
   yarn husky install
   ```

3. **Make Hooks Executable:**
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   chmod +x .husky/pre-push
   ```

## 🔨 Usage

### Normal Workflow

1. Make your code changes
2. Stage files: `git add .`
3. Commit: `git commit -m "feat(component): add new feature"`
4. Push: `git push`

The hooks will automatically run and either:

- ✅ Allow the commit/push if all checks pass
- ❌ Block the commit/push and show errors to fix

### Manual Quality Checks

```bash
# Check everything
yarn check-all

# Fix all auto-fixable issues
yarn fix-all

# Individual checks
yarn type-check
yarn lint
yarn format:check

# Individual fixes
yarn lint:fix
yarn format
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. TypeScript Errors

```bash
# Check specific errors
yarn type-check

# Common solutions:
# - Fix type annotations
# - Add missing imports
# - Update interface definitions
```

#### 2. ESLint Errors

```bash
# Auto-fix what's possible
yarn lint:fix

# Common issues:
# - Unused variables (remove them)
# - Missing dependencies in hooks
# - Incorrect prop types
```

#### 3. Prettier Formatting

```bash
# Auto-format all files
yarn format

# Check what needs formatting
yarn format:check
```

#### 4. Commit Message Format

```
❌ Bad: "fixed bug"
✅ Good: "fix(auth): resolve login validation issue"

❌ Bad: "Added new feature for campaigns"
✅ Good: "feat(campaign): add advanced filtering options"
```

### Bypass Hooks (Emergency Only)

```bash
# Skip pre-commit (NOT RECOMMENDED)
git commit --no-verify -m "emergency fix"

# Skip pre-push (NOT RECOMMENDED)
git push --no-verify
```

### Disable Hooks Temporarily

```bash
# Disable husky
export HUSKY=0

# Re-enable
unset HUSKY
```

## 📊 Performance

### Optimization Features

- **Staged Files Only**: lint-staged processes only changed files
- **Incremental Checks**: TypeScript uses project references when available
- **Parallel Processing**: Multiple linters run concurrently
- **Caching**: ESLint and Prettier use caching for faster subsequent runs

### Expected Times

- Small commits (1-5 files): 5-15 seconds
- Medium commits (6-20 files): 15-45 seconds
- Large commits (20+ files): 45-120 seconds

## 🔒 Security Features

### Secret Detection

Automatically scans for:

- API keys and tokens
- Passwords and credentials
- Private keys and certificates
- Database connection strings

### Pattern Matching

```regex
(password|secret|key|token|api_key).*=.*['"][^'"]*['"]
```

### Prevention Actions

- Blocks commits containing potential secrets
- Provides guidance on proper secret management
- Suggests environment variable usage

## 📈 Code Quality Metrics

### Enforced Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: No warnings allowed (max-warnings 0)
- **Prettier**: Consistent formatting enforced
- **Conventional Commits**: Structured commit messages

### Quality Gates

1. **Pre-commit**: Basic quality and formatting
2. **Pre-push**: Comprehensive testing and validation
3. **CI/CD**: Additional testing and deployment checks

## 🎯 Best Practices

### Developer Workflow

1. **Small, Frequent Commits**: Easier to review and debug
2. **Descriptive Messages**: Use conventional commit format
3. **Fix Before Commit**: Address lint/type errors immediately
4. **Review Changes**: Use `git diff --staged` before committing

### Team Guidelines

1. **Never Bypass Hooks**: Unless absolute emergency
2. **Fix, Don't Ignore**: Address root causes of errors
3. **Share Knowledge**: Help teammates with hook-related issues
4. **Update Configurations**: Propose improvements to the setup

## 🔄 Maintenance

### Regular Updates

```bash
# Update dependencies
yarn add --dev husky@latest lint-staged@latest

# Update configurations
# Review and update .eslintrc, .prettierrc, etc.
```

### Hook Management

```bash
# List all hooks
ls -la .husky/

# Test hooks manually
./.husky/pre-commit
./.husky/commit-msg "test message"
```

### Configuration Updates

- Review configurations quarterly
- Update based on team feedback
- Test changes thoroughly before merging

## 📚 Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)

## 🆘 Support

### Getting Help

1. Check this documentation first
2. Run `./setup-dev.sh` to reset configuration
3. Ask in team chat for assistance
4. Create an issue for persistent problems

### Reporting Issues

When reporting pre-commit issues, include:

- Error messages (full output)
- Git command being run
- Recent changes made
- Operating system and Node.js version

---

**Remember**: These tools are here to help maintain code quality and make the development process smoother. If you encounter issues, don't hesitate to ask for help! 🚀
