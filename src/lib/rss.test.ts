import { describe, it, expect } from 'vitest';
import { buildRss } from './rss';

const posts = [
	{
		slug: 'hello-world',
		title: 'Hello, world',
		date: '2026-05-22',
		description: 'First post on the rebuilt LogicalDK.'
	},
	{
		slug: 'older-post',
		title: 'Older post',
		date: '2025-01-01',
		description: 'An older one.'
	}
];

const siteUrl = 'https://dhanendra.github.io';

describe('buildRss', () => {
	it('emits a valid RSS 2.0 document', () => {
		const xml = buildRss({ siteUrl, title: 'LogicalDK', description: 'A blog', posts });

		expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
		expect(xml).toContain('<rss version="2.0"');
		expect(xml).toContain('<channel>');
		expect(xml).toContain('<title>LogicalDK</title>');
		expect(xml).toContain(`<link>${siteUrl}</link>`);
	});

	it('emits one <item> per post with title, link, pubDate, description', () => {
		const xml = buildRss({ siteUrl, title: 'LogicalDK', description: 'A blog', posts });

		const itemMatches = xml.match(/<item>/g) ?? [];
		expect(itemMatches).toHaveLength(2);

		expect(xml).toContain('<title>Hello, world</title>');
		expect(xml).toContain(`<link>${siteUrl}/blog/hello-world/</link>`);
		expect(xml).toContain('<description>First post on the rebuilt LogicalDK.</description>');
		expect(xml).toContain('<pubDate>'); // RFC-822 format presence
	});

	it('escapes XML-unsafe characters in titles and descriptions', () => {
		const xml = buildRss({
			siteUrl,
			title: 'LogicalDK',
			description: 'A blog',
			posts: [
				{
					slug: 'tricky',
					title: 'Java & Spring < everything',
					date: '2026-01-01',
					description: 'Why "this" matters'
				}
			]
		});
		expect(xml).toContain('Java &amp; Spring &lt; everything');
		expect(xml).toContain('Why &quot;this&quot; matters');
	});
});
