<script lang="ts">
	import { site } from './site';

	type Props = {
		title: string;
		description: string;
		url: string;
		type?: 'website' | 'article';
		image?: string;
		publishedTime?: string;
		author?: string;
		tags?: string[];
	};

	let {
		title,
		description,
		url,
		type = 'website',
		image,
		publishedTime,
		author,
		tags
	}: Props = $props();

	const fullTitle = $derived(title === site.title ? title : `${title} — ${site.title}`);

	function absolute(u: string): string {
		if (/^https?:\/\//.test(u)) return u;
		const base = site.url.replace(/\/$/, '');
		return base + (u.startsWith('/') ? u : `/${u}`);
	}

	const ogImage = $derived(absolute(image ?? site.defaultOgImage));
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
	<meta property="og:locale" content={site.locale} />
	<meta property="og:image" content={ogImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		{#if author}
			<meta name="author" content={author} />
			<meta property="article:author" content={author} />
		{/if}
		{#if tags}
			{#each tags as tag (tag)}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}
</svelte:head>
