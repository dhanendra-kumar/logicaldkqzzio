<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<header class="site-header">
	<a class="brand" href="/">LogicalDK</a>
	<nav aria-label="Primary">
		<a href="/blog/">blog</a>
		<a href="/about/">about</a>
		<ThemeToggle />
	</nav>
</header>

<style>
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
		border-bottom: 1px solid var(--color-border);
	}

	.brand {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--color-fg);
		text-decoration: none;
	}

	.brand::before {
		content: '~/';
		color: var(--color-accent);
	}

	nav {
		display: flex;
		gap: 1rem;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.9rem;
	}

	nav a {
		color: var(--color-muted);
		text-decoration: none;
	}

	nav a:hover {
		color: var(--color-fg);
	}
</style>
