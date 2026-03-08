import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from '../utils/chalk.js';
import { TEMPLATES } from '../utils/templates.js';
import { inferInstalledStandards, readInstalledProfile } from '../utils/standards.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../../templates');
const CWD = process.cwd();

export async function check() {
  const standardsDir = path.join(CWD, 'standards');
  const profile = readInstalledProfile(CWD);

  console.log(chalk.bold('  Checking your installed standards...\n'));

  if (!fs.existsSync(standardsDir)) {
    console.log(chalk.yellow('  No standards/ directory found.'));
    console.log(chalk.dim(`  Run ${chalk.cyan('npx @chrisadolphus/prodready init')} to get started.\n`));
    return;
  }

  const currentVersion = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8')).version;

  const selectedStandards = profile.valid && profile.selectedStandards.length > 0 ? profile.selectedStandards : inferInstalledStandards(CWD);
  const selectedSet = new Set(selectedStandards);

  if (!profile.valid && profile.reason === 'invalid-json') {
    console.log(chalk.yellow('  Warning: .prodready metadata is invalid, using inferred installed files.\n'));
  }

  let upToDate = 0;
  let outdated = 0;
  let missing = 0;

  for (const template of TEMPLATES) {
    const installedPath = path.join(standardsDir, template.filename);
    const sourcePath = path.join(TEMPLATES_DIR, template.filename);

    if (!selectedSet.has(template.id)) {
      console.log(`  ${chalk.dim('·')} ${chalk.dim(template.filename.padEnd(22))} ${chalk.dim('not selected in profile')}`);
      continue;
    }

    if (!fs.existsSync(installedPath)) {
      console.log(`  ${chalk.red('✗')} ${template.filename.padEnd(22)} ${chalk.red('missing')}`);
      missing++;
      continue;
    }

    const installedContent = fs.readFileSync(installedPath, 'utf8');
    const sourceContent = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, 'utf8') : null;

    if (sourceContent && installedContent !== sourceContent) {
      console.log(`  ${chalk.yellow('⚠')} ${template.filename.padEnd(22)} ${chalk.yellow('outdated')} ${chalk.dim('— newer version available')}`);
      outdated++;
    } else {
      console.log(`  ${chalk.green('✓')} ${template.filename.padEnd(22)} ${chalk.dim('up to date')}`);
      upToDate++;
    }
  }

  console.log('');
  console.log('  ─────────────────────────────────────────');
  console.log('');

  if (profile.version) {
    console.log(chalk.dim(`  Installed version: ${profile.version}`));
    console.log(chalk.dim(`  Current version:   ${currentVersion}`));
    if (profile.installedAt) {
      const date = new Date(profile.installedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      console.log(chalk.dim(`  Installed on:      ${date}`));
    }
    console.log('');
  }

  if (missing === 0 && outdated === 0) {
    console.log(chalk.green.bold('  ✓ Active standards profile is up to date.\n'));
  } else {
    if (outdated > 0) {
      console.log(chalk.yellow(`  ${outdated} standard${outdated === 1 ? '' : 's'} can be updated.`));
    }
    if (missing > 0) {
      console.log(chalk.red(`  ${missing} selected standard${missing === 1 ? '' : 's'} missing.`));
    }
    console.log('');
    console.log(chalk.dim(`  Run ${chalk.cyan('npx @chrisadolphus/prodready init')} to install missing standards.`));
    console.log(chalk.dim('  To update outdated files, delete them and run init again.\n'));
  }

  const selectedCount = selectedStandards.length;
  console.log(chalk.dim(`  Active profile: ${selectedCount} selected, ${TEMPLATES.length - selectedCount} excluded.\n`));
}
