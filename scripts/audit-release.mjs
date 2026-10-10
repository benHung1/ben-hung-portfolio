import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
const recordsModule = ts.transpileModule(
  await readFile(
    new URL('../content/testimonials.ts', import.meta.url),
    'utf8',
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { testimonialRecords } = await import(
  'data:text/javascript;base64,' + Buffer.from(recordsModule).toString('base64')
);
const privateCopy = testimonialRecords
  .flatMap((entry) => [
    ...(!entry.approvedForPublic ? [entry.quoteZh, entry.quoteEn] : []),
    entry.source.note.zh,
    entry.source.note.en,
  ])
  .map((text) => text.slice(0, 60));
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symlink in release');
    if (entry.isDirectory()) await walk(file);
    else files.push(file);
  }
}
await walk(process.argv[2] || '.output');
const forbidden =
  /(?:^|[\\/])(?:editorial|private|\.env(?:\..*)?|\.git|verification[^\\/]*)(?:[\\/]|$)|\.(?:pdf|pem|key|map)$/i;
for (const file of files) {
  if (forbidden.test(file))
    throw new Error('Private or unsupported release file: ' + file);
  if (/\.(?:m?js|json|html|css|txt)$/i.test(file)) {
    const content = await readFile(file, 'utf8');
    const decoded = content.replace(/\\u([0-9a-f]{4})/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );
    if (privateCopy.some((text) => decoded.includes(text)))
      throw new Error(
        'Unapproved testimonial or review metadata in release: ' + file,
      );
    if (
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-[A-Za-z0-9_-]{32,}|AKIA[0-9A-Z]{16}|github_pat_[A-Za-z0-9_]{30,}|ghp_[A-Za-z0-9]{30,}/.test(
        content,
      )
    )
      throw new Error('Credential-like material in release: ' + file);
  }
}
console.log(
  'PASS: release audit — ' +
    files.length +
    ' runtime/assets files; no unapproved testimonials, review metadata, PDF, editorial/private files, .env, keys, source maps or credential signatures.',
);
