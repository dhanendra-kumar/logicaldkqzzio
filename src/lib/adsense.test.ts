import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import AdSenseLoader from './AdSenseLoader.svelte';
import { site } from './site';

describe('site config', () => {
	it('exposes the AdSense publisher id', () => {
		expect(site.adsensePublisherId).toMatch(/^ca-pub-\d+$/);
	});
});

describe('AdSenseLoader', () => {
	it('injects the AdSense script tag with the configured publisher id', () => {
		document.head.innerHTML = '';
		render(AdSenseLoader);
		const script = document.head.querySelector<HTMLScriptElement>(
			'script[src*="pagead2.googlesyndication.com"]'
		);
		expect(script, 'expected the AdSense loader script in head').toBeTruthy();
		expect(script!.getAttribute('src')).toContain(`client=${site.adsensePublisherId}`);
		expect(script!.hasAttribute('async')).toBe(true);
		expect(script!.getAttribute('crossorigin')).toBe('anonymous');
	});

	it('does nothing when the publisher id is empty', async () => {
		document.head.innerHTML = '';
		// Render with a temporarily blanked id by mocking
		const originalId = site.adsensePublisherId;
		(site as { adsensePublisherId: string }).adsensePublisherId = '';
		render(AdSenseLoader);
		const script = document.head.querySelector('script[src*="pagead2.googlesyndication.com"]');
		expect(script).toBeNull();
		(site as { adsensePublisherId: string }).adsensePublisherId = originalId;
	});
});

describe('ads.txt', () => {
	const adsTxtPath = resolve(process.cwd(), 'static/ads.txt');

	it('exists at the static root', () => {
		expect(existsSync(adsTxtPath)).toBe(true);
	});

	it('contains the google.com line with the configured publisher id', () => {
		const body = readFileSync(adsTxtPath, 'utf8').trim();
		// AdSense requires lines of the form:
		//   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
		const pub = site.adsensePublisherId.replace(/^ca-/, '');
		const re = new RegExp(`^google\\.com,\\s*${pub},\\s*DIRECT,\\s*f08c47fec0942fa0$`, 'm');
		expect(body).toMatch(re);
	});
});
