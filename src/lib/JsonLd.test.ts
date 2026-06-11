import { render } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import JsonLd from './JsonLd.svelte';

function readJsonLdFromHead(): unknown[] {
	const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
	return Array.from(scripts).map((s) => JSON.parse(s.textContent ?? '{}'));
}

describe('JsonLd', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	it('emits an application/ld+json script with the given data', () => {
		render(JsonLd, {
			data: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'X' }
		});
		const found = readJsonLdFromHead();
		expect(found).toHaveLength(1);
		expect(found[0]).toEqual({
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'X'
		});
	});

	it('serialises nested objects safely', () => {
		render(JsonLd, {
			data: {
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				author: { '@type': 'Person', name: 'Dhanendra Kumar' },
				keywords: ['java', 'spring']
			}
		});
		const found = readJsonLdFromHead() as Array<Record<string, unknown>>;
		expect(found[0].author).toEqual({ '@type': 'Person', name: 'Dhanendra Kumar' });
		expect(found[0].keywords).toEqual(['java', 'spring']);
	});

	it('escapes </script> sequences to avoid breaking the page', () => {
		render(JsonLd, {
			data: { '@type': 'X', payload: 'a</script>b' }
		});
		const raw = document.head.querySelector('script[type="application/ld+json"]')?.textContent ?? '';
		expect(raw).not.toMatch(/<\/script>/i);
		// The JSON should still be parseable.
		expect(() => JSON.parse(raw)).not.toThrow();
	});
});
