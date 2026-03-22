import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isSafe, safeParse, escape } from '../../dist/index.js';

describe('isSafe', () => {
  it('should return true for simple literal pattern', () => {
    assert.equal(isSafe('abc'), true);
  });

  it('should return true for simple quantifier', () => {
    assert.equal(isSafe('a*'), true);
  });

  it('should return false for nested quantifier (a+)+', () => {
    assert.equal(isSafe('(a+)+'), false);
  });

  it('should return false for overlapping alternation (a|a)*', () => {
    assert.equal(isSafe('(a|a)*'), false);
  });

  it('should return true for safe group (ab)+', () => {
    assert.equal(isSafe('(ab)+'), true);
  });

  it('should return false for nested quantifier (a*)*', () => {
    assert.equal(isSafe('(a*)*'), false);
  });

  it('should accept a RegExp instance', () => {
    assert.equal(isSafe(/abc/), true);
    assert.equal(isSafe(/(a+)+/), false);
  });
});

describe('safeParse', () => {
  it('should return a RegExp for safe patterns', () => {
    const result = safeParse('abc');
    assert.ok(result instanceof RegExp);
    assert.equal(result.source, 'abc');
  });

  it('should return null for unsafe patterns', () => {
    const result = safeParse('(a+)+');
    assert.equal(result, null);
  });

  it('should return null for invalid regex', () => {
    const result = safeParse('(unclosed');
    assert.equal(result, null);
  });

  it('should pass flags through', () => {
    const result = safeParse('abc', 'gi');
    assert.ok(result instanceof RegExp);
    assert.equal(result.flags, 'gi');
  });
});

describe('escape', () => {
  it('should escape dots', () => {
    assert.equal(escape('hello.world'), 'hello\\.world');
  });

  it('should escape quantifiers', () => {
    assert.equal(escape('a+b*c?'), 'a\\+b\\*c\\?');
  });

  it('should escape all special characters', () => {
    const special = '.*+?^${}()|[]\\';
    const escaped = escape(special);
    assert.equal(escaped, '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('should leave normal characters unchanged', () => {
    assert.equal(escape('hello world'), 'hello world');
  });
});
