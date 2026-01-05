import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';

function runRoute(args: string[], stdinData?: string): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((res) => {
    const cp = spawn('npx', ['tsx', '.cursor/scripts/router.ts', ...args], { shell: false });
    let stdout = '';
    let stderr = '';
    if (stdinData) {
      cp.stdin.write(stdinData);
      cp.stdin.end();
    }
    cp.stdout.on('data', (d) => (stdout += d.toString()));
    cp.stderr.on('data', (d) => (stderr += d.toString()));
    cp.on('close', (code) => res({ code: code ?? 0, stdout, stderr }));
  });
}

function parseErr(out: string): any {
  try {
    return JSON.parse(out);
  } catch {
    return null;
  }
}

describe('router (SCL-1)', () => {
  it('returns SCL001 on unknown command', async () => {
    const { code, stderr } = await runRoute(['--shortcode', '[script:unknown]']);
    expect(code).not.toBe(0);
    const e = parseErr(stderr);
    expect(e?.error?.code).toBe('SCL001');
  });

  it('returns SCL003 when resolve missing id', async () => {
    const { code, stderr } = await runRoute(['--shortcode', '[script:resolve]', '--payload', '{"kind":"tasks"}']);
    expect(code).not.toBe(0);
    const e = parseErr(stderr);
    expect(e?.error?.code).toBe('SCL003');
  });

  it('returns SCL002 on unsupported kind', async () => {
    const { code, stderr } = await runRoute(['--shortcode', '[script:resolve]', '--payload', '{"kind":"foo","id":"010"}']);
    expect(code).not.toBe(0);
    const e = parseErr(stderr);
    expect(e?.error?.code).toBe('SCL002');
  });

  it('returns SCL005 on unsupported version', async () => {
    const { code, stderr } = await runRoute(['--shortcode', '[script:resolve|v=999]', '--payload', '{"kind":"tasks","id":"010"}']);
    expect(code).not.toBe(0);
    const e = parseErr(stderr);
    expect(e?.error?.code).toBe('SCL005');
  });

  it('routes resolve with inline payload (stdin) successfully', async () => {
    const payload = '{"kind":"tasks","id":"010"}';
    const { code } = await runRoute(['--shortcode', '[script:resolve]', '--stdin'], payload);
    expect(code).toBe(0);
  });
});



