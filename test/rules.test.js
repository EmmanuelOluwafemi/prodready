import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRules } from '../src/utils/rules.js';

test('rules catalog loads and includes mapped ids', () => {
  const rules = loadRules();
  assert.ok(Array.isArray(rules));
  assert.ok(rules.length > 0);
  assert.ok(rules.some((rule) => rule.id === 'no-hardcoded-secrets'));
});
