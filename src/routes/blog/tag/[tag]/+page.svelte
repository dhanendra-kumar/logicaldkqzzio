<script lang="ts">
	import type { PageData } from './$types';
	import SeoHead from '$lib/SeoHead.svelte';
	import { site } from '$lib/site';

	let { data }: { data: PageData } = $props();

	const sortedPosts = $derived(
		[...data.posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
	);
</script>

<SeoHead
	title="#{data.tag}"
	description="Posts tagged {data.tag} on {site.title}"
	url="{site.url}/blog/tag/{data.tag}/"
/>

<h1>tag: {data.tag}</h1>
<p>
	<a href="/blog/">&larr; all posts</a>
</p>

<ul class="post-list">
	{#each sortedPosts as post (post.slug)}
		<li>
			<time datetime={post.date}>{post.date}</time>
			<a href="/blog/{post.slug}/">{post.title}</a>
		</li>
	{/each}
</ul>

<style>
	.post-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.post-list li {
		display: flex;
		gap: 1.25rem;
		align-items: baseline;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.post-list li:last-child {
		border-bottom: none;
	}

	.post-list time {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--color-muted);
		min-width: 6.5rem;
		flex-shrink: 0;
	}
</style>
