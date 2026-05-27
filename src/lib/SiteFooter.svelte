<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer>
	<p>&copy; {year} Dhanendra Kumar &middot; built with SvelteKit on GitHub Pages</p>
</footer>

<style>
	footer {
		margin-top: 4rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-muted);
		text-align: center;
	}

	footer p {
		margin: 0;
	}
</style>
