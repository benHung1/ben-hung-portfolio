// Optional local build helper for transient Windows mkdir EPERM errors.
// Retries only generated directories; does not change permissions or source files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const project = fileURLToPath(new URL('../', import.meta.url));
const nativeMkdir = fs.promises.mkdir.bind(fs.promises);
fs.promises.mkdir = async function (target, options) {
  const relative = path.relative(project, path.resolve(String(target)));
  const generated = !relative.startsWith('..') && /^\.(nuxt|output)(-|\\|\/|$)/.test(relative);
  for (let attempt = 0; ; attempt++) {
    try { return await nativeMkdir(target, options); }
    catch (error) {
      if (!generated || error.code !== 'EPERM' || attempt >= 8) throw error;
      await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)));
    }
  }
};
