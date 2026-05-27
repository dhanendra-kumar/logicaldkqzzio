<script lang="ts">
	import { site } from './site';

	type Props = {
		title: string;
		description: string;
		url: string;
		type?: 'website' | 'article';
	};

	let { title, description, url, type = 'website' }: Props = $props();

	const fullTitle = $derived(title === site.title ? title : `${title} — ${site.title}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={site.title} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
