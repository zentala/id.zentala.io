import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';

function runResolve(args: string[], cwd: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((res) => {
    const p = spawn('node', ['-e', "import('tsx').then(()=>{})"], { stdio: 'ignore' });
    p.on('exit', () => {
      const cp = spawn('npx', ['tsx', '.cursor/scripts/resolve.ts', ...args], { cwd, shell: false });
      let stdout = '';
      let stderr = '';
      cp.stdout.on('data', (d) => (stdout += d.toString()));
      cp.stderr.on('data', (d) => (stderr += d.toString()));
      cp.on('close', (code) => res({ code: code ?? 0, stdout, stderr }));
    });
  });
}

describe('resolve CLI', () => {
  it('resolves task by positional args', async () => {
    const cwd = process.cwd();
    const r = await runResolve(['tasks', '010'], cwd);
    expect(r.code).toBe(0);
    expect(r.stdout.trim()).toContain(path.join('.cursor', 'tasks', 'task-010.mdc'));
  });

  it('resolves task by flags', async () => {
    const cwd = process.cwd();
    const r = await runResolve(['--kind', 'tasks', '--id', '010'], cwd);
    expect(r.code).toBe(0);
    expect(r.stdout.trim()).toContain(path.join('.cursor', 'tasks', 'task-010.mdc'));
  });

  it('fails with usage when missing args', async () => {
    const cwd = process.cwd();
    const r = await runResolve([], cwd);
    expect(r.code).not.toBe(0);
    expect(r.stderr + r.stdout).toMatch(/Usage: resolve/);
  });
});



