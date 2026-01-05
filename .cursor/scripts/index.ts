#!/usr/bin/env -S node --enable-source-maps

import { promises as fs } from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

type Entry = {
  file: string;
  header: Record<string, unknown>;
};

type IndexJson = {
  generatedAt: string;
  kind: 'tasks' | 'rules' | 'procedures' | 'lessons' | 'decisions';
  count: number;
  entries: Entry[];
};

async function readMdcHeader(filePath: string): Promise<Record<string, unknown>> {
  const content = await fs.readFile(filePath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  try {
    return parse(match[1]) || {};
  } catch {
    return {};
  }
}

async function listFiles(dir: string, predicate: (f: string) => boolean): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir);
    return entries.filter(predicate).map((f) => path.join(dir, f));
  } catch (err: any) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function indexDir(dir: string, outFile: string, kind: IndexJson['kind'], sortBy?: string): Promise<void> {
  const files = await listFiles(dir, (f) => f.endsWith('.mdc'));
  const entries: Entry[] = [];
  for (const file of files) {
    const header = await readMdcHeader(file);
    entries.push({ file: path.relative(process.cwd(), file), header });
  }
  if (sortBy) {
    entries.sort((a, b) => {
      const va = (a.header?.[sortBy] as string | number | undefined) ?? '';
      const vb = (b.header?.[sortBy] as string | number | undefined) ?? '';
      return String(va).localeCompare(String(vb), undefined, { numeric: true });
    });
  } else {
    entries.sort((a, b) => a.file.localeCompare(b.file));
  }
  const out: IndexJson = {
    generatedAt: new Date().toISOString(),
    kind,
    count: entries.length,
    entries,
  };
  await fs.writeFile(outFile, JSON.stringify(out, null, 2) + '\n', 'utf8');
}

type Target = 'tasks' | 'rules' | 'procedures' | 'lessons' | 'decisions' | 'all';

async function main() {
  const target = (process.argv[2] as Target) || 'all';
  const root = path.join(process.cwd(), '.cursor');
  const targets: Array<{ dir: string; out: string; sortBy?: string }> = [];

  if (target === 'all' || target === 'tasks') targets.push({ dir: path.join(root, 'tasks'), out: path.join(root, 'tasks', 'INDEX.json'), sortBy: 'number' });
  if (target === 'all' || target === 'rules') targets.push({ dir: path.join(root, 'rules'), out: path.join(root, 'rules', 'INDEX.json') });
  if (target === 'all' || target === 'procedures') targets.push({ dir: path.join(root, 'procedures'), out: path.join(root, 'procedures', 'INDEX.json') });
  if (target === 'all' || target === 'lessons') targets.push({ dir: path.join(root, 'lessons'), out: path.join(root, 'lessons', 'INDEX.json') });
  if (target === 'all' || target === 'decisions') targets.push({ dir: path.join(root, 'decisions'), out: path.join(root, 'decisions', 'INDEX.json') });

  for (const t of targets) {
    await fs.mkdir(path.dirname(t.out), { recursive: true });
    const kind = t.dir.split(path.sep).pop() as IndexJson['kind'];
    await indexDir(t.dir, t.out, kind, t.sortBy);
    // eslint-disable-next-line no-console
    console.log(`Indexed ${path.relative(process.cwd(), t.dir)} -> ${path.relative(process.cwd(), t.out)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


