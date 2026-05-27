import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import '../app.css';
import Page from '../routes/+page.svelte';

function collectAllCssRules(): string[] {
	const all: string[] = [];
	for (const sheet of Array.from(document.styleSheets)) {
		let rules: CSSRuleList;
		try {
			rules = sheet.cssRules;
		} catch {
			continue;
		}
		for (const rule of Array.from(rules)) {
			all.push(rule.cssText);
		}
	}
	return all;
}

describe('tailwind', () => {
	it('emits a rule for a utility class used in the source (font-mono)', () => {
		render(Page);

		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading.className).toMatch(/font-mono/);

		const rules = collectAllCssRules();
		const hasFontMonoRule = rules.some((text) => /\.font-mono\b/.test(text));
		expect(hasFontMonoRule).toBe(true);
	});
});
