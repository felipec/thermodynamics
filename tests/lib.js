import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { compare } from 'uvu/diff';

import { brent } from '../lib.js';

const tolerance = 1e-4;

function round(n) {
  return Math.round((n + Number.EPSILON) * (1 / tolerance)) / (1 / tolerance);
}

function close(actual, expected) {
  if (Math.abs(actual - expected) < tolerance) return;

  actual = round(actual);
  expected = round(expected);

	throw new assert.Assertion({
    actual: actual,
    expected: expected,
    operator: 'close',
    message: 'Expected to be close',
    details: compare(actual, expected),
    generted: true,
  });
};

test('close', () => {
  close(1e-5, 2e-5);
});

test('simple', () => {
  close(brent(x => x * Math.cos(x), -1, 1, 1e-7, 1e-10, 50), 0);
});

test('complex', () => {
  close(brent(x => x ** 3 - (2 * x ** 2) - x - 2, -5, 5, 1e-7, 1e-10, 50), 2.658967);
});

test('split', () => {
  const f = x => {
    if (x > 7.87236423) return 1;
    if (x < 7.87236423) return -5;
    return 0;
  };
  close(brent(f, -1, 10, 1e-7, 1e-10, 50), 7.87236423);
});

test('exponential', () => {
  close(brent(x => (x + 3) * Math.pow(x - 1, 2), -4, 0, 1e-7, 1e-10, 50), -3);
});

test.run();
