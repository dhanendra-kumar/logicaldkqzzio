<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer>
	<div class="row">
		<p class="copy">&copy; {year} Dhanendra Kumar</p>
		<nav class="links" aria-label="Footer">
			<a href="/rss.xml" aria-label="RSS feed">RSS</a>
			<span aria-hidden="true">·</span>
			<a href="https://github.com/dhanendra-kumar" aria-label="GitHub">GitHub</a>
			<span aria-hidden="true">·</span>
			<span class="meta">built with SvelteKit</span>
		</nav>
	</div>
</footer>

<style>
	footer {
		margin-top: 4rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-muted);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: space-between;
		align-items: center;
	}

	.copy {
		margin: 0;
	}

	.links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.links a {
		color: var(--color-muted);
		background-image: none;
	}

	.links a:hover {
		color: var(--color-accent);
		background-image: none;
	}

	.meta {
		color: var(--color-muted);
		opacity: 0.7;
	}
</style>
