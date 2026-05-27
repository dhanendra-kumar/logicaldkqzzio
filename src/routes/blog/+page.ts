import type { PageLoad } from './$types';
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

export const load: PageLoad = async () => {
	const posts = Object.entries(modules).map(([path, mod]) => ({
		slug: path.split('/').pop()!.replace(/\.md$/, ''),
		title: mod.metadata.title,
		date: formatDate(mod.metadata.date),
		tags: mod.metadata.tags ?? []
	}));
	return { posts };
};
