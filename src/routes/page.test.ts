import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

const samplePosts = [
	{
		slug: 'older',
		title: 'Older post',
		date: '2024-01-01',
		tags: [],
		description: 'Older summary line.'
	},
	{
		slug: 'middle',
		title: 'Middle post',
		date: '2025-03-15',
		tags: [],
		description: 'Middle summary line.'
	},
	{
		slug: 'newest',
		title: 'Newest post',
		date: '2025-08-20',
		tags: [],
		description: 'Newest summary line.'
	},
	{
		slug: 'oldest',
		title: 'Oldest post',
		date: '2023-06-01',
		tags: [],
		description: 'Oldest summary line.'
	}
];

function fixturePosts(n: number) {
	return Array.from({ length: n }, (_, i) => ({
		slug: `post-${i}`,
		title: `Post ${i}`,
		date: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String(((i * 7) % 28) + 1).padStart(2, '0')}`,
		tags: [],
		description: `Summary for post ${i}`
	}));
}

describe('home page', () => {
	it('renders the site name as the primary heading', () => {
		render(Page, { props: { data: { posts: [] } } });
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading).toHaveTextContent(/LogicalDK/i);
	});

	it('shows a tagline mentioning Java, Spring, and the JVM', () => {
		render(Page, { props: { data: { posts: [] } } });
		expect(screen.getAllByText(/java/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/spring/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/jvm/i).length).toBeGreaterThan(0);
	});

	it('exposes a primary CTA linking to the blog', () => {
		render(Page, { props: { data: { posts: [] } } });
		const cta = screen.getByRole('link', { name: /read the blog/i });
		expect(cta).toHaveAttribute('href', '/blog/');
	});

	it('shows posts in the latest-posts strip sorted newest first', () => {
		render(Page, { props: { data: { posts: samplePosts } } });
		const strip = screen.getByTestId('latest-posts');
		const titleLinks = Array.from(
			strip.querySelectorAll('[data-testid="post-card-title"]')
		) as HTMLAnchorElement[];
		expect(titleLinks.map((l) => l.textContent?.trim())).toEqual([
			'Newest post',
			'Middle post',
			'Older post',
			'Oldest post'
		]);
		expect(titleLinks[0]).toHaveAttribute('href', '/blog/newest/');
	});

	it('renders each home post as a card with title, date, and description', () => {
		render(Page, { props: { data: { posts: samplePosts } } });
		const strip = screen.getByTestId('latest-posts');
		const cards = strip.querySelectorAll('[data-testid="post-card"]');
		expect(cards.length).toBe(samplePosts.length);

		const first = cards[0] as HTMLElement;
		expect(first.querySelector('[data-testid="post-card-title"]')?.textContent).toMatch(
			/Newest post/
		);
		expect(first.querySelector('time')?.textContent).toBe('2025-08-20');
		expect(first.querySelector('[data-testid="post-card-summary"]')?.textContent).toMatch(
			/Newest summary/
		);
	});

	it('falls back gracefully when a post has no description', () => {
		const noDesc = [{ ...samplePosts[2], description: undefined }];
		render(Page, { props: { data: { posts: noDesc } } });
		const card = screen.getByTestId('post-card');
		// no summary node when there's no description
		expect(card.querySelector('[data-testid="post-card-summary"]')).toBeNull();
		// title still renders
		expect(card.querySelector('[data-testid="post-card-title"]')?.textContent).toMatch(
			/Newest post/
		);
	});

	it('numbers each card with a monospace ordinal badge', () => {
		render(Page, { props: { data: { posts: samplePosts } } });
		const cards = screen.getAllByTestId('post-card');
		const ordinals = cards.map((c) => c.querySelector('[data-testid="post-card-ordinal"]')?.textContent?.trim());
		expect(ordinals).toEqual(['01', '02', '03', '04']);
	});

	it('renders tag chips on the card when the post has tags', () => {
		const tagged = [
			{ ...samplePosts[2], tags: ['java', 'spring'] }
		];
		render(Page, { props: { data: { posts: tagged } } });
		const card = screen.getByTestId('post-card');
		const tagEls = card.querySelectorAll('[data-testid="post-card-tag"]');
		expect(Array.from(tagEls).map((t) => t.textContent?.trim())).toEqual(['java', 'spring']);
	});

	it('omits the latest-posts strip when there are no posts', () => {
		render(Page, { props: { data: { posts: [] } } });
		expect(screen.queryByTestId('latest-posts')).toBeNull();
	});

	it('caps the home posts grid at the configured limit (12)', () => {
		render(Page, { props: { data: { posts: fixturePosts(30) } } });
		const cards = screen.getAllByTestId('post-card');
		expect(cards.length).toBe(12);
	});

	it('shows all posts on the home grid when fewer than the limit exist', () => {
		render(Page, { props: { data: { posts: fixturePosts(5) } } });
		const cards = screen.getAllByTestId('post-card');
		expect(cards.length).toBe(5);
	});
});

describe('site config', () => {
	it('exposes a numeric homePostsLimit', async () => {
		const { site } = await import('$lib/site');
		expect(typeof site.homePostsLimit).toBe('number');
		expect(site.homePostsLimit).toBeGreaterThan(0);
	});
});
