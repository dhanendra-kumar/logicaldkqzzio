import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

function StubPost() {
	return { default: function () {} };
}

describe('/blog/[slug] post page', () => {
	it('renders the post date as YYYY-MM-DD even when metadata.date is a Date object', () => {
		render(Page, {
			data: {
				Post: (() => {}) as unknown as never,
				metadata: {
					title: 'Hello, world',
					date: new Date('2026-05-22T00:00:00.000Z'),
					tags: []
				}
			}
		});

		const time = screen.getByText('2026-05-22');
		expect(time).toBeInTheDocument();
	});
});
