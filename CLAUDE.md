# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**YACS CLI** is the interactive installer for YACS Skills and Agents. Skills and agents live in independent repositories — this repo contains only the CLI installer, the source registry (`yacs.sources.json`), and the build pipeline that assembles them.

## Repository Details

- **Remote:** https://github.com/munchkin09/YACS.git
- **Primary branch:** main
- **Platform:** Windows (case-insensitive filesystem, symlinks disabled, Git LFS configured)
- **Language:** Spanish may be used in documentation and skill descriptions

## Structure

```
cli/
  yacs.sources.json     # Source registry: repos + versions for all skills/agents
  yacs.sources.lock.json # Lock file with resolved commit SHAs
  build.js              # Build script: clones repos and assembles skills/agents
  src/                  # CLI installer source code
  i18n/                 # Translations (7 languages)
  __tests__/            # Test suite
  skills/               # Build output (git-ignored)
  agents/               # Build output (git-ignored)

docs/
  SKILL_REPO_CONTRACT.md  # Expected structure for skill repos
  AGENT_REPO_CONTRACT.md  # Expected structure for agent repos
  changelogs/
```

## Key Commands

```bash
cd cli
npm run build            # Fetch & assemble skills/agents from source repos
npm run build:update     # Refresh lock file with latest refs
npm test                 # Run test suite (requires build first)
npm start                # Run CLI installer interactively
```

## Adding Skills/Agents

Skills and agents are declared in `cli/yacs.sources.json`. Each entry points to an external Git repo with a pinned ref. The build script clones and assembles them into `cli/skills/` and `cli/agents/`.
