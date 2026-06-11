import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import BackgroundCanvas from './BackgroundCanvas.svelte';

describe('BackgroundCanvas', () => {
	it('renders an aria-hidden decorative wrapper', () => {
		const { container } = render(BackgroundCanvas);
		const wrapper = container.querySelector('.bg-canvas-wrapper');
		expect(wrapper).not.toBeNull();
		expect(wrapper).toHaveAttribute('aria-hidden', 'true');
	});

	it('does not pick an animation when prefers-reduced-motion is set', async () => {
		const mq = vi.fn().mockReturnValue({
			matches: true,
			media: '(prefers-reduced-motion: reduce)',
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			onchange: null,
			dispatchEvent: vi.fn()
		} as unknown as MediaQueryList);
		const original = window.matchMedia;
		window.matchMedia = mq;

		const { container } = render(BackgroundCanvas);
		// onMount fires synchronously in jsdom, so the data attribute should be empty.
		const wrapper = container.querySelector('.bg-canvas-wrapper');
		expect(wrapper?.getAttribute('data-animation')).toBe('');

		window.matchMedia = original;
	});

	it('still picks an animation on small (mobile) viewports', () => {
		const originalInner = window.innerWidth;
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: 400 });

		const { container } = render(BackgroundCanvas);
		const wrapper = container.querySelector('.bg-canvas-wrapper');
		expect(wrapper?.getAttribute('data-animation')).not.toBe('');

		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInner });
	});

	it('reflects the picked animation id on data-animation when given a pathname', () => {
		const { container } = render(BackgroundCanvas, { props: { pathname: '/' } });
		const wrapper = container.querySelector('.bg-canvas-wrapper');
		expect(wrapper?.getAttribute('data-animation')).not.toBe('');
	});

	it('picks a different animation when the pathname changes', async () => {
		const { container, rerender } = render(BackgroundCanvas, { props: { pathname: '/' } });
		const wrapper = container.querySelector('.bg-canvas-wrapper')!;
		const initial = wrapper.getAttribute('data-animation');
		expect(initial).not.toBe('');

		// Try a handful of pathnames; with 101 variants the odds of all collisions are ~zero.
		const candidates = ['/blog/', '/about/', '/blog/foo/', '/blog/tag/java/'];
		let changed = false;
		for (const p of candidates) {
			await rerender({ pathname: p });
			if (wrapper.getAttribute('data-animation') !== initial) {
				changed = true;
				break;
			}
		}
		expect(changed).toBe(true);
	});
});
