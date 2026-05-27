import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import ThemeToggle from './ThemeToggle.svelte';

describe('ThemeToggle', () => {
	beforeEach(() => {
		document.documentElement.classList.remove('dark');
		localStorage.clear();
	});

	it('renders a button with an accessible label', () => {
		render(ThemeToggle);
		expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
	});

	it('adds the dark class to <html> when toggled to dark', async () => {
		render(ThemeToggle);
		const button = screen.getByRole('button', { name: /toggle theme/i });

		await fireEvent.click(button);
		expect(document.documentElement.classList.contains('dark')).toBe(true);

		await fireEvent.click(button);
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	it('persists the chosen theme to localStorage', async () => {
		render(ThemeToggle);
		const button = screen.getByRole('button', { name: /toggle theme/i });

		await fireEvent.click(button);
		expect(localStorage.getItem('theme')).toBe('dark');

		await fireEvent.click(button);
		expect(localStorage.getItem('theme')).toBe('light');
	});
});
