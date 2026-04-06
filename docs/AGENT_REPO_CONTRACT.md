# Agent Repo Contract

This document defines the expected structure of a standalone agent repository that can be consumed by the YACS CLI installer.

## Required Structure

```
<repo-root>/
├── AGENT.md          # Required: agent definition
└── ...               # Any other supporting files
```

## AGENT.md Format

The `AGENT.md` file **must** exist at the repository root. It uses YAML frontmatter followed by the agent prompt content.

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Kebab-case identifier (e.g., `backend-expert`) |
| `description` | Yes | Human-readable description of the agent's expertise |

### Example

```yaml
---
name: backend-expert
description: "Expert backend agent that deeply understands server-side architecture"
---

You are a backend expert. Your role is to...
```

## Versioning

- Use [semantic versioning](https://semver.org/) tags: `v1.0.0`, `v1.1.0`, `v2.0.0`
- The YACS CLI references repos by tag, branch, or commit SHA via `yacs.sources.json`
- Breaking changes to the AGENT.md format or frontmatter contract require a major version bump

## Validation

During build, the YACS CLI validates:
1. `AGENT.md` exists at the repo root
2. The repo can be cloned at the declared `ref`

Build fails if either check fails.
