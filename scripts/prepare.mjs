import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  mkdirSync,
  writeFileSync,
  existsSync,
  cpSync,
  readdirSync,
} from 'node:fs';
import { resolve, join } from 'node:path';

const require = createRequire(import.meta.url);

// Some managed Windows installations disallow native OXC binaries.
// Use the package author's portable WebAssembly implementation in that case.
// This does not change Windows policy or load the blocked native file.
try {
  await import('oxc-minify');
} catch (error) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw error;
  const { version } = require('oxc-minify/package.json');
  const portableDir = resolve('node_modules/.cache/portfolio-oxc-portable');
  const bindingName = '@oxc-minify/binding-wasm32-wasi';
  mkdirSync(portableDir, { recursive: true });
  writeFileSync(
    join(portableDir, 'package.json'),
    JSON.stringify({
      name: 'portfolio-oxc-portable',
      private: true,
      dependencies: { [bindingName]: version },
    }),
  );
  console.info('Installing the official portable OXC WebAssembly fallback.');
  execFileSync(
    process.execPath,
    [
      npmCli,
      'install',
      '--prefix',
      portableDir,
      '--no-save',
      '--package-lock=false',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      // npm marks this portable package as cpu=wasm32; force only permits its installation.
      '--force',
    ],
    { stdio: 'inherit' },
  );
  const target = resolve('node_modules', bindingName);
  mkdirSync(resolve('node_modules/@oxc-minify'), { recursive: true });
  if (!existsSync(target)) {
    cpSync(join(portableDir, 'node_modules', bindingName), target, {
      recursive: true,
    });
    const dependencyRoot = join(portableDir, 'node_modules');
    for (const entry of readdirSync(dependencyRoot, { withFileTypes: true })) {
      if (
        !entry.isDirectory() ||
        entry.name.startsWith('.') ||
        entry.name === '@oxc-minify'
      )
        continue;
      cpSync(
        join(dependencyRoot, entry.name),
        join(target, 'node_modules', entry.name),
        { recursive: true },
      );
    }
  }
}

execFileSync(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'prepare'], {
  stdio: 'inherit',
});
