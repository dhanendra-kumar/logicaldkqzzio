<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/formatDate';
	import SeoHead from '$lib/SeoHead.svelte';
	import JsonLd from '$lib/JsonLd.svelte';
	import { site } from '$lib/site';

	let { data }: { data: PageData } = $props();
	const formattedDate = $derived(formatDate(data.metadata.date));
	const tags = $derived(data.metadata.tags ?? []);
</script>

<SeoHead
	title={data.metadata.title}
	description={data.metadata.description ?? ''}
	url="{site.url}/blog/{data.slug}/"
	type="article"
	publishedTime={formattedDate}
	author={site.author}
	{tags}
/>

<JsonLd
	data={{
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: data.metadata.title,
		description: data.metadata.description ?? '',
		datePublished: formattedDate,
		dateModified: formattedDate,
		inLanguage: 'en',
		mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/blog/${data.slug}/` },
		url: `${site.url}/blog/${data.slug}/`,
		image: `${site.url}${site.defaultOgImage}`,
		keywords: tags,
		author: { '@type': 'Person', name: site.author },
		publisher: { '@type': 'Organization', name: site.title, url: site.url }
	}}
/>

<article>
	<header>
		<time datetime={formattedDate}>{formattedDate}</time>
		{#if tags.length > 0}
			<ul class="tag-list">
				{#each tags as tag (tag)}
					<li><a href="/blog/tag/{tag}/">#{tag}</a></li>
				{/each}
			</ul>
		{/if}
	</header>
	<data.Post />
</article>

<style>
	.tag-list {
		display: inline-flex;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0 0 0 0.75rem;
	}

	.tag-list a {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-muted);
		text-decoration: none;
	}

	.tag-list a:hover {
		color: var(--color-accent);
	}
</style>
