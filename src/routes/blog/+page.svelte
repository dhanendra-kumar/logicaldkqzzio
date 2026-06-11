<script lang="ts">
	import type { PageData } from './$types';
	import SeoHead from '$lib/SeoHead.svelte';
	import JsonLd from '$lib/JsonLd.svelte';
	import { site } from '$lib/site';

	let { data }: { data: PageData } = $props();

	const sortedPosts = $derived(
		[...data.posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
	);
</script>

<SeoHead title="Blog" description="All posts on {site.title}" url="{site.url}/blog/" />

<JsonLd
	data={{
		'@context': 'https://schema.org',
		'@type': 'Blog',
		name: `${site.title} — Blog`,
		url: `${site.url}/blog/`,
		description: `All posts on ${site.title}`,
		inLanguage: 'en',
		author: { '@type': 'Person', name: site.author },
		blogPost: sortedPosts.map((p) => ({
			'@type': 'BlogPosting',
			headline: p.title,
			url: `${site.url}/blog/${p.slug}/`,
			datePublished: p.date,
			keywords: p.tags
		}))
	}}
/>

<h1>Blog</h1>
<p class="lede">Everything I've written down — newest first.</p>

<ul class="post-list">
	{#each sortedPosts as post (post.slug)}
		<li class="post-card">
			<a class="card-link" href="/blog/{post.slug}/">
				<time datetime={post.date}>{post.date}</time>
				<span class="title">{post.title}</span>
			</a>
			{#if post.tags.length > 0}
				<div class="tags" aria-label="tags">
					{#each post.tags as tag (tag)}
						<a class="tag" href="/blog/tag/{tag}/">{tag}</a>
					{/each}
				</div>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.lede {
		color: var(--color-muted);
		margin-top: -0.25rem;
		margin-bottom: 1.5rem;
	}

	.post-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.75rem;
	}

	.post-card {
		position: relative;
		padding: 0.85rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background-color: var(--color-surface);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease,
			background-color 180ms ease;
	}

	.post-card:hover {
		transform: translateY(-1px);
		border-color: var(--color-accent);
		background-color: var(--color-surface-hover);
		box-shadow: var(--shadow-soft);
	}

	.card-link {
		display: flex;
		gap: 1.25rem;
		align-items: baseline;
		background: none;
		color: var(--color-fg);
	}

	.card-link:hover {
		background: none;
		color: var(--color-fg);
	}

	.card-link time {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-muted);
		min-width: 6.5rem;
		flex-shrink: 0;
	}

	.title {
		font-weight: 500;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.5rem;
		padding-left: 7.75rem;
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		color: var(--color-muted);
		background: var(--color-accent-soft);
		border: 1px solid transparent;
	}

	.tag:hover {
		color: var(--color-accent-strong);
		border-color: var(--color-accent);
		background-image: none;
	}

	@media (max-width: 540px) {
		.card-link {
			flex-direction: column;
			gap: 0.25rem;
		}
		.tags {
			padding-left: 0;
		}
	}
</style>
