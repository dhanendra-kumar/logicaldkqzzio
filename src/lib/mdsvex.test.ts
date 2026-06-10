import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

describe('mdsvex', () => {
	it('compiles a .md post into a Svelte component with metadata', async () => {
		const mod = await import('../posts/git-auto-completion-macos.md');
		const Post = mod.default;
		const metadata = mod.metadata as { title: string; date: string; tags: string[] };

		expect(metadata.title).toMatch(/git/i);
		expect(metadata.tags).toContain('git');

		const { container } = render(Post);
		expect(container.textContent ?? '').toMatch(/git/i);
	});
});
