import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const bin = path.join(root, 'bin/cli.js');
const fixtures = path.join(root, 'test/fixtures');

function runInFixture(fixture, args) {
  return spawnSync('node', [bin, 'audit', ...args], {
    cwd: path.join(fixtures, fixture),
    encoding: 'utf8',
  });
}

test('default audit exits 0 even with findings', () => {
  const result = runInFixture('audit-fail', []);
  assert.equal(result.status, 0);
});

test('audit fails with explicit fail-on threshold', () => {
  const result = runInFixture('audit-fail', ['--fail-on', 'high']);
  assert.equal(result.status, 1);
});

test('audit fails when require-core and profile excludes core', () => {
  const result = runInFixture('audit-missing-core', ['--require-core']);
  assert.equal(result.status, 1);
});
