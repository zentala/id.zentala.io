import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

function runValidate(cwd: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((res) => {
    const cp = spawn('npx', ['tsx', '.cursor/scripts/validate.ts'], { cwd, shell: false });
    let stdout = '';
    let stderr = '';
    cp.stdout.on('data', (d) => (stdout += d.toString()));
    cp.stderr.on('data', (d) => (stderr += d.toString()));
    cp.on('close', (code) => res({ code: code ?? 0, stdout, stderr }));
  });
}

describe('validate script', () => {
  it('passes on current repo state', async () => {
    const { code } = await runValidate(process.cwd());
    expect(code).toBe(0);
  });

  it('fails when placeholder exists', async () => {
    const cwd = process.cwd();
    const tpath = path.join(cwd, '.cursor', 'tasks', 'task-999.mdc');
    await fs.writeFile(tpath, '---\nname: "X"\nnumber: 999\nstatus: idea\n---\nDescribe the task, related items, and context here.\n');
    const { code, stderr, stdout } = await runValidate(cwd);
    await fs.unlink(tpath);
    expect(code).not.toBe(0);
    expect(stderr + stdout).toMatch(/Placeholder content/);
  });

  it('fails when required sections are missing', async () => {
    const cwd = process.cwd();
    const tpath = path.join(cwd, '.cursor', 'tasks', 'task-998.mdc');
    await fs.writeFile(tpath, '---\nname: "Y"\nnumber: 998\nstatus: idea\n---\nNo required sections here.\n');
    const { code, stderr, stdout } = await runValidate(cwd);
    await fs.unlink(tpath);
    expect(code).not.toBe(0);
    expect(stderr + stdout).toMatch(/Missing required sections/);
  });
});



