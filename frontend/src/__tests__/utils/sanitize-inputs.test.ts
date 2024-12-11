/* eslint-disable no-script-url */
import {
  sanitizeString,
  sanitizeNumber,
  sanitizeDate
} from '../../utils/sanitize-input';

describe('sanitizeString', () => {
  test('removes HTML tags', () => {
    expect(sanitizeString('<script>alert("XSS")</script>')).toBe(
      'alert(&quotXSS&quot)'
    );
    expect(sanitizeString('<p>Hello</p>')).toBe('Hello');
  });

  test('handles XSS attempts', () => {
    const xssAttempts = [
      {
        input: '<img src="x" onerror="alert(\'XSS\')">',
        expected: ''
      },
      {
        input: 'javascript:alert("XSS")',
        expected: 'javascript:alert(&quotXSS&quot)'
      },
      {
        input: '"><script>alert("XSS")</script>',
        expected: '&quot&gtalert(&quotXSS&quot)'
      },
      {
        input: '<svg/onload=alert("XSS")>',
        expected: ''
      },
      {
        input: '<?php echo "XSS"; ?>',
        expected: ''
      }
    ];

    xssAttempts.forEach(({ input, expected }) => {
      expect(sanitizeString(input)).toBe(expected);
    });
  });

  test('handles SQL injection attempts', () => {
    const sqlInjectionAttempts = [
      { input: "'; DROP TABLE users; --", expected: '&#x27  TABLE users' },
      {
        input: 'UNION SELECT * FROM passwords',
        expected: '* FROM passwords'
      },
      { input: '1; DELETE FROM users', expected: '1  FROM users' },
      { input: '1; SELECT * FROM users', expected: '1  * FROM users' },
      { input: "' OR '1'='1", expected: '&#x27 OR &#x271&#x27=&#x271' }
    ];

    sqlInjectionAttempts.forEach(({ input, expected }) => {
      expect(sanitizeString(input)).toBe(expected);
    });
  });

  test('handles normal strings correctly', () => {
    expect(sanitizeString('Hello, World!')).toBe('Hello, World!');
    expect(sanitizeString(' Trim me ')).toBe('Trim me');
  });
});

describe('sanitizeNumber', () => {
  test('converts valid numbers', () => {
    expect(sanitizeNumber('42')).toBe(42);
    expect(sanitizeNumber('3.14')).toBe(3.14);
  });

  test('handles negative numbers', () => {
    expect(sanitizeNumber('-5')).toBe(0);
  });

  test('handles invalid input', () => {
    expect(sanitizeNumber('not a number')).toBe(0);
    expect(sanitizeNumber('')).toBe(0);
  });

  it('handles extreme values', () => {
    expect(sanitizeNumber('1e10')).toBe(1e10);
    expect(sanitizeNumber('Infinity')).toBe(Infinity);
  });
});

describe('sanitizeDate', () => {
  test('converts valid dates', () => {
    expect(sanitizeDate('2023-01-01')).toEqual(new Date('2023-01-01'));
    // expect(sanitizeDate('Jan 1, 2023')).toEqual(new Date('2023-01-01')); // compensate for time zone
  });

  test('handles invalid dates', () => {
    expect(sanitizeDate('not a date')).toBeNull();
    expect(sanitizeDate('')).toBeNull();
  });
});
