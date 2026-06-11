import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const appHtml = readFileSync(resolve(process.cwd(), 'src/app.html'), 'utf8');

describe('app.html head', () => {
	it('declares a theme-color meta tag', () => {
		expect(appHtml).toMatch(/<meta\s+name=["']theme-color["']\s+content=["']#[0-9a-fA-F]{3,8}["']/);
	});

	it('does not include the bogus text-scale meta', () => {
		expect(appHtml).not.toMatch(/text-scale/);
	});
});
