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
		expect(metaContent('meta[name="twitter:card"]')).toBe('summary_large_image');
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

	it('emits a default OG image and uses the large-image twitter card', () => {
		render(SeoHead, {
			title: 'Hello',
			description: 'World',
			url: 'https://example.com/'
		});
		const ogImage = metaContent('meta[property="og:image"]');
		expect(ogImage, 'expected an og:image meta tag').toBeTruthy();
		expect(ogImage).toMatch(/^https?:\/\//);
		expect(metaContent('meta[name="twitter:card"]')).toBe('summary_large_image');
		expect(metaContent('meta[name="twitter:image"]')).toBe(ogImage);
	});

	it('allows an explicit image to override the default', () => {
		render(SeoHead, {
			title: 'Post',
			description: 'Body',
			url: 'https://example.com/blog/p/',
			image: 'https://example.com/custom-image.png'
		});
		expect(metaContent('meta[property="og:image"]')).toBe('https://example.com/custom-image.png');
		expect(metaContent('meta[name="twitter:image"]')).toBe('https://example.com/custom-image.png');
	});

	it('emits article meta when type=article and article fields are provided', () => {
		render(SeoHead, {
			title: 'A post',
			description: '',
			url: 'https://example.com/blog/p/',
			type: 'article',
			publishedTime: '2026-06-11',
			author: 'Dhanendra Kumar',
			tags: ['java', 'spring']
		});
		expect(metaContent('meta[property="article:published_time"]')).toBe('2026-06-11');
		expect(metaContent('meta[property="article:author"]')).toBe('Dhanendra Kumar');
		expect(metaContent('meta[name="author"]')).toBe('Dhanendra Kumar');
		const tagMetas = Array.from(document.head.querySelectorAll('meta[property="article:tag"]')).map((m) =>
			m.getAttribute('content')
		);
		expect(tagMetas).toEqual(['java', 'spring']);
	});

	it('omits article meta when type is website', () => {
		render(SeoHead, {
			title: 'Home',
			description: '',
			url: 'https://example.com/',
			publishedTime: '2026-06-11',
			author: 'Dhanendra Kumar'
		});
		expect(document.head.querySelector('meta[property="article:published_time"]')).toBeNull();
		expect(document.head.querySelector('meta[property="article:author"]')).toBeNull();
	});
});
