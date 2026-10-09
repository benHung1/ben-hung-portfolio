import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// Nitro detects Vercel on the host. NITRO_PRESET=vercel also permits a local
// check of the exact serverless layout without logging in or publishing.
const preload = process.platform === 'win32'
  ? ['--import', './scripts/windows-build-retry.mjs']
  : [];
const result = spawnSync(process.execPath, [
  ...preload, './node_modules/@nuxt/cli/bin/nuxi.mjs', 'build',
], { stdio: 'inherit', env: process.env });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const vercel = process.env.NITRO_PRESET === 'vercel' || process.env.VERCEL === '1';
const output = vercel ? '.vercel/output' : (process.env.PORTFOLIO_OUTPUT_DIR || '.output');
if (!existsSync(output)) throw new Error('Build output is missing: ' + output);
const audit = spawnSync(process.execPath, ['scripts/audit-release.mjs', output], {
  stdio: 'inherit',
});
if (audit.error) throw audit.error;
process.exit(audit.status ?? 1);
