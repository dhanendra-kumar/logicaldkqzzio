import { describe, it, expect } from 'vitest';
import { buildSitemap } from './sitemap';

const siteUrl = 'https://example.com';

describe('buildSitemap', () => {
	it('emits a valid sitemap with one <url> per entry', () => {
		const xml = buildSitemap({
			siteUrl,
			urls: [
				{ path: '/', lastmod: '2026-05-22' },
				{ path: '/blog/', lastmod: '2026-05-22' },
				{ path: '/blog/hello-world/', lastmod: '2026-05-22' }
			]
		});

		expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect((xml.match(/<url>/g) ?? []).length).toBe(3);
		expect(xml).toContain(`<loc>${siteUrl}/</loc>`);
		expect(xml).toContain(`<loc>${siteUrl}/blog/hello-world/</loc>`);
		expect(xml).toContain('<lastmod>2026-05-22</lastmod>');
	});

	it('skips lastmod when not provided', () => {
		const xml = buildSitemap({
			siteUrl,
			urls: [{ path: '/' }]
		});
		expect(xml).toContain('<loc>https://example.com/</loc>');
		expect(xml).not.toContain('<lastmod>');
	});
});
