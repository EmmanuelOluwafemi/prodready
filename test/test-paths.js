import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEST_DIR = __dirname;
export const REPO_ROOT = path.resolve(__dirname, '..');
export const FIXTURES_DIR = path.join(__dirname, 'fixtures');
export const BIN_PATH = path.join(REPO_ROOT, 'bin/cli.js');
