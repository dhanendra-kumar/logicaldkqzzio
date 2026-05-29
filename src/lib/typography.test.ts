import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/app.css'), 'utf8');

describe('typography rhythm', () => {
	it('uses a fluid hero scale for h1 via clamp()', () => {
		const h1Match = css.match(/\bh1\s*\{[^}]*\}/);
		expect(h1Match, 'h1 block missing').toBeTruthy();
		expect(h1Match![0]).toMatch(/clamp\(/);
	});

	it('does not clamp article width — prose fills its parent column', () => {
		const articleBlock = css.match(/article\s*\{[^}]*\}/);
		if (articleBlock) {
			expect(articleBlock[0]).not.toMatch(/max-width:/);
		}
	});

	it('removes default link underline and uses a custom underline gradient on hover', () => {
		const aBlock = css.match(/(^|\n)a\s*\{[^}]*\}/);
		expect(aBlock, 'a block missing').toBeTruthy();
		expect(aBlock![0]).toMatch(/text-decoration:\s*none/);
		const hoverBlock = css.match(/a:hover\s*\{[^}]*\}/);
		expect(hoverBlock![0]).toMatch(/background-image|border-bottom|text-decoration:\s*underline/);
	});
});
