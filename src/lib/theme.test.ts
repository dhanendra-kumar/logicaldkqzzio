import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const appCssPath = resolve(process.cwd(), 'src/app.css');
const css = readFileSync(appCssPath, 'utf8');

function extractBlock(selector: string): string {
	const re = new RegExp(`${selector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\{([^}]*)\\}`);
	const match = css.match(re);
	if (!match) throw new Error(`block not found for selector: ${selector}`);
	return match[1];
}

const baseTokens = ['--color-bg', '--color-fg', '--color-muted', '--color-accent', '--color-link', '--color-border', '--color-code-bg'];

const newTokens = [
	'--color-bg-elevated',
	'--color-surface',
	'--color-surface-hover',
	'--color-accent-soft',
	'--color-accent-strong',
	'--color-grad-1',
	'--color-grad-2',
	'--color-grad-3',
	'--shadow-soft',
	'--shadow-glow'
];

describe('theme tokens', () => {
	it('keeps the original tokens in @theme', () => {
		const block = extractBlock('@theme');
		for (const t of baseTokens) {
			expect(block, `expected ${t} in @theme`).toContain(t);
		}
	});

	it('adds the new richer-palette tokens to @theme (light defaults)', () => {
		const block = extractBlock('@theme');
		for (const t of newTokens) {
			expect(block, `expected ${t} in @theme`).toContain(t);
		}
	});

	it('overrides the new tokens for dark mode in .dark', () => {
		const block = extractBlock('.dark');
		for (const t of newTokens) {
			expect(block, `expected ${t} in .dark`).toContain(t);
		}
	});
});
