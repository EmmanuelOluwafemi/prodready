# Contributing to ProdReady

Thanks for contributing to ProdReady.

## Development Setup

- Node.js 18+
- npm

```bash
git clone https://github.com/chrisadolphus/prodready.git
cd prodready
npm install
```

Run the CLI locally:

```bash
node bin/cli.js help
node bin/cli.js audit
node bin/cli.js init
```

## How to Contribute

- Open an issue first for major changes.
- Keep pull requests focused and small.
- Update docs/help text if behavior changes.
- Preserve backward compatibility for command names and basic output where possible.

## Pull Request Checklist

- Code is readable and minimal.
- README/help text updated (if needed).
- `npm pack --dry-run --cache /tmp/prodready-npm-cache` succeeds.
- CI is green.

## Reporting Bugs

When filing bugs, include:

- OS and Node version
- Command you ran
- Actual vs expected output
- Minimal reproduction repo or file tree

## Release Notes

Maintainers tag releases as `vX.Y.Z` and publish to npm.
