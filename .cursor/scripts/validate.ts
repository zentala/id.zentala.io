#!/usr/bin/env -S node --enable-source-maps

import { promises as fs } from 'fs';
import * as path from 'path';

type IndexFile = {
  generatedAt: string;
  kind: 'tasks' | 'rules' | 'procedures' | 'lessons' | 'decisions';
  count: number;
  entries: Array<{ file: string; header: Record<string, unknown> }>;
};

function assert(cond: unknown, message: string): void {
  if (!cond) throw new Error(message);
}

async function readJson(filePath: string): Promise<any> {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

function validateIndexShape(idx: any): asserts idx is IndexFile {
  assert(typeof idx === 'object' && idx !== null, 'Index not an object');
  assert(typeof idx.generatedAt === 'string', 'generatedAt missing');
  assert(['tasks', 'rules', 'procedures', 'lessons', 'decisions'].includes(idx.kind), 'invalid kind');
  assert(typeof idx.count === 'number', 'count missing');
  assert(Array.isArray(idx.entries), 'entries missing');
  for (const e of idx.entries) {
    assert(typeof e.file === 'string', 'entry.file missing');
    assert(typeof e.header === 'object' && e.header !== null, 'entry.header missing');
  }
}

function hasPlaceholderBody(content: string): boolean {
  return /Describe the task, related items, and context here\./i.test(content);
}

function hasRequiredSections(content: string): boolean {
  // Minimal DoR-style checks: presence of key section headers/keywords
  const needed = [
    /Problem\s*:/i,
    /Business value\s*:/i,
    /Acceptance criteria\s*:/i,
    /Scope\s*:/i,
  ];
  return needed.every((re) => re.test(content));
}

async function validateTasksNoPlaceholders(root: string): Promise<void> {
  const tasksDir = path.join(root, '.cursor', 'tasks');
  let entries: string[] = [];
  try {
    entries = await fs.readdir(tasksDir);
  } catch (err: any) {
    if (err.code === 'ENOENT') return; // no tasks dir yet
    throw err;
  }
  const bad: string[] = [];
  const missing: string[] = [];
  for (const f of entries) {
    if (!/^task-\d{3}\.mdc$/.test(f)) continue;
    const p = path.join(tasksDir, f);
    const content = await fs.readFile(p, 'utf8');
    if (hasPlaceholderBody(content)) bad.push(p);
    if (!hasRequiredSections(content)) missing.push(p);
  }
  if (bad.length || missing.length) {
    const lines: string[] = [];
    if (bad.length) lines.push(`Placeholder content found in tasks:\n- ${bad.join('\n- ')}`);
    if (missing.length) lines.push(`Missing required sections (Problem, Business value, Acceptance criteria, Scope):\n- ${missing.join('\n- ')}`);
    const msg = lines.join('\n\n');
    throw new Error(msg);
  }
}

async function main() {
  const root = process.cwd();
  const indices = [
    path.join(root, '.cursor', 'tasks', 'INDEX.json'),
    path.join(root, '.cursor', 'rules', 'INDEX.json'),
    path.join(root, '.cursor', 'procedures', 'INDEX.json'),
    path.join(root, '.cursor', 'lessons', 'INDEX.json'),
    path.join(root, '.cursor', 'decisions', 'INDEX.json'),
  ];
  for (const f of indices) {
    try {
      const idx = await readJson(f);
      validateIndexShape(idx);
    } catch (err: any) {
      if (err.code === 'ENOENT') continue;
      throw new Error(`Invalid index ${path.relative(root, f)}: ${err.message}`);
    }
  }
  await validateTasksNoPlaceholders(root);
  // eslint-disable-next-line no-console
  console.log('Validation passed.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});


