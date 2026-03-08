import fs from 'fs';
import path from 'path';
import { CORE_STANDARD_IDS, getTemplateIds } from './standards.js';

const BASE_SIGNALS = {
  AUTHENTICATION: [/next-auth/i, /passport/i, /auth0/i, /clerk/i, /firebase\/auth/i, /supabase\/auth/i],
  PAYMENTS: [/stripe/i, /paypal/i, /braintree/i, /adyen/i, /checkout/i],
  EMAIL: [/resend/i, /sendgrid/i, /postmark/i, /nodemailer/i, /mailgun/i],
  'API-DESIGN': [/express/i, /fastify/i, /koa/i, /next/i, /fastapi/i, /django/i, /flask/i],
  ACCESSIBILITY: [/react/i, /next/i, /vue/i, /svelte/i],
  'UX-STATES': [/react/i, /next/i, /vue/i, /svelte/i],
};

function readText(filePath) {
  if (!fs.existsSync(filePath)) return '';
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function findFiles(dir, matches = [], depth = 0) {
  if (depth > 4 || !fs.existsSync(dir)) return matches;

  const ignore = new Set(['.git', 'node_modules', 'dist', 'build', '.next', '.venv', '__pycache__']);
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignore.has(entry.name)) {
        findFiles(path.join(dir, entry.name), matches, depth + 1);
      }
      continue;
    }

    const lower = entry.name.toLowerCase();
    if (lower.endsWith('.js') || lower.endsWith('.ts') || lower.endsWith('.tsx') || lower.endsWith('.jsx') || lower.endsWith('.py') || lower.endsWith('.md')) {
      matches.push(path.join(dir, entry.name));
    }
  }

  return matches;
}

function scoreFromPatterns(content, patterns) {
  let score = 0;
  for (const pattern of patterns) {
    if (pattern.test(content)) score++;
  }
  return score;
}

export function detectProjectProfile(cwd) {
  const templateIds = getTemplateIds();
  const signals = new Map();
  const reasons = {};

  for (const id of templateIds) {
    signals.set(id, 0);
    reasons[id] = [];
  }

  const packageJson = readText(path.join(cwd, 'package.json'));
  const requirements = readText(path.join(cwd, 'requirements.txt'));
  const pyproject = readText(path.join(cwd, 'pyproject.toml'));
  const manifestBlob = [packageJson, requirements, pyproject].join('\n').toLowerCase();

  for (const [standard, patterns] of Object.entries(BASE_SIGNALS)) {
    const score = scoreFromPatterns(manifestBlob, patterns);
    if (score > 0) {
      signals.set(standard, signals.get(standard) + score * 2);
      reasons[standard].push('Detected supporting dependencies in project manifest(s).');
    }
  }

  const files = findFiles(cwd).sort();
  const fileNamesBlob = files.map((file) => path.relative(cwd, file).toLowerCase()).join('\n');

  if (/auth|signin|login|rbac|session/.test(fileNamesBlob)) {
    signals.set('AUTHENTICATION', signals.get('AUTHENTICATION') + 2);
    reasons.AUTHENTICATION.push('Found auth-related file or route names.');
  }

  if (/payment|billing|checkout|webhook/.test(fileNamesBlob)) {
    signals.set('PAYMENTS', signals.get('PAYMENTS') + 2);
    reasons.PAYMENTS.push('Found payment-related file or route names.');
  }

  if (/mail|email|notification/.test(fileNamesBlob)) {
    signals.set('EMAIL', signals.get('EMAIL') + 2);
    reasons.EMAIL.push('Found email-related file or route names.');
  }

  if (/api\//.test(fileNamesBlob)) {
    signals.set('API-DESIGN', signals.get('API-DESIGN') + 1);
    reasons['API-DESIGN'].push('Found API route directory structure.');
  }

  const selected = new Set(CORE_STANDARD_IDS);

  for (const [standard, score] of [...signals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (CORE_STANDARD_IDS.includes(standard)) continue;
    if (score >= 2) selected.add(standard);
  }

  if (selected.has('AUTHENTICATION') && !selected.has('EMAIL')) {
    selected.add('EMAIL');
    reasons.EMAIL.push('Selected as supporting standard for authentication flows.');
  }

  const selectedStandards = templateIds.filter((id) => selected.has(id));

  return {
    selectedStandards,
    excludedStandards: templateIds.filter((id) => !selected.has(id)),
    reasons,
  };
}
