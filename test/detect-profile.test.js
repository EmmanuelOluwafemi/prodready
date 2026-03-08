import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { detectProjectProfile } from '../src/utils/detect-project-profile.js';
import { FIXTURES_DIR } from './test-paths.js';

test('auto profile excludes auth/payments when not detected', () => {
  const profile = detectProjectProfile(path.join(FIXTURES_DIR, 'no-auth-payments'));
  assert.equal(profile.selectedStandards.includes('AUTHENTICATION'), false);
  assert.equal(profile.selectedStandards.includes('PAYMENTS'), false);
});

test('auto profile includes payments when detected', () => {
  const profile = detectProjectProfile(path.join(FIXTURES_DIR, 'with-payments'));
  assert.equal(profile.selectedStandards.includes('PAYMENTS'), true);
});

test('auto profile includes auth when detected', () => {
  const profile = detectProjectProfile(path.join(FIXTURES_DIR, 'with-auth'));
  assert.equal(profile.selectedStandards.includes('AUTHENTICATION'), true);
});
