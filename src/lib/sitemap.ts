export type SitemapUrl = {
	path: string;
	lastmod?: string;
};

export type SitemapOptions = {
	siteUrl: string;
	urls: SitemapUrl[];
};

export function buildSitemap({ siteUrl, urls }: SitemapOptions): string {
	const entries = urls
		.map((u) => {
			const lastmod = u.lastmod ? `\n\t\t<lastmod>${u.lastmod}</lastmod>` : '';
			return `\t<url>
\t\t<loc>${siteUrl}${u.path}</loc>${lastmod}
\t</url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}
