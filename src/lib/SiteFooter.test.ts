import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import SiteFooter from './SiteFooter.svelte';

describe('SiteFooter', () => {
	it('renders a copyright line with the current year', () => {
		render(SiteFooter);
		const year = new Date().getFullYear();
		expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
	});

	it('links to the RSS feed', () => {
		render(SiteFooter);
		const rss = screen.getByRole('link', { name: /rss/i });
		expect(rss).toHaveAttribute('href', '/rss.xml');
	});

	it('links to the GitHub source', () => {
		render(SiteFooter);
		const gh = screen.getByRole('link', { name: /github/i });
		expect(gh.getAttribute('href')).toMatch(/github\.com/);
	});
});
