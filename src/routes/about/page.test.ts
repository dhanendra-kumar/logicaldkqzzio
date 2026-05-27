import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/about page', () => {
	it('renders an About heading and identifies the author', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/about/i);
		expect(screen.getByText(/Dhanendra Kumar/i)).toBeInTheDocument();
	});
});
