import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCliArgs } from '../src/utils/args.js';

test('parseCliArgs parses long flags and values', () => {
  const parsed = parseCliArgs(['audit', '--fail-on', 'high', '--min-score=85', '--require-core']);
  assert.equal(parsed.command, 'audit');
  assert.equal(parsed.options['fail-on'], 'high');
  assert.equal(parsed.options['min-score'], '85');
  assert.equal(parsed.options['require-core'], true);
});

test('parseCliArgs parses short flags', () => {
  const parsed = parseCliArgs(['init', '-y']);
  assert.equal(parsed.options.yes, true);
});
