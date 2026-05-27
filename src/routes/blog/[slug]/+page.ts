import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { EntryGenerator } from './$types';

type PostModule = {
	default: unknown;
	metadata: { title: string; date: string; tags?: string[]; description?: string };
};

const modules = import.meta.glob<PostModule>('/src/posts/*.md');

function slugFromPath(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

export const load: PageLoad = async ({ params }) => {
	const entry = Object.entries(modules).find(([path]) => slugFromPath(path) === params.slug);
	if (!entry) {
		throw error(404, 'Post not found');
	}
	const mod = await entry[1]();
	return {
		slug: params.slug,
		Post: mod.default,
		metadata: mod.metadata
	};
};

export const entries: EntryGenerator = () => {
	return Object.keys(modules).map((path) => ({ slug: slugFromPath(path) }));
};
