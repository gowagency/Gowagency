# CLAUDE.md — AI Assistant Guide for Gowagency

This file provides context, conventions, and workflow guidance for AI assistants
(Claude Code and similar tools) working in this repository.

---

## Repository Overview

**Repository:** `gowagency/Gowagency`
**Status:** Initial setup — no source code committed yet.

This repository will house the Gowagency project. Update this section once the
project's purpose and tech stack are established.

---

## Repository Structure

> This section will be updated as code is added. Populate it with actual paths
> once the project structure is defined.

```
Gowagency/
├── CLAUDE.md          # This file — AI assistant guide
└── .git/              # Git metadata
```

Expected future structure (update as the project grows):

```
Gowagency/
├── CLAUDE.md
├── README.md
├── .gitignore
├── .env.example       # Environment variable template (never commit .env)
├── src/               # Source code
├── tests/             # Test suites
├── docs/              # Documentation
└── scripts/           # Build/utility scripts
```

---

## Development Workflow

### Branching Strategy

- **Main branch:** `main` (or `master`) — always deployable
- **Feature branches:** `feature/<short-description>`
- **Bug fix branches:** `fix/<short-description>`
- **AI-driven branches:** `claude/<description>-<session-id>` (auto-generated)
- Never commit directly to `main`; always open a pull request

### Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer: issue references, co-authors, etc.]
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or updating tests
- `chore` — build process, tooling, or dependency changes
- `ci` — CI/CD configuration changes

**Examples:**
```
feat(auth): add JWT refresh token support
fix(api): handle null response from external service
docs: update setup instructions in README
test(user): add edge cases for email validation
```

### Pull Request Guidelines

1. Keep PRs focused — one concern per PR
2. Include a summary of what changed and why
3. Reference related issues with `Closes #<issue-number>`
4. Ensure all CI checks pass before requesting review
5. Squash or rebase before merging to keep history clean

---

## Git Operations for AI Assistants

When pushing changes:

```bash
git push -u origin <branch-name>
```

- Branch names for AI sessions must start with `claude/` and end with the
  session ID (e.g., `claude/add-feature-gZgIq`)
- If push fails due to network errors, retry with exponential backoff:
  2s → 4s → 8s → 16s (max 4 retries)
- Never push to `main` directly

---

## Code Style & Conventions

> Update this section with language/framework-specific conventions once the
> tech stack is chosen.

### General Rules

- Prefer clarity over cleverness — code is read more than written
- Keep functions small and single-purpose
- Avoid deeply nested logic; use early returns
- No commented-out dead code in commits
- Delete unused variables, imports, and functions rather than commenting them

### Naming

- Use descriptive names; avoid abbreviations unless universally understood
- Be consistent with existing patterns in the codebase
- Prefer full words: `userAuthentication` over `usrAuth`

### Security

- Never commit secrets, API keys, passwords, or tokens
- Always use environment variables for sensitive configuration
- Validate all external input at system boundaries
- Do not log sensitive data

---

## Environment Setup

> Update with actual setup instructions once the project is initialized.

### Prerequisites

List required tools and their versions here (e.g., Node.js, Go, Python, Docker).

### Local Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd Gowagency

# 2. Copy environment variables template
cp .env.example .env
# Edit .env with your local values

# 3. Install dependencies
# <add command here once stack is known>

# 4. Run the application
# <add command here once stack is known>
```

### Environment Variables

Document all required environment variables in `.env.example`. Never commit
actual `.env` files. Key variables to document when added:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| _(none yet)_ | | | |

---

## Testing

> Update with actual test commands once the project is initialized.

### Running Tests

```bash
# Run all tests
# <add command>

# Run with coverage
# <add command>

# Run a specific test file
# <add command>
```

### Testing Conventions

- Write tests alongside feature code, not as an afterthought
- Test behavior, not implementation details
- Aim for meaningful coverage on business logic; avoid testing framework code
- Use descriptive test names: `it("returns 404 when user is not found")`
- Keep unit tests fast; isolate slow I/O in integration/e2e tests

---

## Build & Deployment

> Update with actual build and deploy instructions once the project is
> initialized.

### Build

```bash
# <add build command>
```

### CI/CD

Describe the CI/CD pipeline here once configured. Key checks that must pass
before merging:

- [ ] Linting
- [ ] Type checking (if applicable)
- [ ] Unit tests
- [ ] Integration tests (if applicable)
- [ ] Build succeeds

---

## AI Assistant Guidelines

When working in this repository as an AI assistant, follow these principles:

### Do

- Read relevant files before making changes
- Make the minimum change necessary to accomplish the task
- Write clear, descriptive commit messages following Conventional Commits
- Create a branch following the naming convention before making changes
- Push to the designated branch only
- Update this CLAUDE.md when you discover new patterns or conventions

### Do Not

- Commit directly to `main`
- Add unnecessary complexity, abstractions, or "future-proofing"
- Add comments to code that is already self-explanatory
- Introduce new dependencies without discussion
- Delete or overwrite files without understanding their purpose
- Skip CI checks or use `--no-verify`
- Commit `.env` files or any secrets

### When Uncertain

- Ask before taking irreversible or high-impact actions (deleting files,
  force-pushing, dropping data)
- Prefer the safer, more reversible option when two approaches are equivalent
- Investigate before overwriting — unexpected files may be in-progress work

---

## Key Contacts & Resources

> Update with actual team contacts, documentation links, and internal resources.

- **Repository:** `gowagency/Gowagency`
- **Issue tracker:** _(add link)_
- **Documentation:** _(add link)_
- **Deployment dashboard:** _(add link)_

---

_Last updated: 2026-02-27. Update this file whenever conventions change or new
patterns are established in the codebase._
