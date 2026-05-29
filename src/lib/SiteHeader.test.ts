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

	it('marks the blog link active when pathname starts with /blog', () => {
		render(SiteHeader, { props: { pathname: '/blog/' } });
		const blogLink = screen.getByRole('link', { name: /^blog$/i });
		expect(blogLink).toHaveAttribute('aria-current', 'page');
		const aboutLink = screen.getByRole('link', { name: /^about$/i });
		expect(aboutLink).not.toHaveAttribute('aria-current');
	});

	it('marks the about link active when pathname is /about', () => {
		render(SiteHeader, { props: { pathname: '/about/' } });
		const aboutLink = screen.getByRole('link', { name: /^about$/i });
		expect(aboutLink).toHaveAttribute('aria-current', 'page');
	});

	it('marks no nav link active on the home page', () => {
		render(SiteHeader, { props: { pathname: '/' } });
		expect(screen.getByRole('link', { name: /^blog$/i })).not.toHaveAttribute('aria-current');
		expect(screen.getByRole('link', { name: /^about$/i })).not.toHaveAttribute('aria-current');
	});

	it('renders inside a sticky banner with backdrop blur', () => {
		render(SiteHeader);
		const banner = screen.getByRole('banner');
		expect(banner.className).toMatch(/sticky/);
	});
});
