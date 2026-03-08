import fs from 'fs';
import path from 'path';
import chalk from '../utils/chalk.js';
import { TEMPLATES } from '../utils/templates.js';
import { readInstalledProfile } from '../utils/standards.js';

const CWD = process.cwd();

export async function list() {
  const standardsDir = path.join(CWD, 'standards');
  const profile = readInstalledProfile(CWD);
  const selected = new Set(profile.valid ? profile.selectedStandards : []);

  console.log(chalk.bold(`  Available Standards (${TEMPLATES.length} total)\n`));

  for (const template of TEMPLATES) {
    const installed = fs.existsSync(path.join(standardsDir, template.filename));
    const inProfile = selected.size === 0 || selected.has(template.id);

    const status = installed
      ? chalk.green('  ✓ installed')
      : inProfile
        ? chalk.dim('  · not installed')
        : chalk.dim('  · excluded by profile');

    console.log(`  ${chalk.bold(template.filename.padEnd(22))} ${status}`);
    console.log(chalk.dim(`    ${template.description}`));
    console.log('');
  }

  const installedCount = TEMPLATES.filter((template) => fs.existsSync(path.join(standardsDir, template.filename))).length;

  console.log('  ─────────────────────────────────────────');
  console.log('');

  if (installedCount === TEMPLATES.length) {
    console.log(chalk.green(`  ✓ All ${TEMPLATES.length} standards installed.\n`));
    return;
  }

  if (installedCount === 0) {
    console.log(chalk.dim(`  None installed yet. Run ${chalk.cyan('npx @chrisadolphus/prodready init')} to install standards.\n`));
    return;
  }

  if (selected.size > 0) {
    console.log(chalk.dim(`  ${installedCount} installed. Profile selects ${selected.size} standard(s).\n`));
  } else {
    console.log(chalk.dim(`  ${installedCount} of ${TEMPLATES.length} installed. Run ${chalk.cyan('npx @chrisadolphus/prodready init')} to install the rest.\n`));
  }
}
