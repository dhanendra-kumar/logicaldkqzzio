<script lang="ts">
	import SeoHead from '$lib/SeoHead.svelte';
	import { site } from '$lib/site';

	type Post = { slug: string; title: string; date: string; tags: string[] };
	let { data }: { data: { posts: Post[] } } = $props();

	const latest = $derived(
		[...(data?.posts ?? [])]
			.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
			.slice(0, 3)
	);
</script>

<SeoHead title={site.title} description={site.description} url={site.url + '/'} />

<section class="hero">
	<h1 class="font-mono">LogicalDK<span class="caret" aria-hidden="true"></span></h1>
	<p class="tagline">
		Backend notes from a decade of <strong>Java</strong>, <strong>Spring</strong>, and the
		<strong>JVM</strong> — small operational details that take a week to learn and ten seconds to
		forget.
	</p>
	<div class="actions">
		<a class="cta" href="/blog/">Read the blog →</a>
		<a class="cta-secondary" href="/about/">About me</a>
	</div>
</section>

{#if latest.length > 0}
	<section class="strip" data-testid="latest-posts" aria-labelledby="latest-heading">
		<header class="strip-head">
			<h2 id="latest-heading">— Latest posts</h2>
			<a class="strip-all" href="/blog/">all posts →</a>
		</header>
		<ul>
			{#each latest as post (post.slug)}
				<li>
					<time datetime={post.date}>{post.date}</time>
					<a href="/blog/{post.slug}/">{post.title}</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.hero {
		padding: 1.5rem 0 2rem;
	}

	.caret {
		display: inline-block;
		width: 0.6ch;
		height: 1em;
		margin-left: 0.15ch;
		background: linear-gradient(180deg, var(--color-grad-1), var(--color-grad-2));
		vertical-align: -0.12em;
		border-radius: 1px;
		animation: blink 1.05s steps(1, end) infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.caret {
			animation: none;
		}
	}

	.tagline {
		font-size: 1.125rem;
		color: var(--color-fg);
		margin-top: 0.5rem;
	}

	.tagline strong {
		font-weight: 600;
		background: linear-gradient(90deg, var(--color-grad-1), var(--color-grad-2));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.cta,
	.cta-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.4ch;
		padding: 0.55rem 1rem;
		border-radius: 8px;
		font-family: var(--font-mono);
		font-size: 0.95rem;
		background: none;
		transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
	}

	.cta {
		color: #fff;
		background-image: linear-gradient(135deg, var(--color-grad-1), var(--color-grad-2));
		box-shadow: var(--shadow-soft);
	}

	.cta:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-glow);
		color: #fff;
		background-image: linear-gradient(135deg, var(--color-grad-2), var(--color-grad-3));
	}

	.cta-secondary {
		color: var(--color-fg);
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
	}

	.cta-secondary:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
		background-color: var(--color-surface-hover);
	}

	.strip {
		margin-top: 2.5rem;
		padding: 1.25rem 1.25rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background-color: var(--color-surface);
		box-shadow: var(--shadow-soft);
	}

	.strip-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.5rem;
	}

	.strip-head h2 {
		font-size: 0.95rem;
		color: var(--color-muted);
		margin: 0;
	}

	.strip-all {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--color-muted);
		background: none;
	}

	.strip-all:hover {
		color: var(--color-accent);
		background: none;
	}

	.strip ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.strip li {
		display: flex;
		gap: 1rem;
		align-items: baseline;
		padding: 0.6rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.strip li:last-child {
		border-bottom: none;
	}

	.strip time {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-muted);
		min-width: 6.5rem;
		flex-shrink: 0;
	}
</style>
