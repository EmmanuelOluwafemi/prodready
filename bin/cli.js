#!/usr/bin/env node

import { audit } from '../src/commands/audit.js';
import { init } from '../src/commands/init.js';
import { list } from '../src/commands/list.js';
import { check } from '../src/commands/check.js';
import { printHelp } from '../src/utils/help.js';
import { printBanner } from '../src/utils/banner.js';

const args = process.argv.slice(2);
const command = args[0];

printBanner();

switch (command) {
  case 'audit':
    await audit();
    break;

  case 'init':
    await init();
    break;

  case 'list':
    await list();
    break;

  case 'check':
    await check();
    break;

  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;

  case undefined:
    printHelp();
    break;

  default:
    console.error(`\nUnknown command: "${command}"\n`);
    printHelp();
    process.exit(1);
}
