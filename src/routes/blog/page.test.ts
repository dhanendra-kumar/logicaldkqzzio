import { render, screen, within } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

const fixturePosts = [
	{ slug: 'older-post', title: 'Older post', date: '2025-01-01', tags: ['java'] },
	{ slug: 'newer-post', title: 'Newer post', date: '2026-05-22', tags: ['svelte'] }
];

describe('/blog index', () => {
	it('lists each post as a link to its slug', () => {
		render(Page, { data: { posts: fixturePosts } });

		const newerLink = screen.getByRole('link', { name: /Newer post/i });
		const olderLink = screen.getByRole('link', { name: /Older post/i });

		expect(newerLink).toHaveAttribute('href', '/blog/newer-post/');
		expect(olderLink).toHaveAttribute('href', '/blog/older-post/');
	});

	it('orders posts newest first', () => {
		render(Page, { data: { posts: fixturePosts } });

		const list = screen.getByRole('list');
		const items = within(list).getAllByRole('listitem');
		expect(items[0]).toHaveTextContent(/Newer post/);
		expect(items[1]).toHaveTextContent(/Older post/);
	});

	it('renders each post as a card with date, title, and tags', () => {
		render(Page, { data: { posts: fixturePosts } });

		const items = screen.getAllByRole('listitem');
		const newer = items[0];
		expect(newer.className).toMatch(/post-card/);
		expect(within(newer).getByText('2026-05-22')).toBeInTheDocument();
		expect(within(newer).getByText(/svelte/i)).toBeInTheDocument();
	});
});
