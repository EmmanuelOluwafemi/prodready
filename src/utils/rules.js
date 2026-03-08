import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TEMPLATES } from './templates.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RULES_PATH = path.join(__dirname, '../../templates/rules.json');
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];

export function loadRules() {
  const data = JSON.parse(fs.readFileSync(RULES_PATH, 'utf8'));
  validateRules(data);
  return data;
}

export function validateRules(rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error('rules.json must contain a non-empty array of rules.');
  }

  const ids = new Set();
  const standards = new Set(TEMPLATES.map((template) => template.id));
  const checkIds = new Set(TEMPLATES.flatMap((template) => template.checks.map((check) => check.id)));

  for (const rule of rules) {
    if (!rule.id || typeof rule.id !== 'string') {
      throw new Error('Each rule must include a string id.');
    }

    if (ids.has(rule.id)) {
      throw new Error(`Duplicate rule id found: ${rule.id}`);
    }
    ids.add(rule.id);

    if (!standards.has(rule.standard)) {
      throw new Error(`Unknown standard in rules.json: ${rule.standard} (rule: ${rule.id})`);
    }

    if (!checkIds.has(rule.id)) {
      throw new Error(`Rule id ${rule.id} does not map to a known check id in templates.js`);
    }

    if (!VALID_SEVERITIES.includes(rule.severity)) {
      throw new Error(`Invalid severity '${rule.severity}' for rule ${rule.id}`);
    }
  }

  for (const checkId of checkIds) {
    if (!ids.has(checkId)) {
      throw new Error(`Missing rule metadata for check id: ${checkId}`);
    }
  }
}

export function severityRank(level) {
  const idx = VALID_SEVERITIES.indexOf(level);
  return idx === -1 ? -1 : idx;
}

export function normalizeSeverity(level) {
  if (!level) return null;
  const normalized = String(level).toLowerCase();
  return VALID_SEVERITIES.includes(normalized) ? normalized : null;
}

export function getValidSeverities() {
  return [...VALID_SEVERITIES];
}
