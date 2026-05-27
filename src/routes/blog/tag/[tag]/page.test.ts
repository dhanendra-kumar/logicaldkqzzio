import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

const data = {
	tag: 'java',
	posts: [
		{ slug: 'a', title: 'Post A', date: '2026-01-01', tags: ['java'] },
		{ slug: 'b', title: 'Post B', date: '2025-12-01', tags: ['java', 'spring'] }
	]
};

describe('/blog/tag/[tag] page', () => {
	it('shows the tag name as the heading', () => {
		render(Page, { data });
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/java/i);
	});

	it('lists each matching post with a link', () => {
		render(Page, { data });
		expect(screen.getByRole('link', { name: /Post A/ })).toHaveAttribute('href', '/blog/a/');
		expect(screen.getByRole('link', { name: /Post B/ })).toHaveAttribute('href', '/blog/b/');
	});
});
