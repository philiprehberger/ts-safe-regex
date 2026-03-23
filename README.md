# @philiprehberger/safe-regex

[![CI](https://github.com/philiprehberger/ts-safe-regex/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-safe-regex/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/safe-regex)](https://www.npmjs.com/package/@philiprehberger/safe-regex)
[![License](https://img.shields.io/github/license/philiprehberger/ts-safe-regex)](LICENSE)

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

## License

MIT
