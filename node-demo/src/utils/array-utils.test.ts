import { describe, expect, it } from 'vitest';
import { chunk, findLastEven, head, last } from './array-utils.js';

describe('findLastEven', () => {
  it('returns the last even number in the array', () => {
    expect(findLastEven([1, 2, 3, 4, 5, 6])).toBe(6);
  });

  it('returns undefined when the array has no even numbers', () => {
    expect(findLastEven([1, 3, 5])).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(findLastEven([])).toBeUndefined();
  });
});

describe('head', () => {
  it('returns the first element', () => {
    expect(head(['a', 'b', 'c'])).toBe('a');
  });

  it('returns undefined for an empty array', () => {
    expect(head([])).toBeUndefined();
  });
});

describe('last', () => {
  it('returns the last element', () => {
    expect(last(['a', 'b', 'c'])).toBe('c');
  });

  it('returns undefined for an empty array', () => {
    expect(last([])).toBeUndefined();
  });
});

describe('chunk', () => {
  it('splits an array into groups of the given size', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5],
    ]);
  });

  it('returns an empty array when chunking an empty array', () => {
    expect(chunk([], 2)).toEqual([]);
  });

  it('throws a RangeError when the chunk size is not positive', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
  });
});