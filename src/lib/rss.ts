export type RssPost = {
	slug: string;
	title: string;
	date: string;
	description?: string;
};

export type RssOptions = {
	siteUrl: string;
	title: string;
	description: string;
	posts: RssPost[];
};

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function toRfc822(dateStr: string): string {
	const d = new Date(dateStr);
	return Number.isNaN(d.getTime()) ? dateStr : d.toUTCString();
}

export function buildRss({ siteUrl, title, description, posts }: RssOptions): string {
	const items = posts
		.map(
			(p) => `\t\t<item>
\t\t\t<title>${escapeXml(p.title)}</title>
\t\t\t<link>${siteUrl}/blog/${p.slug}/</link>
\t\t\t<guid>${siteUrl}/blog/${p.slug}/</guid>
\t\t\t<pubDate>${toRfc822(p.date)}</pubDate>
\t\t\t<description>${escapeXml(p.description ?? '')}</description>
\t\t</item>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
\t<channel>
\t\t<title>${escapeXml(title)}</title>
\t\t<link>${siteUrl}</link>
\t\t<description>${escapeXml(description)}</description>
\t\t<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
\t</channel>
</rss>`;
}
