#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCES_FILE = path.join(__dirname, 'yacs.sources.json');
const LOCK_FILE = path.join(__dirname, 'yacs.sources.lock.json');
const SKILLS_DIR = path.join(__dirname, 'skills');
const AGENTS_DIR = path.join(__dirname, 'agents');
const DEFAULT_CACHE_DIR = path.join(__dirname, '.build-cache');

// ── CLI Arguments ───────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    cache: { type: 'string', default: DEFAULT_CACHE_DIR },
    'update-lock': { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
  strict: false,
});

if (args.help) {
  console.log(`
Usage: node build.js [options]

Options:
  --cache <dir>      Directory to cache cloned repos (default: .build-cache)
  --update-lock      Force-refresh the lock file even if it exists
  -h, --help         Show this help message
`);
  process.exit(0);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function git(args, cwd) {
  return execSync(`git ${args}`, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const entry of fs.readdirSync(src)) {
    if (entry === '.git') continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

// ── Load Sources ────────────────────────────────────────────────────────────
if (!fs.existsSync(SOURCES_FILE)) {
  console.error('✗ yacs.sources.json not found');
  process.exit(1);
}

const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf-8'));

// ── Load or init lock ───────────────────────────────────────────────────────
let lock = { skills: {}, agents: {} };
const useLock = fs.existsSync(LOCK_FILE) && !args['update-lock'];

if (useLock) {
  lock = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf-8'));
  console.log('ℹ Using existing lock file (pass --update-lock to refresh)');
}

const newLock = { skills: {}, agents: {} };

// ── Prepare output dirs ─────────────────────────────────────────────────────
cleanDir(SKILLS_DIR);
cleanDir(AGENTS_DIR);

const cacheDir = args.cache || DEFAULT_CACHE_DIR;
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// ── Clone or update a repo, return local path ───────────────────────────────
function fetchRepo(name, repo, ref, lockedSha) {
  const repoDir = path.join(cacheDir, name);

  if (fs.existsSync(repoDir)) {
    // Update existing clone
    try {
      git('fetch --depth 1 origin ' + (lockedSha || ref), repoDir);
      git('checkout FETCH_HEAD', repoDir);
    } catch {
      // If fetch fails (e.g. SHA no longer reachable), re-clone
      fs.rmSync(repoDir, { recursive: true, force: true });
      git(`clone --depth 1 --branch ${ref} ${repo} ${repoDir}`, __dirname);
    }
  } else {
    if (lockedSha) {
      // Clone at ref then checkout SHA for verification
      git(`clone --depth 1 --branch ${ref} ${repo} ${repoDir}`, __dirname);
    } else {
      git(`clone --depth 1 --branch ${ref} ${repo} ${repoDir}`, __dirname);
    }
  }

  const sha = git('rev-parse HEAD', repoDir);
  return { localPath: repoDir, sha };
}

// ── Process Skills ──────────────────────────────────────────────────────────
console.log('\n── Building Skills ──────────────────────────────────────────');
let skillErrors = 0;

for (const skill of sources.skills) {
  const key = `${skill.category}/${skill.name}`;
  const lockedSha = useLock ? lock.skills[key]?.sha : null;

  try {
    const { localPath, sha } = fetchRepo(
      `skill-${skill.name}`,
      skill.repo,
      skill.ref,
      lockedSha,
    );

    // Validate SKILL.md exists
    const skillMd = path.join(localPath, 'SKILL.md');
    if (!fs.existsSync(skillMd)) {
      console.error(`✗ ${key}: SKILL.md not found in repo`);
      skillErrors++;
      continue;
    }

    // Copy to output
    const destPath = path.join(SKILLS_DIR, skill.category, skill.name);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    copyDir(localPath, destPath);

    newLock.skills[key] = { repo: skill.repo, ref: skill.ref, sha };
    console.log(`✓ ${key} (${sha.substring(0, 8)})`);
  } catch (err) {
    console.error(`✗ ${key}: ${err.message}`);
    skillErrors++;
  }
}

// ── Process Agents ──────────────────────────────────────────────────────────
console.log('\n── Building Agents ─────────────────────────────────────────');
let agentErrors = 0;

for (const agent of sources.agents) {
  const key = agent.name;
  const lockedSha = useLock ? lock.agents[key]?.sha : null;

  try {
    const { localPath, sha } = fetchRepo(
      `agent-${agent.name}`,
      agent.repo,
      agent.ref,
      lockedSha,
    );

    // Validate AGENT.md exists
    const agentMd = path.join(localPath, 'AGENT.md');
    if (!fs.existsSync(agentMd)) {
      console.error(`✗ ${key}: AGENT.md not found in repo`);
      agentErrors++;
      continue;
    }

    // Copy to output
    const destPath = path.join(AGENTS_DIR, agent.name);
    copyDir(localPath, destPath);

    newLock.agents[key] = { repo: agent.repo, ref: agent.ref, sha };
    console.log(`✓ ${key} (${sha.substring(0, 8)})`);
  } catch (err) {
    console.error(`✗ ${key}: ${err.message}`);
    agentErrors++;
  }
}

// ── Write lock file ─────────────────────────────────────────────────────────
fs.writeFileSync(LOCK_FILE, JSON.stringify(newLock, null, 2) + '\n');
console.log(`\n✓ Lock file written: yacs.sources.lock.json`);

// ── Summary ─────────────────────────────────────────────────────────────────
const totalSkills = sources.skills.length;
const totalAgents = sources.agents.length;
const okSkills = totalSkills - skillErrors;
const okAgents = totalAgents - agentErrors;

console.log(`\n── Summary ─────────────────────────────────────────────────`);
console.log(`  Skills: ${okSkills}/${totalSkills} succeeded`);
console.log(`  Agents: ${okAgents}/${totalAgents} succeeded`);

if (skillErrors > 0 || agentErrors > 0) {
  console.error(`\n✗ Build completed with ${skillErrors + agentErrors} error(s)`);
  process.exit(1);
}

console.log('\n✓ Build completed successfully');
