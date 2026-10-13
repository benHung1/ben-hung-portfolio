import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');
async function moduleFrom(path) {
  const code = ts.transpileModule(await read(path), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(
    'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  );
}
const { projectRecords, localizeProjects } = await moduleFrom(
  'app/data/projectCatalog.ts',
);
const { messages } = await moduleFrom('app/data/messages.ts');
const expected = [
  'enterprise-framework',
  'evbus-operations',
  'voice-service-console',
  'map-editor-platform',
  'main-site-components',
  'events-management',
  'curated-jobs',
  'freshman',
  'graduation-campaign',
  'campus-recruitment',
  'transfer-2025',
  'shared-foundations',
  'voting-system',
];
assert.deepEqual(
  localizeProjects('zh').map((p) => p.slug),
  expected,
);
assert.deepEqual(
  localizeProjects('en').map((p) => p.slug),
  expected,
);
assert.equal(new Set(projectRecords.map((p) => p.order)).size, expected.length);
assert.deepEqual(
  localizeProjects('en')
    .filter((p) => p.selected)
    .map((p) => p.slug),
  ['events-management', 'freshman', 'shared-foundations'],
);
const forbidden =
  /待補|候選|開發預覽|未確認|Project candidate|development preview|pending contribution/i;
assert.ok(!forbidden.test(JSON.stringify({ projectRecords, messages })));
function leaves(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && !Array.isArray(v)
      ? leaves(v, prefix + k + '.')
      : [prefix + k],
  );
}
assert.deepEqual(leaves(messages.zh), leaves(messages.en));
for (const project of projectRecords) {
  assert.deepEqual(
    Object.keys(project.content.zh).sort(),
    Object.keys(project.content.en).sort(),
  );
  if (project.cover) {
    const bytes = await readFile(
      new URL('../public' + project.cover.src, import.meta.url),
    );
    assert.ok(
      bytes.subarray(0, 2).equals(Buffer.from([0xff, 0xd8])) ||
        bytes.subarray(0, 4).toString() === 'RIFF' ||
        bytes.subarray(1, 4).toString() === 'PNG',
      'Valid local image: ' + project.slug,
    );
  }
}
const admin = projectRecords.find((p) => p.slug === 'events-management');
assert.equal(admin.liveUrl, 'https://events-manage.1111.com.tw/');
assert.equal(admin.deployment, 'live');
assert.equal(admin.requiresLogin, true);
const main = projectRecords.find((p) => p.slug === 'main-site-components');
assert.equal(main.liveUrl, 'https://www.1111.com.tw/');
assert.ok(!projectRecords.some((p) => p.slug === 'recruit-communications'));
assert.doesNotMatch(JSON.stringify(main), /YAML|WebSocket|Shadow DOM/);
for (const project of projectRecords) {
  for (const slug of project.relatedSlugs ?? [])
    assert.ok(expected.includes(slug));
}
console.log(
  'PASS: bilingual schema, exact order, selections, real image signatures, public copy and backend status.',
);

// Exercise the actual pointer composable with reduced-motion and lifecycle mocks.
let mounted,
  cleanup,
  matches = false,
  added = 0,
  removed = 0;
const styles = new Map();
const media = {
  get matches() {
    return matches;
  },
  addEventListener() {
    added++;
  },
  removeEventListener() {
    removed++;
  },
};
const context = {
  ref: () => ({
    value: {
      style: { setProperty: (k, v) => styles.set(k, v) },
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      }),
    },
  }),
  onMounted: (fn) => {
    mounted = fn;
  },
  onBeforeUnmount: (fn) => {
    cleanup = fn;
  },
  window: {
    matchMedia: (query) => {
      assert.ok(query.includes('prefers-reduced-motion: no-preference'));
      return media;
    },
  },
};
vm.createContext(context);
vm.runInContext(
  ts
    .transpileModule(await read('app/composables/useGeometry.ts'), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
      },
    })
    .outputText.replace('export function', 'function') +
    ';this.geometry=useGeometry();',
  context,
);
mounted();
context.geometry.move({ clientX: 100, clientY: 100 });
assert.equal(styles.size, 0);
matches = true;
context.geometry.move({ clientX: 100, clientY: 100 });
assert.equal(styles.get('--ry'), '9deg');
context.geometry.reset();
assert.equal(styles.get('--ry'), '0deg');
cleanup();
assert.equal(added, removed);
const css = await read('app/assets/styles/refinements.scss');
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /animation: none !important/);
assert.match(css, /transition: none !important/);
console.log(
  'PASS: reduced-motion pointer suppression, active parallax, reset and listener cleanup; CSS motion overrides present.',
);

if (process.env.PORTFOLIO_URL) {
  const base = process.env.PORTFOLIO_URL;
  for (const locale of ['zh', 'en']) {
    const paths = ['/', '/work', ...expected.map((s) => '/work/' + s)];
    for (const path of paths) {
      const response = await fetch(base + path, {
        headers: { Cookie: 'bh-language=' + locale },
      });
      assert.equal(response.status, 200, locale + ' ' + path);
      const html = await response.text();
      assert.ok(
        html.includes('lang="' + messages[locale].locale + '"'),
        'SSR locale ' + path,
      );
      assert.ok(!forbidden.test(html), 'No internal copy ' + path);
      assert.ok(
        !html.includes('chemcareer-2025') &&
          !html.includes('recruit-communications'),
        'Removed project absent: ' + path,
      );
      assert.match(response.headers.get('cache-control'), /private/);
      if (path.startsWith('/work/')) {
        const i = expected.indexOf(path.split('/').pop());
        const nav =
          html.match(/<nav class="case-navigation"[\s\S]*?<\/nav>/)?.[0] || '';
        if (i > 0) assert.ok(nav.includes('/work/' + expected[i - 1]));
        if (i < expected.length - 1)
          assert.ok(nav.includes('/work/' + expected[i + 1]));
      }
    }
  }
  const notFound = await fetch(base + '/work/does-not-exist');
  assert.equal(notFound.status, 404);
  const removed = await fetch(base + '/work/chemcareer-2025');
  assert.equal(removed.status, 404);
  for (const path of [
    '/work/recruit-communications',
    '/work/recruit-communications/',
  ]) {
    const retired = await fetch(base + path, { redirect: 'manual' });
    assert.equal(retired.status, 301, 'Retired case uses a permanent redirect');
    assert.equal(
      new URL(retired.headers.get('location'), base).pathname,
      '/work',
    );
  }
  const pdf = await fetch(base + '/洪鈺堂.pdf');
  assert.equal(pdf.status, 404);
  console.log(
    `PASS: ${(expected.length + 2) * 2} production SSR pages, both language cookies, ordered previous/next links, retired recruitment case redirects, removed chemical project 404 and no public résumé PDF.`,
  );
}
