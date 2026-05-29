<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/SiteHeader.svelte';
	import SiteFooter from '$lib/SiteFooter.svelte';
	import BackgroundCanvas from '$lib/animations/BackgroundCanvas.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="alternate" type="application/rss+xml" title="LogicalDK" href="/rss.xml" />
</svelte:head>

<div class="backdrop" aria-hidden="true"></div>
<BackgroundCanvas pathname={page.url?.pathname ?? '/'} />

<div class="page">
	<SiteHeader />
	<div class="content">
		<main>
			{@render children()}
		</main>
		<SiteFooter />
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: -1;
		background:
			radial-gradient(60% 50% at 20% 10%, var(--color-accent-soft), transparent 60%),
			radial-gradient(50% 40% at 85% 30%, rgba(105, 180, 255, 0.1), transparent 70%),
			radial-gradient(55% 45% at 60% 90%, rgba(196, 144, 255, 0.08), transparent 70%);
		pointer-events: none;
	}

	.page {
		position: relative;
		z-index: 2;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.content {
		width: 80%;
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 1.25rem 2rem;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
		padding-top: 1.5rem;
	}

	@media (max-width: 720px) {
		.content {
			width: 100%;
			padding: 0 1rem 2rem;
		}
	}
</style>
