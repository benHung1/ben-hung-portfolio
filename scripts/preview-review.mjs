import { spawn } from 'node:child_process';
const child = spawn(
  process.execPath,
  [
    './node_modules/@nuxt/cli/bin/nuxi.mjs',
    'dev',
    '--host',
    '127.0.0.1',
    '--port',
    '3003',
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORTFOLIO_TESTIMONIAL_PREVIEW: '1',
      PORTFOLIO_BUILD_DIR: '.nuxt-review',
    },
  },
);
child.on('exit', (code) => process.exit(code ?? 1));
