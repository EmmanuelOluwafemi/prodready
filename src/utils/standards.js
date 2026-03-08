import fs from 'fs';
import path from 'path';
import { TEMPLATES } from './templates.js';

export const CORE_STANDARD_IDS = ['SECURITY', 'PRIVACY', 'RELIABILITY', 'DOCUMENTATION'];

const TEMPLATE_BY_ID = new Map(TEMPLATES.map((template) => [template.id, template]));
const TEMPLATE_IDS = TEMPLATES.map((template) => template.id);

export function getTemplateIds() {
  return [...TEMPLATE_IDS];
}

export function getTemplateById(id) {
  return TEMPLATE_BY_ID.get(id);
}

export function normalizeStandardId(value) {
  if (!value) return null;
  const normalized = String(value)
    .trim()
    .toUpperCase()
    .replace(/\.MD$/i, '')
    .replace(/[^A-Z0-9]+/g, '-');

  if (TEMPLATE_BY_ID.has(normalized)) return normalized;

  const fromFilename = TEMPLATES.find(
    (template) => template.filename.toUpperCase().replace(/\.MD$/, '') === normalized
  );

  return fromFilename ? fromFilename.id : null;
}

export function parseStandardsCsv(input) {
  if (!input) return [];

  return String(input)
    .split(',')
    .map((part) => normalizeStandardId(part))
    .filter(Boolean);
}

export function validateStandardIds(ids) {
  const unknown = [];

  for (const id of ids) {
    if (!TEMPLATE_BY_ID.has(id)) unknown.push(id);
  }

  return unknown;
}

export function resolveTemplateSelection({ only = [], exclude = [], auto = null } = {}) {
  const onlySet = new Set(only);
  const excludeSet = new Set(exclude);
  const autoSet = auto ? new Set(auto) : null;

  if (onlySet.size > 0 && autoSet) {
    return {
      ok: false,
      error: 'Cannot use --only and --auto together.',
    };
  }

  const collisions = [...onlySet].filter((id) => excludeSet.has(id));
  if (collisions.length > 0) {
    return {
      ok: false,
      error: `Conflicting options: ${collisions.join(', ')} are present in both --only and --exclude.`,
    };
  }

  let selected = TEMPLATE_IDS;
  if (onlySet.size > 0) {
    selected = TEMPLATE_IDS.filter((id) => onlySet.has(id));
  } else if (autoSet) {
    selected = TEMPLATE_IDS.filter((id) => autoSet.has(id));
  }

  selected = selected.filter((id) => !excludeSet.has(id));

  if (selected.length === 0) {
    return {
      ok: false,
      error: 'No standards selected after applying filters.',
    };
  }

  const excluded = TEMPLATE_IDS.filter((id) => !selected.includes(id));

  return {
    ok: true,
    selected,
    excluded,
  };
}

export function readInstalledProfile(cwd) {
  const standardsDir = path.join(cwd, 'standards');
  const versionFile = path.join(standardsDir, '.prodready');

  if (!fs.existsSync(versionFile)) {
    return {
      valid: false,
      reason: 'missing',
      selectedStandards: [],
      excludedStandards: [],
      installedAt: null,
      version: null,
    };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
    const selected = Array.isArray(parsed.selectedStandards)
      ? parsed.selectedStandards.map((id) => normalizeStandardId(id)).filter(Boolean)
      : [];
    const excluded = Array.isArray(parsed.excludedStandards)
      ? parsed.excludedStandards.map((id) => normalizeStandardId(id)).filter(Boolean)
      : [];

    return {
      valid: true,
      reason: null,
      selectedStandards: [...new Set(selected)],
      excludedStandards: [...new Set(excluded)],
      installedAt: parsed.installedAt || null,
      version: parsed.version || null,
    };
  } catch {
    return {
      valid: false,
      reason: 'invalid-json',
      selectedStandards: [],
      excludedStandards: [],
      installedAt: null,
      version: null,
    };
  }
}

export function inferInstalledStandards(cwd) {
  const standardsDir = path.join(cwd, 'standards');
  if (!fs.existsSync(standardsDir)) return [];

  return TEMPLATES
    .filter((template) => fs.existsSync(path.join(standardsDir, template.filename)))
    .map((template) => template.id);
}
