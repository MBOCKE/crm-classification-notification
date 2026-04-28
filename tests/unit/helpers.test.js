const {
  formatDate,
  daysBetween,
  safeJsonParse,
  isValidEmail,
  sanitizeObject,
  getPagination
} = require('../../src/utils/helpers');

describe('helpers utilities', () => {
  test('formatDate returns YYYY-MM-DD', () => {
    const date = new Date('2026-04-28T12:00:00Z');
    expect(formatDate(date)).toBe('2026-04-28');
  });

  test('daysBetween calculates days correctly', () => {
    expect(daysBetween('2026-04-25', '2026-04-28')).toBe(3);
  });

  test('safeJsonParse returns parsed object for valid JSON and fallback for invalid JSON', () => {
    expect(safeJsonParse('{"a":1}', null)).toEqual({ a: 1 });
    expect(safeJsonParse('invalid', { default: true })).toEqual({ default: true });
  });

  test('isValidEmail validates email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  test('sanitizeObject removes null and undefined values', () => {
    expect(sanitizeObject({ a: 1, b: null, c: undefined, d: 'x' })).toEqual({ a: 1, d: 'x' });
  });

  test('getPagination returns numeric pagination values', () => {
    const result = getPagination('10', '5', 25);
    expect(result).toEqual({ limit: 10, offset: 5, total: 25, hasMore: true });
  });
});