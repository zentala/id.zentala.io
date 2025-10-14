#!/usr/bin/env -S node --enable-source-maps

import { promises as fs } from 'fs';
import * as path from 'path';

type NewTaskOptions = {
  name: string;
  type?: string;
  status?: string;
  created?: string;
};

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

function pad3(n: number): string {
  return n.toString().padStart(3, '0');
}

async function nextTaskNumber(tasksDir: string): Promise<number> {
  try {
    const entries = await fs.readdir(tasksDir);
    const nums = entries
      .map((f) => (f.match(/^task-(\d{3})\.mdc$/)?.[1] ?? null))
      .filter((x): x is string => Boolean(x))
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isFinite(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return max + 1;
  } catch (err: any) {
    if (err.code === 'ENOENT') return 1;
    throw err;
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildHeader(opts: NewTaskOptions, number: number): string {
  const created = opts.created ?? todayISO();
  const status = opts.status ?? 'backlog';
  const type = opts.type ?? 'chore';
  return [
    '---',
    `name: "${opts.name.replace(/"/g, '\\"')}"`,
    `number: ${pad3(number)}`,
    `status: ${status}`,
    `type: ${type}`,
    `created: ${created}`,
    '---',
    '',
  ].join('\n');
}

async function createTask(opts: NewTaskOptions): Promise<string> {
  const root = process.cwd();
  const tasksDir = path.join(root, '.cursor', 'tasks');
  await ensureDir(tasksDir);
  const num = await nextTaskNumber(tasksDir);
  const fileName = `task-${pad3(num)}.mdc`;
  const filePath = path.join(tasksDir, fileName);

  const header = buildHeader(opts, num);
  const body = 'Describe the task, related items, and context here.';
  await fs.writeFile(filePath, `${header}${body}\n`, { encoding: 'utf8' });
  return filePath;
}

function parseArgs(argv: string[]): NewTaskOptions {
  const args = argv.slice(2);
  let name = '';
  let type: string | undefined;
  let status: string | undefined;
  let created: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === '--name' || a === '-n') && args[i + 1]) {
      name = args[++i];
    } else if ((a === '--type' || a === '-t') && args[i + 1]) {
      type = args[++i];
    } else if ((a === '--status' || a === '-s') && args[i + 1]) {
      status = args[++i];
    } else if (a === '--created' && args[i + 1]) {
      created = args[++i];
    }
  }

  if (!name) {
    console.error('Error: --name "Task title" is required');
    process.exit(1);
  }
  return { name, type, status, created };
}

async function main() {
  const opts = parseArgs(process.argv);
  const file = await createTask(opts);
  console.log(file);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


