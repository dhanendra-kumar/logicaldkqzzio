import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/about page', () => {
	it('renders an About heading and identifies the author', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/about/i);
		expect(screen.getAllByText(/Dhanendra Kumar/i).length).toBeGreaterThan(0);
	});

	it('has Stack and Reach sections', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: /stack/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /reach/i })).toBeInTheDocument();
	});

	it('shows a profile card with links to GitHub and email', () => {
		render(Page);
		const github = screen.getByRole('link', { name: /github/i });
		expect(github).toHaveAttribute('href', expect.stringContaining('github.com'));
		const email = screen.getByRole('link', { name: /email/i });
		expect(email.getAttribute('href')).toMatch(/^mailto:/);
	});
});
