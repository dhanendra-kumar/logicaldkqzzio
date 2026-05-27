import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import SiteFooter from './SiteFooter.svelte';

describe('SiteFooter', () => {
	it('renders a copyright line with the current year', () => {
		render(SiteFooter);
		const year = new Date().getFullYear();
		expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
	});
});
