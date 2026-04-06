
# YACS CLI — Yet Another Claude Skills Installer

> The interactive CLI installer for **QS  Skills and Agents** by NttData. Skills and agents live in their own repositories — this repo builds and packages them for distribution.

---

## What is this?

**YACS CLI** is the installer that fetches, assembles, and installs **Skills** and **Agents** from independent source repositories into your AI editor (Claude Code, Gemini CLI, Codex, GitHub Copilot).

### How it works

1. `yacs.sources.json` declares which skill/agent repos to include, with pinned versions
2. `npm run build` clones each repo and assembles them into `cli/skills/` and `cli/agents/`
3. The CLI installer copies selected skills/agents to your editor's config directory

### Skills
Prompt-based tools that your AI editor invokes automatically when relevant, or you invoke manually. Each skill is designed to solve a specific type of problem with rigor and depth.

### Agents
Specialized expert personas with deep project knowledge that understand your codebase and enforce best practices across a domain.

---

## Structure

```
cli/
├── yacs.sources.json              Source registry (repos + versions)
├── yacs.sources.lock.json         Lock file (resolved commit SHAs)
├── build.js                       Build script (fetches & assembles)
├── src/                           CLI installer source code
├── i18n/                          Translations (7 languages)
├── __tests__/                     Test suite
├── skills/                        Built output (git-ignored)
└── agents/                        Built output (git-ignored)

docs/
├── SKILL_REPO_CONTRACT.md         Expected structure for skill repos
├── AGENT_REPO_CONTRACT.md         Expected structure for agent repos
└── changelogs/
```

---

## Installation

### Option 1: With npx (Recommended)

```bash
npx @mammals-at-work/yacs
```

No installation needed — runs directly.

### Option 2: Install globally

```bash
npm install -g @mammals-at-work/yacs
yacs
```

### Option 3: From repository

```bash
git clone https://github.com/munchkin09/YACS.git
cd YACS/cli
npm install
npm run build    # Fetches skills & agents from source repos
npm start
```

---

Choose your language and select which skills to install!

---

## Installer Usage

The installer guides you through:

1. **Language Selection** - Choose your preferred language
2. **Installation Location** - Install to `~/.claude/skills` or a custom path
3. **Skill Selection** - Use ↑↓ to navigate, SPACE to select
4. **Review** - Confirm your selection before installation

**Keyboard Shortcuts:**
- ↑↓ - Navigate
- SPACE - Select/Deselect
- a - Toggle all
- i - Invert selection
- Enter - Confirm

### Running Tests

The CLI includes a complete test suite that validates:
- i18n module functionality (7 languages, translations)
- Skills directory structure
- Translation file validity

```bash
cd cli
npm test
```

Expected result: **31 tests passing** with 100% success rate.

---

## Source Registry (`yacs.sources.json`)

The `yacs.sources.json` file declares all skills and agents to include in the build:

```json
{
  "skills": [
    {
      "name": "code-reviewer",
      "repo": "https://github.com/org/yacs-skill-code-reviewer.git",
      "ref": "v1.0.0",
      "category": "development"
    }
  ],
  "agents": [
    {
      "name": "backend-expert",
      "repo": "https://github.com/org/yacs-agent-backend-expert.git",
      "ref": "v1.0.0"
    }
  ]
}
```

- `ref` can be a tag, branch, or commit SHA
- `category` determines the directory structure during build
- `yacs.sources.lock.json` records resolved commit SHAs for reproducible builds

---

## Building

```bash
cd cli
npm run build              # Fetch & assemble from lock file
npm run build:update       # Refresh lock file with latest refs
```

---

## Running Tests

```bash
cd cli
npm test
```

Tests validate that build output matches `yacs.sources.json` declarations and all skills/agents have valid structure.

---

## Configuration

The installer automatically detects your system language but allows you to choose from:

- 🇬🇧 English
- 🇪🇸 Español
- 🇨🇦 Català
- 🇪🇺 Euskera
- 🇬🇦 Galego
- 🇦🇳 Andaluz

---

## Contributing

### Adding a new skill

1. Create a new repo following the [Skill Repo Contract](docs/SKILL_REPO_CONTRACT.md)
2. Add an entry to `cli/yacs.sources.json` with the repo URL, ref, and category
3. Run `npm run build` to verify it builds correctly
4. Submit a PR with the `yacs.sources.json` change

### Adding a new agent

1. Create a new repo following the [Agent Repo Contract](docs/AGENT_REPO_CONTRACT.md)
2. Add an entry to `cli/yacs.sources.json`
3. Run `npm run build` to verify
4. Submit a PR

---

## License

MIT
