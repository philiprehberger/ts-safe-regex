/**
 * Check if a regex pattern is safe from ReDoS attacks.
 * Detects nested quantifiers and overlapping alternations that cause
 * catastrophic backtracking.
 */
export function isSafe(input: string | RegExp): boolean {
  const source = input instanceof RegExp ? input.source : input;

  // Check for nested quantifiers: (a+)+, (a*)+, (a+)*, (a*)*, etc.
  // A quantified group containing a quantified element
  if (hasNestedQuantifiers(source)) {
    return false;
  }

  // Check for overlapping alternations with quantifiers: (a|a)*, (a|ab)*
  if (hasOverlappingAlternations(source)) {
    return false;
  }

  return true;
}

function hasNestedQuantifiers(source: string): boolean {
  // Find groups with quantifiers that contain inner quantifiers
  // Look for patterns like (X+)+ (X*)+ (X+)* (X{n,})+ etc.
  const quantifiers = /[+*]\)?[+*{]/;

  // More thorough: walk through and track nesting
  let depth = 0;
  let hasInnerQuantifier = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (char === '\\') {
      i++; // Skip escaped character
      continue;
    }

    if (char === '(') {
      depth++;
      hasInnerQuantifier = false;
    } else if (char === ')') {
      depth--;
      // Check if the group is followed by a quantifier
      const next = source[i + 1];
      if (hasInnerQuantifier && (next === '+' || next === '*' || next === '{')) {
        return true;
      }
    } else if (char === '+' || char === '*') {
      if (depth > 0) {
        hasInnerQuantifier = true;
      }
    } else if (char === '{') {
      // Check for {n,} or {n,m} quantifier
      const rest = source.slice(i);
      if (/^\{\d+,\d*\}/.test(rest) && depth > 0) {
        hasInnerQuantifier = true;
      }
    }
  }

  return false;
}

function hasOverlappingAlternations(source: string): boolean {
  // Find groups with alternation that are quantified: (a|a)+, (a|ab)*
  // Simple heuristic: find quantified groups with | inside
  const groupRegex = /\(([^()]+)\)([+*]|\{\d+,\d*\})/g;
  let match: RegExpExecArray | null;

  while ((match = groupRegex.exec(source)) !== null) {
    const groupContent = match[1];
    // Remove non-capturing prefix if present
    const content = groupContent.replace(/^\?[^:]*:/, '');

    if (content.includes('|')) {
      const alternatives = content.split('|');
      // Check for overlapping alternatives
      for (let i = 0; i < alternatives.length; i++) {
        for (let j = i + 1; j < alternatives.length; j++) {
          const a = alternatives[i].replace(/[+*?{}[\]\\()^$]/g, '');
          const b = alternatives[j].replace(/[+*?{}[\]\\()^$]/g, '');
          // If one alternative is a prefix of or equal to another, they overlap
          if (a.length > 0 && b.length > 0 && (a.startsWith(b) || b.startsWith(a) || a === b)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Parse a regex string, returning the compiled RegExp only if it is safe.
 * Returns null if the pattern is unsafe or invalid.
 */
export function safeParse(str: string, flags?: string): RegExp | null {
  if (!isSafe(str)) {
    return null;
  }

  try {
    return new RegExp(str, flags);
  } catch {
    return null;
  }
}

/**
 * Escape all regex special characters in a string so it can be used
 * as a literal match in a regular expression.
 */
export function escape(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
