import { render } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import SeoHead from './SeoHead.svelte';

function metaContent(selector: string): string | null {
	const el = document.head.querySelector(selector);
	return el?.getAttribute('content') ?? null;
}

describe('SeoHead', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
		document.title = '';
	});

	it('sets the page title', () => {
		render(SeoHead, {
			title: 'Hello, world',
			description: 'A first post',
			url: 'https://example.com/blog/hello-world/'
		});
		expect(document.title).toContain('Hello, world');
	});

	it('emits OpenGraph and Twitter card meta tags', () => {
		render(SeoHead, {
			title: 'Hello, world',
			description: 'A first post',
			url: 'https://example.com/blog/hello-world/'
		});

		expect(metaContent('meta[name="description"]')).toBe('A first post');
		expect(metaContent('meta[property="og:title"]')).toBe('Hello, world');
		expect(metaContent('meta[property="og:description"]')).toBe('A first post');
		expect(metaContent('meta[property="og:url"]')).toBe('https://example.com/blog/hello-world/');
		expect(metaContent('meta[name="twitter:card"]')).toBe('summary');
		expect(metaContent('meta[name="twitter:title"]')).toBe('Hello, world');
	});

	it('defaults og:type to website but allows override to article', () => {
		render(SeoHead, {
			title: 'A post',
			description: '',
			url: 'https://example.com/blog/p/',
			type: 'article'
		});
		expect(metaContent('meta[property="og:type"]')).toBe('article');
	});
});
