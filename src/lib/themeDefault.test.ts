import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const appHtml = readFileSync(resolve(process.cwd(), 'src/app.html'), 'utf8');

describe('default theme', () => {
	it('runs an inline boot script that sets the dark class before paint', () => {
		// Inline script in <head> so it executes before the body renders,
		// preventing a flash of the wrong theme.
		expect(appHtml).toMatch(/<script[^>]*>[\s\S]*?classList\.add\(['"]dark['"]\)/);
	});

	it('defaults to dark when no preference is stored', () => {
		// Evaluate the boot script in isolation with a fresh fake DOM.
		const html = {
			classes: new Set<string>(),
			documentElement: {
				classList: {
					add(c: string) {
						(this as unknown as { _o: typeof html }).constructor; // type silence
						html.classes.add(c);
					},
					remove(c: string) {
						html.classes.delete(c);
					}
				}
			}
		};
		const storage: Record<string, string> = {};
		const fakeWindow = {
			document: html,
			localStorage: {
				getItem: (k: string) => storage[k] ?? null,
				setItem: (k: string, v: string) => {
					storage[k] = v;
				}
			}
		};

		const scriptMatch = appHtml.match(/<script>([\s\S]*?)<\/script>/);
		expect(scriptMatch, 'inline boot script missing').toBeTruthy();

		const body = scriptMatch![1];
		const fn = new Function('window', 'document', 'localStorage', body);
		fn(fakeWindow, fakeWindow.document, fakeWindow.localStorage);

		expect(html.classes.has('dark')).toBe(true);
	});

	it('respects an explicit light preference from localStorage', () => {
		const html = { classes: new Set<string>() };
		const scriptMatch = appHtml.match(/<script>([\s\S]*?)<\/script>/);
		const body = scriptMatch![1];
		const fakeWindow = {
			document: {
				documentElement: {
					classList: {
						add(c: string) {
							html.classes.add(c);
						},
						remove(c: string) {
							html.classes.delete(c);
						}
					}
				}
			},
			localStorage: {
				getItem: (k: string) => (k === 'theme' ? 'light' : null),
				setItem: () => {}
			}
		};
		const fn = new Function('window', 'document', 'localStorage', body);
		fn(fakeWindow, fakeWindow.document, fakeWindow.localStorage);

		expect(html.classes.has('dark')).toBe(false);
	});
});
