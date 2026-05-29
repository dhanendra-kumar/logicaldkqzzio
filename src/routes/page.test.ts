import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

const samplePosts = [
	{ slug: 'older', title: 'Older post', date: '2024-01-01', tags: [] },
	{ slug: 'middle', title: 'Middle post', date: '2025-03-15', tags: [] },
	{ slug: 'newest', title: 'Newest post', date: '2025-08-20', tags: [] },
	{ slug: 'oldest', title: 'Oldest post', date: '2023-06-01', tags: [] }
];

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

	it('shows the three most recent posts in a latest-posts strip', () => {
		render(Page, { props: { data: { posts: samplePosts } } });
		const strip = screen.getByTestId('latest-posts');
		const listLinks = Array.from(strip.querySelectorAll('ul a')) as HTMLAnchorElement[];
		expect(listLinks.map((l) => l.textContent)).toEqual([
			'Newest post',
			'Middle post',
			'Older post'
		]);
		expect(listLinks[0]).toHaveAttribute('href', '/blog/newest/');
	});

	it('omits the latest-posts strip when there are no posts', () => {
		render(Page, { props: { data: { posts: [] } } });
		expect(screen.queryByTestId('latest-posts')).toBeNull();
	});
});
