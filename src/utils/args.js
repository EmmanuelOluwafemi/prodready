export function parseCliArgs(rawArgs) {
  const args = [...rawArgs];
  const command = args.shift();
  const options = {};
  const positionals = [];

  for (let i = 0; i < args.length; i++) {
    const token = args[i];

    if (!token.startsWith('-')) {
      positionals.push(token);
      continue;
    }

    if (token === '--') {
      positionals.push(...args.slice(i + 1));
      break;
    }

    const eqIndex = token.indexOf('=');
    if (eqIndex > -1) {
      const key = token.slice(2, eqIndex);
      const value = token.slice(eqIndex + 1);
      options[key] = value;
      continue;
    }

    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('-')) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
      continue;
    }

    if (token.startsWith('-')) {
      const flags = token.slice(1).split('');
      for (const flag of flags) {
        if (flag === 'y') {
          options.yes = true;
        } else if (flag === 'h') {
          options.help = true;
        } else {
          options[flag] = true;
        }
      }
    }
  }

  return { command, options, positionals };
}

export function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

export function toNumber(value) {
  if (value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
