# Skill Repo Contract

This document defines the expected structure of a standalone skill repository that can be consumed by the YACS CLI installer.

## Required Structure

```
<repo-root>/
├── SKILL.md          # Required: skill definition
├── scripts/          # Optional: helper scripts
├── tools/            # Optional: tools used by the skill
└── ...               # Any other supporting files
```

## SKILL.md Format

The `SKILL.md` file **must** exist at the repository root. It uses YAML frontmatter followed by the skill prompt content.

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Kebab-case identifier (e.g., `code-reviewer`) |
| `description` | Yes | Human-readable description of what the skill does |
| `argument-hint` | No | Hint for expected input (e.g., `[file or module to review]`) |
| `disable-model-invocation` | No | If `true`, skill must be invoked explicitly |
| `allowed-tools` | No | Restrict which tools the skill can use (e.g., `Bash(python *)`) |

### Example

```yaml
---
name: code-reviewer
description: "Reviews code for quality, security, and best practices"
argument-hint: "[file or module to review]"
---

You are a code reviewer. When the user invokes this skill with $ARGUMENTS...
```

## Versioning

- Use [semantic versioning](https://semver.org/) tags: `v1.0.0`, `v1.1.0`, `v2.0.0`
- The YACS CLI references repos by tag, branch, or commit SHA via `yacs.sources.json`
- Breaking changes to the SKILL.md format or frontmatter contract require a major version bump

## Category Assignment

The category (e.g., `development`, `quality-and-security`) is **not** defined in the skill repo itself. It is configured in the CLI's `yacs.sources.json` manifest, which determines where the skill is placed in the directory structure during build.

## Validation

During build, the YACS CLI validates:
1. `SKILL.md` exists at the repo root
2. The repo can be cloned at the declared `ref`

Build fails if either check fails.
