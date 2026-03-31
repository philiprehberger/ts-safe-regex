# @philiprehberger/safe-regex

[![CI](https://github.com/philiprehberger/ts-safe-regex/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-safe-regex/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/safe-regex.svg)](https://www.npmjs.com/package/@philiprehberger/safe-regex)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-safe-regex)](https://github.com/philiprehberger/ts-safe-regex/commits/main)

Validate and sanitize regular expressions to prevent ReDoS attacks.

## Installation

```bash
npm install @philiprehberger/safe-regex
```

## Usage

```ts
import { isSafe, safeParse, escape } from '@philiprehberger/safe-regex';

isSafe('abc');
// => true

isSafe('(a+)+');
// => false (nested quantifier — catastrophic backtracking)

const regex = safeParse('abc', 'i');
// => /abc/i

const unsafe = safeParse('(a+)+');
// => null

escape('hello.world');
// => "hello\\.world"

escape('a+b*c?');
// => "a\\+b\\*c\\?"
```

## API

### `isSafe(input: string | RegExp): boolean`

Check whether a regular expression is safe from ReDoS attacks. Detects nested quantifiers and overlapping alternations that cause catastrophic backtracking.

### `safeParse(str: string, flags?: string): RegExp | null`

Compile a regex string into a `RegExp` only if it passes safety checks. Returns `null` if the pattern is unsafe or invalid.

### `escape(str: string): string`

Escape all regex special characters in a string so it can be used as a literal match: `. * + ? ^ $ { } ( ) | [ ] \`

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/ts-safe-regex)

🐛 [Report issues](https://github.com/philiprehberger/ts-safe-regex/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/ts-safe-regex/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
