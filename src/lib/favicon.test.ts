import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const favicon = readFileSync(
	resolve(process.cwd(), 'src/lib/assets/favicon.svg'),
	'utf8'
);

describe('favicon', () => {
	it('is a valid SVG document with the svg namespace', () => {
		expect(favicon).toMatch(/<svg\b[^>]*xmlns=["']http:\/\/www\.w3\.org\/2000\/svg/);
		expect(favicon.trim().endsWith('</svg>')).toBe(true);
	});

	it('declares a square viewBox so it renders cleanly at any favicon size', () => {
		const m = favicon.match(/viewBox=["']\s*0\s+0\s+(\d+)\s+(\d+)/);
		expect(m, 'viewBox attribute missing').toBeTruthy();
		expect(m![1]).toBe(m![2]);
	});

	it('contains the DK letterform (text or path id) and is not the old Svelte logo', () => {
		// Either inline <text>DK</text> or an explicit DK identifier on the path.
		const hasDkText = /<text\b[^>]*>\s*DK\s*<\/text>/i.test(favicon);
		const hasDkLabel = /\bdk-letterform\b/i.test(favicon);
		expect(hasDkText || hasDkLabel).toBe(true);

		// Defensively assert the Svelte-logo title is gone.
		expect(favicon).not.toMatch(/svelte-logo/i);
	});
});
