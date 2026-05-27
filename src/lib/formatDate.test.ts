import { describe, it, expect } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
	it('formats a Date object as YYYY-MM-DD in UTC', () => {
		expect(formatDate(new Date('2026-05-22T00:00:00.000Z'))).toBe('2026-05-22');
	});

	it('formats an ISO string as YYYY-MM-DD', () => {
		expect(formatDate('2026-05-22')).toBe('2026-05-22');
	});

	it('returns the original string when the input is unparseable', () => {
		expect(formatDate('not-a-date')).toBe('not-a-date');
	});
});
