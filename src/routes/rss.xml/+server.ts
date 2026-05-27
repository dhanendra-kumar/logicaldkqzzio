import { buildRss, type RssPost } from '$lib/rss';
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

function collectPosts(): RssPost[] {
	return Object.entries(modules)
		.map(([path, mod]) => ({
			slug: path.split('/').pop()!.replace(/\.md$/, ''),
			title: mod.metadata.title,
			date: formatDate(mod.metadata.date),
			description: mod.metadata.description ?? ''
		}))
		.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function GET() {
	const xml = buildRss({
		siteUrl: site.url,
		title: site.title,
		description: site.description,
		posts: collectPosts()
	});
	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
