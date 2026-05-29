import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const layoutCss = readFileSync(resolve(process.cwd(), 'src/routes/+layout.svelte'), 'utf8');
const headerCss = readFileSync(resolve(process.cwd(), 'src/lib/SiteHeader.svelte'), 'utf8');

describe('layout widths', () => {
	it('declares a full-bleed site-header rule (100% width)', () => {
		// The header host stretches 100% across the viewport.
		const match = headerCss.match(/\.site-header\s*\{[\s\S]*?\}/);
		expect(match, 'site-header rule missing').toBeTruthy();
		expect(match![0]).toMatch(/width:\s*100%/);
	});

	it('bounds the header inner row so nav does not hug screen edges on wide displays', () => {
		const match = headerCss.match(/\.inner\s*\{[\s\S]*?\}/);
		expect(match, '.inner rule missing').toBeTruthy();
		expect(match![0]).toMatch(/max-width:/);
		expect(match![0]).toMatch(/margin:\s*0\s+auto/);
	});

	it('sizes the content column at 80% of the viewport with a sensible max', () => {
		const match = layoutCss.match(/\.content\s*\{[\s\S]*?\}/);
		expect(match, '.content rule missing').toBeTruthy();
		expect(match![0]).toMatch(/width:\s*80%/);
		expect(match![0]).toMatch(/max-width:\s*\d/);
	});

	it('renders SiteHeader as a sibling of the content column, not nested inside .content', () => {
		// Header should sit at the top-level of the layout template so the bar
		// itself can span 100% even when the content column is constrained.
		const template = layoutCss.match(/<SiteHeader[\s\S]*?\/>([\s\S]*?)<main/);
		expect(template, 'expected SiteHeader to precede <main>').toBeTruthy();
		// SiteHeader should NOT appear inside a wrapper that also wraps <main>
		const nested = /<div class="content[\s\S]*?<SiteHeader/.test(layoutCss);
		expect(nested).toBe(false);
	});
});
