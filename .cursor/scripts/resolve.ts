#!/usr/bin/env -S node --enable-source-maps

import { promises as fs } from 'fs';
import * as path from 'path';

type Kind = 'tasks' | 'rules' | 'procedures' | 'lessons' | 'decisions';

function parseArgs(argv: string[]): { kind: Kind; id: string } {
  const args = argv.slice(2);
  let kind: Kind | undefined;
  let id = '';
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--kind' && args[i + 1]) {
      const v = args[++i] as Kind;
      if (!['tasks', 'rules', 'procedures', 'lessons', 'decisions'].includes(v)) {
        console.error('Invalid --kind. Use one of tasks|rules|procedures|lessons|decisions');
        process.exit(1);
      }
      kind = v;
    } else if (a === '--id' && args[i + 1]) {
      id = args[++i];
    }
  }
  // Fallback: support positional usage: `<kind> <id>`
  if (!kind && args[0] && ['tasks', 'rules', 'procedures', 'lessons', 'decisions'].includes(args[0] as Kind)) {
    kind = args[0] as Kind;
    if (args[1]) id = args[1];
  }
  if (!kind) {
    console.error('Usage: resolve --kind <tasks|rules|procedures|lessons|decisions> --id <identifier>');
    console.error('       resolve <kind> <identifier>');
    process.exit(1);
  }
  if (!id) {
    console.error('Error: <identifier> (or --id) is required');
    process.exit(1);
  }
  return { kind, id };
}

async function readIndex(root: string, kind: Kind): Promise<any> {
  const idxPath = path.join(root, '.cursor', kind, 'INDEX.json');
  const content = await fs.readFile(idxPath, 'utf8');
  return JSON.parse(content);
}

function resolveFromIndex(index: any, kind: Kind, id: string, cwd: string): string[] {
  // For tasks: id may be numeric like 010 or string task:010
  if (kind === 'tasks') {
    const num = id.match(/^task:(\d{3})$/) ? RegExp.$1 : id.match(/^(\d{3})$/) ? RegExp.$1 : null;
    if (num) {
      const target = `.cursor/tasks/task-${num}.mdc`;
      return [path.relative(cwd, path.join(cwd, target))];
    }
  }
  // For other kinds, match by file basename or header name
  const results: string[] = [];
  for (const e of index.entries as Array<{ file: string; header: Record<string, unknown> }>) {
    const fileBase = path.basename(e.file).toLowerCase();
    const headerName = String((e.header?.name as string) || '').toLowerCase();
    if (fileBase.includes(id.toLowerCase()) || headerName.includes(id.toLowerCase())) {
      results.push(path.relative(cwd, path.join(cwd, e.file)));
    }
  }
  return results;
}

async function main() {
  const { kind, id } = parseArgs(process.argv);
  const root = process.cwd();
  const idx = await readIndex(root, kind);
  const paths = resolveFromIndex(idx, kind, id, root);
  if (!paths.length) {
    console.error('No matches. Consider running index first.');
    process.exit(2);
  }
  for (const p of paths) console.log(p);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});


