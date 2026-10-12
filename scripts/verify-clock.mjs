import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(
  new URL('../app/utils/taipeiClock.ts', import.meta.url),
  'utf8',
);
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { formatTaipeiClock, untilNextMinute } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
);
const before = Date.parse('2026-10-11T15:59:59.900Z');
const after = Date.parse('2026-10-11T16:00:00.100Z');
assert.deepEqual(
  [formatTaipeiClock(before, 'zh').date, formatTaipeiClock(before, 'zh').time],
  ['2026.10.11', '23:59'],
);
assert.deepEqual(
  [formatTaipeiClock(after, 'en').date, formatTaipeiClock(after, 'en').time],
  ['12 OCT 2026', '00:00'],
);
assert.equal(
  formatTaipeiClock(Date.parse('2026-12-31T16:00:00Z'), 'zh').date,
  '2027.01.01',
);
assert.equal(untilNextMinute(before), 120);
assert.equal(untilNextMinute(after), 59920);
assert.equal(
  formatTaipeiClock(after, 'zh').time,
  formatTaipeiClock(after, 'en').time,
);
console.log(
  'PASS: Taipei timezone, midnight and year rollover, bilingual date, minute-aligned update.',
);
