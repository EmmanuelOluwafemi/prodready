import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { BIN_PATH, FIXTURES_DIR } from './test-paths.js';

function runInFixture(fixture, args) {
  const result = spawnSync('node', [BIN_PATH, 'audit', ...args], {
    cwd: path.join(FIXTURES_DIR, fixture),
    encoding: 'utf8',
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

test('default audit exits 0 even with findings', () => {
  const result = runInFixture('audit-fail', []);
  assert.equal(result.status, 0, `Expected exit 0, got ${result.status}. stderr: ${result.stderr}`);
});

test('audit fails with explicit fail-on threshold', () => {
  const result = runInFixture('audit-fail', ['--fail-on', 'high']);
  assert.equal(result.status, 1, `Expected exit 1, got ${result.status}. stderr: ${result.stderr}`);
});

test('audit fails when require-core and profile excludes core', () => {
  const standardsDir = path.join(FIXTURES_DIR, 'audit-missing-core', 'standards');
  fs.mkdirSync(standardsDir, { recursive: true });
  fs.writeFileSync(
    path.join(standardsDir, '.prodready'),
    JSON.stringify(
      {
        version: '1.0.1',
        installedAt: '2026-03-08T00:00:00.000Z',
        selectedStandards: ['EMAIL'],
        excludedStandards: [
          'SECURITY',
          'PRIVACY',
          'AUTHENTICATION',
          'PAYMENTS',
          'RELIABILITY',
          'ACCESSIBILITY',
          'UX-STATES',
          'API-DESIGN',
          'DOCUMENTATION',
        ],
        mode: 'only',
      },
      null,
      2
    )
  );

  const result = runInFixture('audit-missing-core', ['--require-core']);
  assert.equal(result.status, 1, `Expected exit 1, got ${result.status}. stderr: ${result.stderr}`);
});
