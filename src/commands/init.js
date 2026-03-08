import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from '../utils/chalk.js';
import { detectProjectProfile } from '../utils/detect-project-profile.js';
import { getTemplateById, getTemplateIds, normalizeStandardId, resolveTemplateSelection } from '../utils/standards.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../../templates');
const CWD = process.cwd();

function normalizeSelectionOptions(options) {
  const onlyTokens = String(options.only || '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
  const excludeTokens = String(options.exclude || '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  const only = [];
  const exclude = [];
  const unknown = [];

  for (const token of onlyTokens) {
    const normalized = normalizeStandardId(token);
    if (!normalized) unknown.push(token);
    else only.push(normalized);
  }

  for (const token of excludeTokens) {
    const normalized = normalizeStandardId(token);
    if (!normalized) unknown.push(token);
    else exclude.push(normalized);
  }

  if (unknown.length > 0) {
    return {
      ok: false,
      error: `Unknown standard id(s): ${[...new Set(unknown)].join(', ')}. Valid ids: ${getTemplateIds().join(', ')}`,
    };
  }

  return {
    ok: true,
    only,
    exclude,
  };
}

export async function init(options = {}) {
  const targetDir = path.join(CWD, 'standards');

  console.log(chalk.bold('  Installing ProdReady standards...\n'));

  const normalized = normalizeSelectionOptions(options);
  if (!normalized.ok) {
    console.error(chalk.red(`  ${normalized.error}\n`));
    process.exitCode = 1;
    return;
  }

  const autoProfile = options.auto ? detectProjectProfile(CWD) : null;
  const selection = resolveTemplateSelection({
    only: normalized.only,
    exclude: normalized.exclude,
    auto: autoProfile ? autoProfile.selectedStandards : null,
  });

  if (!selection.ok) {
    console.error(chalk.red(`  ${selection.error}\n`));
    process.exitCode = 1;
    return;
  }

  const selectedTemplates = selection.selected.map((id) => getTemplateById(id));

  if (autoProfile) {
    console.log(chalk.bold('  Auto-detected standards profile:'));
    console.log(chalk.dim(`  Selected: ${selection.selected.join(', ')}`));
    if (selection.excluded.length > 0) {
      console.log(chalk.dim(`  Excluded: ${selection.excluded.join(', ')}`));
    }
    console.log('');
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(chalk.dim('  Created standards/ directory\n'));
  }

  const version = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8')).version;

  fs.writeFileSync(
    path.join(targetDir, '.prodready'),
    JSON.stringify(
      {
        version,
        installedAt: new Date().toISOString(),
        selectedStandards: selection.selected,
        excludedStandards: selection.excluded,
        mode: options.auto ? 'auto' : normalized.only.length > 0 ? 'only' : normalized.exclude.length > 0 ? 'exclude' : 'all',
      },
      null,
      2
    )
  );

  let installed = 0;
  let skipped = 0;

  for (const template of selectedTemplates) {
    const src = path.join(TEMPLATES_DIR, template.filename);
    const dest = path.join(targetDir, template.filename);

    if (!fs.existsSync(src)) {
      console.log(chalk.yellow(`  ⚠ Template not found: ${template.filename}`));
      continue;
    }

    if (fs.existsSync(dest)) {
      console.log(`  ${chalk.dim('↓')} ${chalk.dim(template.filename)} ${chalk.dim('(already exists, skipped)')}`);
      skipped++;
      continue;
    }

    fs.copyFileSync(src, dest);
    console.log(`  ${chalk.green('✓')} ${chalk.white(template.filename)} ${chalk.dim('— ' + template.title)}`);
    installed++;
  }

  console.log('');
  console.log('  ─────────────────────────────────────────');
  console.log('');

  if (installed > 0) {
    console.log(chalk.green.bold(`  ✓ ${installed} standard${installed === 1 ? '' : 's'} installed to standards/`));
  }
  if (skipped > 0) {
    console.log(chalk.dim(`  ${skipped} already existed and were skipped`));
  }

  if (selection.excluded.length > 0) {
    console.log(chalk.dim(`  Profile excludes: ${selection.excluded.join(', ')}`));
  }

  console.log('');
  console.log(chalk.bold('  What to do next:'));
  console.log('');
  console.log(`  1. Review the files in ${chalk.cyan('standards/')}`);
  console.log('  2. Share them with your team and AI coding agents');
  console.log('  3. In Cursor or Claude Code, reference them in your system prompt:');
  console.log('');
  console.log(chalk.dim('     "Follow all rules in the standards/ directory of this project"'));
  console.log('');
  console.log(`  4. Run ${chalk.cyan('npx @chrisadolphus/prodready audit')} to check your compliance score`);
  console.log('');
  console.log(chalk.dim('  Tip: Commit the standards/ directory to version control'));
  console.log(chalk.dim('  so your whole team and all AI agents follow the same rules.'));
  console.log('');
}
