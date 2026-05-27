import { buildSitemap, type SitemapUrl } from '$lib/sitemap';
import { site } from '$lib/site';
import { formatDate } from '$lib/formatDate';

export const prerender = true;

type PostModule = {
	metadata: {
		title: string;
		date: string | Date;
		tags?: string[];
		description?: string;
	};
};

const modules = import.meta.glob<PostModule>('/src/posts/*.md', { eager: true });

function collectUrls(): SitemapUrl[] {
	const posts = Object.entries(modules).map(([path, mod]) => ({
		slug: path.split('/').pop()!.replace(/\.md$/, ''),
		date: formatDate(mod.metadata.date),
		tags: mod.metadata.tags ?? []
	}));

	const latestPostDate = posts.reduce((acc, p) => (p.date > acc ? p.date : acc), '');

	const tagSet = new Set<string>();
	for (const p of posts) for (const t of p.tags) tagSet.add(t);

	const urls: SitemapUrl[] = [
		{ path: '/', lastmod: latestPostDate || undefined },
		{ path: '/about/' },
		{ path: '/blog/', lastmod: latestPostDate || undefined },
		...posts.map((p) => ({ path: `/blog/${p.slug}/`, lastmod: p.date })),
		...[...tagSet].map((t) => ({ path: `/blog/tag/${t}/` }))
	];

	return urls;
}

export function GET() {
	const xml = buildSitemap({ siteUrl: site.url, urls: collectUrls() });
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
