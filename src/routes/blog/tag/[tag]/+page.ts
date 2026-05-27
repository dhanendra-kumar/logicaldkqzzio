import { error } from '@sveltejs/kit';
import type { PageLoad, EntryGenerator } from './$types';
import { formatDate } from '$lib/formatDate';

type PostModule = {
	metadata: {
		title: string;
		date: string | Date;
		tags?: string[];
		description?: string;
	};
};

const modules = import.meta.glob<PostModule>('/src/posts/*.md', { eager: true });

type Post = {
	slug: string;
	title: string;
	date: string;
	tags: string[];
};

function allPosts(): Post[] {
	return Object.entries(modules).map(([path, mod]) => ({
		slug: path.split('/').pop()!.replace(/\.md$/, ''),
		title: mod.metadata.title,
		date: formatDate(mod.metadata.date),
		tags: mod.metadata.tags ?? []
	}));
}

export const load: PageLoad = async ({ params }) => {
	const tag = params.tag;
	const posts = allPosts().filter((p) => p.tags.includes(tag));
	if (posts.length === 0) {
		throw error(404, `No posts tagged "${tag}"`);
	}
	return { tag, posts };
};

export const entries: EntryGenerator = () => {
	const tagSet = new Set<string>();
	for (const p of allPosts()) {
		for (const t of p.tags) tagSet.add(t);
	}
	return [...tagSet].map((tag) => ({ tag }));
};
