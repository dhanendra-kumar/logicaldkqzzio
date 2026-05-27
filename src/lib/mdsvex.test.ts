import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

describe('mdsvex', () => {
	it('compiles a .md post into a Svelte component with metadata', async () => {
		const mod = await import('../posts/hello-world.md');
		const Post = mod.default;
		const metadata = mod.metadata as { title: string; date: string; tags: string[] };

		expect(metadata.title).toBe('Hello, world');
		expect(metadata.tags).toContain('meta');

		render(Post);
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, world');
	});
});
