<script lang="ts">
	import { site } from './site';

	// Render the AdSense loader script in <head> on every page.
	// The script is required for AdSense site verification, Auto Ads, and
	// any future ad slots (ins.adsbygoogle).
	const src = $derived(
		`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsensePublisherId}`
	);
	const tag = $derived(
		site.adsensePublisherId
			? `<script async src="${src}" crossorigin="anonymous"><\/script>`
			: ''
	);
</script>

<svelte:head>
	{@html tag}
</svelte:head>
