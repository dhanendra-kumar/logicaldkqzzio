import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import SiteHeader from './SiteHeader.svelte';

describe('SiteHeader', () => {
	it('renders the site name as a link to home', () => {
		render(SiteHeader);
		const homeLink = screen.getByRole('link', { name: /logicaldk/i });
		expect(homeLink).toHaveAttribute('href', '/');
	});

	it('exposes navigation to blog and about', () => {
		render(SiteHeader);
		expect(screen.getByRole('link', { name: /^blog$/i })).toHaveAttribute('href', '/blog/');
		expect(screen.getByRole('link', { name: /^about$/i })).toHaveAttribute('href', '/about/');
	});
});
