import { describe, it, expect } from 'vitest';
import { scaleForViewport, MOBILE_BREAKPOINT } from './mobile';

describe('scaleForViewport', () => {
	it('passes through unchanged on desktop viewports', () => {
		const params = { count: 1200, depth: 800, speed: 0.4, size: 1.4 };
		expect(scaleForViewport(params, 1440)).toEqual(params);
	});

	it('reduces particle counts on small viewports', () => {
		const params = { count: 1200, speed: 0.4, size: 1.4 };
		const scaled = scaleForViewport(params, 400);
		expect(scaled.count).toBeLessThan(1200);
		expect(scaled.count).toBeGreaterThan(0);
	});

	it('scales known heavy-count keys (count, lines, shapes)', () => {
		const params = { count: 300, lines: 20, shapes: 24, speed: 0.5 };
		const scaled = scaleForViewport(params, 360);
		expect(scaled.count).toBeLessThan(300);
		expect(scaled.lines).toBeLessThan(20);
		expect(scaled.shapes).toBeLessThan(24);
	});

	it('does not touch unrelated numeric params on mobile', () => {
		const params = { count: 1200, speed: 0.4, radius: 6, depth: 800 };
		const scaled = scaleForViewport(params, 360);
		expect(scaled.speed).toBe(0.4);
		expect(scaled.radius).toBe(6);
		expect(scaled.depth).toBe(800);
	});

	it('preserves non-numeric params unchanged', () => {
		const params = { count: 1200, palette: 'auto' };
		const scaled = scaleForViewport(params, 360);
		expect(scaled.palette).toBe('auto');
	});

	it('uses the documented breakpoint of 540px', () => {
		expect(MOBILE_BREAKPOINT).toBe(540);
		const params = { count: 1000 };
		expect(scaleForViewport(params, 600).count).toBe(1000);
		expect(scaleForViewport(params, 540).count).toBe(1000);
		expect(scaleForViewport(params, 539).count).toBeLessThan(1000);
	});
});
