#!/usr/bin/env -S node --enable-source-maps

import { promises as fs } from 'fs';
import * as path from 'path';

type Kind = 'tasks' | 'rules' | 'procedures' | 'lessons' | 'decisions';

function parseArgs(argv: string[]): { terms: string[]; kinds: Kind[]; regex: boolean; ignore: string[] } {
  const args = argv.slice(2);
  let terms: string[] = [];
  let kinds: Kind[] = [];
  let regex = false;
  let ignore: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === '--terms' || a === '-t') && args[i + 1]) {
      terms = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if ((a === '--kinds' || a === '-k') && args[i + 1]) {
      kinds = args[++i].split(',').map((s) => s.trim() as Kind).filter(Boolean) as Kind[];
    } else if (a === '--regex') {
      regex = true;
    } else if ((a === '--ignore' || a === '-i') && args[i + 1]) {
      ignore = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  if (!terms.length) {
    console.error('Error: --terms "#term1,#term2" is required');
    process.exit(1);
  }
  if (!kinds.length) kinds = ['tasks', 'rules', 'procedures', 'lessons', 'decisions'];
  return { terms, kinds, regex, ignore };
}

function globToRegExp(glob: string): RegExp {
  // Simple glob: ** -> .*, * -> [^/]*, ? -> .
  const escaped = glob
    .replace(/[.+^${}()|\[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '.');
  return new RegExp('^' + escaped + '$');
}

async function listFilesRecursive(rootDir: string, ignoreGlobs: string[]): Promise<string[]> {
  const results: string[] = [];
  const queue: string[] = [rootDir];
  const ignores = ignoreGlobs.map(globToRegExp);
  while (queue.length) {
    const dir = queue.pop() as string;
    let entries: string[] = [];
    try {
      entries = await fs.readdir(dir);
    } catch (err: any) {
      if (err.code === 'ENOENT') continue;
      throw err;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry);
      const rel = path.relative(process.cwd(), full).replace(/\\/g, '/');
      if (ignores.some((re) => re.test(rel))) continue;
      const stat = await fs.stat(full);
      if (stat.isDirectory()) {
        queue.push(full);
      } else if (entry.endsWith('.mdc')) {
        results.push(full);
      }
    }
  }
  return results;
}

async function searchInFile(filePath: string, terms: string[], useRegex: boolean): Promise<Record<string, string>> {
  const res: Record<string, string> = {};
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split(/\r?\n/g);
  const regexes = useRegex ? terms.map((p) => new RegExp(p, 'i')) : [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = useRegex ? regexes.some((r) => r.test(line)) : terms.some((t) => line.includes(t));
    if (match) {
      res[String(i + 1)] = line;
    }
  }
  return res;
}

async function main() {
  const { terms, kinds, regex, ignore } = parseArgs(process.argv);
  const root = process.cwd();
  const result: Record<string, Record<string, string>> = {};
  for (const k of kinds) {
    const dir = path.join(root, '.cursor', k);
    const files = await listFilesRecursive(dir, ignore);
    for (const f of files) {
      const matches = await searchInFile(f, terms, regex);
      if (Object.keys(matches).length) {
        result[path.relative(root, f)] = matches;
      }
    }
  }
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});


