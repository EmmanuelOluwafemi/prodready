import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStandardsCsv, resolveTemplateSelection } from '../src/utils/standards.js';

test('parseStandardsCsv normalizes names', () => {
  const ids = parseStandardsCsv('security,payments.md,api design');
  assert.deepEqual(ids, ['SECURITY', 'PAYMENTS', 'API-DESIGN']);
});

test('resolveTemplateSelection rejects collisions', () => {
  const result = resolveTemplateSelection({ only: ['SECURITY'], exclude: ['SECURITY'] });
  assert.equal(result.ok, false);
});

test('resolveTemplateSelection filters excludes', () => {
  const result = resolveTemplateSelection({ exclude: ['PAYMENTS', 'AUTHENTICATION'] });
  assert.equal(result.ok, true);
  assert.equal(result.selected.includes('PAYMENTS'), false);
  assert.equal(result.selected.includes('AUTHENTICATION'), false);
});
