<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from './ThemeToggle.svelte';

	let { pathname }: { pathname?: string } = $props();

	const currentPath = $derived(pathname ?? page.url?.pathname ?? '/');
	const isBlog = $derived(currentPath.startsWith('/blog'));
	const isAbout = $derived(currentPath.startsWith('/about'));
</script>

<header class="site-header sticky">
	<div class="inner">
		<a class="brand" href="/">LogicalDK</a>
		<nav aria-label="Primary">
			<a href="/blog/" aria-current={isBlog ? 'page' : undefined}>blog</a>
			<a href="/about/" aria-current={isAbout ? 'page' : undefined}>about</a>
			<ThemeToggle />
		</nav>
	</div>
</header>

<style>
	.site-header {
		width: 100%;
		margin-bottom: 2rem;
	}

	.site-header.sticky {
		position: sticky;
		top: 0;
		z-index: 20;
		background: var(--color-surface);
		backdrop-filter: blur(12px) saturate(140%);
		-webkit-backdrop-filter: blur(12px) saturate(140%);
		border-bottom: 1px solid var(--color-border);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 80%;
		max-width: 1100px;
		margin: 0 auto;
		padding: 0.75rem 1.25rem;
	}

	@media (max-width: 720px) {
		.inner {
			width: 100%;
			padding: 0.75rem 1rem;
		}
	}

	.brand {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--color-fg);
		background: none;
		letter-spacing: -0.01em;
	}

	.brand::before {
		content: '~/';
		background: linear-gradient(90deg, var(--color-grad-1), var(--color-grad-2));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	nav {
		display: flex;
		gap: 1.25rem;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.9rem;
	}

	nav a {
		color: var(--color-muted);
		background: none;
		position: relative;
		padding: 0.25rem 0;
		transition: color 180ms ease;
	}

	nav a:hover {
		color: var(--color-fg);
		background: none;
	}

	nav a[aria-current='page'] {
		color: var(--color-fg);
	}

	nav a[aria-current='page']::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -2px;
		height: 2px;
		background: linear-gradient(90deg, var(--color-grad-1), var(--color-grad-2));
		border-radius: 2px;
	}
</style>
