#!/usr/bin/env -S node --enable-source-maps

import { spawn } from 'child_process';
import * as path from 'path';
import { existsSync } from 'fs';

type Command = 'resolve' | 'search:terms' | 'index' | 'validate';

function parseArgs(argv: string[]): { shortcode: string; payload?: string; stdin: boolean } {
  const args = argv.slice(2);
  let shortcode = '';
  let payload: string | undefined;
  let stdin = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--shortcode' && args[i + 1]) shortcode = args[++i];
    else if (a === '--payload' && args[i + 1]) payload = args[++i];
    else if (a === '--stdin') stdin = true;
  }
  // Fallback for positional usage: `[script:...]` then JSON/base64 payload
  if (!shortcode && args[0] && /^\[script:/.test(args[0])) {
    shortcode = args[0];
    if (!payload && args[1] && !args[1].startsWith('-')) payload = args[1];
  }
  if (!shortcode) {
    console.error('Error: --shortcode is required');
    process.exit(1);
  }
  return { shortcode, payload, stdin };
}

function decodePayload(shortcode: string, payload?: string, stdinBuf?: string): any {
  // Handle [script:command|b64] form
  const isB64 = /\[script:[^\]]+\|b64\]/.test(shortcode);
  if (isB64) {
    const b64 = payload || '';
    try {
      return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    } catch {
      console.error('Invalid base64 payload');
      process.exit(1);
    }
  }
  if (stdinBuf) {
    try {
      return JSON.parse(stdinBuf);
    } catch {
      console.error('Invalid STDIN JSON payload');
      process.exit(1);
    }
  }
  if (payload) {
    try {
      return JSON.parse(payload);
    } catch {
      console.error('Invalid JSON payload');
      process.exit(1);
    }
  }
  return {};
}

function resolveBin(bin: string): string {
  const ext = process.platform === 'win32' ? '.cmd' : '';
  const local = path.join(process.cwd(), 'node_modules', '.bin', bin + ext);
  if (existsSync(local)) return local;
  return bin + ext;
}

function run(_cmd: string, args: string[]): Promise<number> {
  return new Promise((res) => {
    const tsxBin = resolveBin('tsx');
    const cp = spawn(tsxBin, args, { stdio: 'inherit' });
    cp.on('close', (code) => res(code ?? 0));
  });
}

function err(code: string, message: string): number {
  console.error(JSON.stringify({ error: { code, message } }));
  return 1;
}

async function route(shortcode: string, payload: any): Promise<number> {
  // Extract command and optional subcommand
  const m = shortcode.match(/^\[script:([^\]|]+)(?:\|b64)?(?:\|v=(\d+))?\]/);
  if (!m) {
    return err('SCL004', 'invalid shortcode format, expected [script:<command>]');
  }
  const command = m[1] as Command | string;
  const version = m[2] ? Number(m[2]) : 1;
  if (version !== 1) return err('SCL005', `unsupported version v=${version}`);

  switch (command) {
    case 'resolve': {
      const kind = String(payload.kind || 'tasks');
      const id = String(payload.id || '');
      if (!id) return err('SCL003', 'missing field: id');
      if (!['tasks', 'rules', 'procedures', 'lessons', 'decisions'].includes(kind)) return err('SCL002', `unsupported kind: ${kind}`);
      return run('resolve', ['.cursor/scripts/resolve.ts', kind, id]);
    }
    case 'search:terms': {
      const terms = String(payload.terms || '').trim();
      const kinds = String(payload.kinds || '').trim();
      if (!terms) return err('SCL003', 'missing field: terms');
      const args = ['.cursor/scripts/search-terms.ts'];
      args.push('--terms', terms);
      if (kinds) args.push('--kinds', kinds);
      if (payload.regex) args.push('--regex');
      if (payload.ignore) args.push('--ignore', String(payload.ignore));
      return run('search:terms', args);
    }
    case 'index': {
      const kind = String(payload.kind || 'all');
      const map: Record<string, string> = {
        tasks: '.cursor/scripts/index.ts tasks',
        rules: '.cursor/scripts/index.ts rules',
        procedures: '.cursor/scripts/index.ts procedures',
        lessons: '.cursor/scripts/index.ts lessons',
        decisions: '.cursor/scripts/index.ts decisions',
        all: '.cursor/scripts/index.ts all',
      };
      const entry = map[kind];
      if (!entry) return err('SCL002', `unsupported kind: ${kind}`);
      const [script, ...rest] = entry.split(' ');
      return run('index', [script, ...rest]);
    }
    case 'validate': {
      return run('validate', ['.cursor/scripts/validate.ts']);
    }
    default:
      return err('SCL001', `unknown command: ${String(command)}`);
  }
}

async function main() {
  const { shortcode, payload, stdin } = parseArgs(process.argv);
  let stdinBuf: string | undefined;
  if (stdin) {
    stdinBuf = await new Promise<string>((resolve) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (c) => (data += c));
      process.stdin.on('end', () => resolve(data));
    });
  }
  const pl = decodePayload(shortcode, payload, stdinBuf);
  const code = await route(shortcode, pl);
  process.exit(code);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});


