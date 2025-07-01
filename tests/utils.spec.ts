import stripAnsi from 'strip-ansi';
import { describe, expect, it } from 'vitest';
import { diffProps } from '../src/utils.js';

describe('diffProps', () => {
  it('should return empty for matching symmetric props', () => {
    expect(diffProps({ a: 1 }, { a: 1 })).toEqual('');
  });

  it('should return empty for matching asymmetric props', () => {
    expect(diffProps({ a: 1, b: 2 }, { a: 1 })).toEqual('');
  });

  it('should diff symmetric props', () => {
    expect(stripAnsi(diffProps({ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 })))
      .toEqual(`  Object {
-   "a": 4,
-   "b": 5,
-   "c": 6,
+   "a": 1,
+   "b": 2,
+   "c": 3,
  }`);

    expect(stripAnsi(diffProps({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 4 })))
      .toEqual(`  Object {
    "a": 1,
    "b": 2,
-   "c": 4,
+   "c": 3,
  }`);

    expect(stripAnsi(diffProps({ a: 1, b: 2, c: 3 }, { a: 4, b: 2, c: 4 })))
      .toEqual(`  Object {
-   "a": 4,
+   "a": 1,
    "b": 2,
-   "c": 4,
+   "c": 3,
  }`);
  });

  it('should diff asymmetric props', () => {
    expect(stripAnsi(diffProps({ a: 1, b: 2, c: 3 }, { a: 1, b: 4 })))
      .toEqual(`  Object {
    "a": 1,
-   "b": 4,
+   "b": 2,
  }`);

    expect(stripAnsi(diffProps({ a: 1, b: 2, c: 3 }, { a: 10 })))
      .toEqual(`  Object {
-   "a": 10,
+   "a": 1,
  }`);

    expect(stripAnsi(diffProps({ a: 1, b: 2, c: 3 }, { c: 10 })))
      .toEqual(`  Object {
-   "c": 10,
+   "c": 3,
  }`);
  });
});
