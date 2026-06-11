<script lang="ts">
	import SeoHead from '$lib/SeoHead.svelte';
	import JsonLd from '$lib/JsonLd.svelte';
	import { site } from '$lib/site';

	type Post = {
		slug: string;
		title: string;
		date: string;
		tags: string[];
		description?: string;
	};
	let { data }: { data: { posts: Post[] } } = $props();

	const latest = $derived(
		[...(data?.posts ?? [])]
			.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
			.slice(0, site.homePostsLimit)
	);
</script>

<SeoHead title={site.title} description={site.description} url={site.url + '/'} />

<JsonLd
	data={{
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: site.title,
		url: site.url + '/',
		description: site.description,
		inLanguage: 'en',
		author: { '@type': 'Person', name: site.author }
	}}
/>

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
		<ul class="cards">
			{#each latest as post, i (post.slug)}
				<li class="card" data-testid="post-card">
					<div class="card-meta">
						<span
							class="card-ordinal"
							data-testid="post-card-ordinal"
							aria-hidden="true"
						>{String(i + 1).padStart(2, '0')}</span>
						<time class="card-date" datetime={post.date}>{post.date}</time>
					</div>
					<a
						class="card-title"
						data-testid="post-card-title"
						href="/blog/{post.slug}/"
					>
						{post.title}
					</a>
					{#if post.description}
						<p class="card-summary" data-testid="post-card-summary">
							{post.description}
						</p>
					{/if}
					{#if post.tags.length > 0}
						<ul class="card-tags" aria-label="tags">
							{#each post.tags as tag (tag)}
								<li>
									<span class="card-tag" data-testid="post-card-tag">{tag}</span>
								</li>
							{/each}
						</ul>
					{/if}
					<span class="card-cta" aria-hidden="true">Read post →</span>
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

	.strip .cards {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1rem;
	}

	.strip .card {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 1.1rem 1.15rem 0.9rem;
		border-radius: 14px;
		background:
			linear-gradient(var(--color-bg-elevated), var(--color-bg-elevated)) padding-box,
			linear-gradient(135deg, var(--color-border), var(--color-border)) border-box;
		border: 1px solid transparent;
		box-shadow: var(--shadow-soft);
		position: relative;
		overflow: hidden;
		transition:
			transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
			box-shadow 240ms ease,
			background 240ms ease;
	}

	/* Subtle accent line along the top edge — hidden until hover, then a full gradient. */
	.strip .card::before {
		content: '';
		position: absolute;
		left: 1.15rem;
		right: 1.15rem;
		top: 0;
		height: 2px;
		border-radius: 0 0 2px 2px;
		background-image: linear-gradient(90deg, var(--color-grad-1), var(--color-grad-2), var(--color-grad-3));
		opacity: 0.35;
		transition: opacity 240ms ease, left 240ms ease, right 240ms ease;
	}

	/* Soft radial glow that bleeds in from the top-right on hover. */
	.strip .card::after {
		content: '';
		position: absolute;
		top: -40%;
		right: -30%;
		width: 80%;
		height: 80%;
		background: radial-gradient(circle, var(--color-accent-soft) 0%, transparent 60%);
		opacity: 0;
		transition: opacity 320ms ease;
		pointer-events: none;
	}

	.strip .card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-glow);
		background:
			linear-gradient(var(--color-bg-elevated), var(--color-bg-elevated)) padding-box,
			linear-gradient(135deg, var(--color-grad-1), var(--color-grad-2), var(--color-grad-3)) border-box;
	}

	.strip .card:hover::before {
		opacity: 1;
		left: 0;
		right: 0;
		border-radius: 0;
	}

	.strip .card:hover::after {
		opacity: 1;
	}

	.strip .card-meta {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.strip .card-ordinal {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		color: var(--color-accent);
		background: var(--color-accent-soft);
	}

	.strip .card-date {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-muted);
		letter-spacing: 0.02em;
	}

	.strip .card-title {
		font-family: var(--font-mono);
		font-size: 1.02rem;
		font-weight: 600;
		color: var(--color-fg);
		background: none;
		line-height: 1.3;
		text-decoration: none;
		text-wrap: balance;
		transition: color 200ms ease;
	}

	.strip .card-title:hover {
		color: var(--color-fg);
		background: none;
	}

	/* Whole card is clickable via the title's stretched ::after. */
	.strip .card-title::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 14px;
		z-index: 1;
	}

	.strip .card:hover .card-title {
		background-image: linear-gradient(90deg, var(--color-grad-1), var(--color-grad-2));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.strip .card-summary {
		margin: 0;
		font-size: 0.88rem;
		color: var(--color-muted);
		line-height: 1.55;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.strip .card-tags {
		list-style: none;
		padding: 0;
		margin: 0.15rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		position: relative;
		z-index: 2;
	}

	.strip .card-tag {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		padding: 0.12rem 0.5rem;
		border-radius: 999px;
		color: var(--color-muted);
		background: var(--color-accent-soft);
		border: 1px solid transparent;
		transition: color 180ms ease, border-color 180ms ease;
	}

	.strip .card:hover .card-tag {
		color: var(--color-accent-strong);
		border-color: var(--color-accent);
	}

	.strip .card-cta {
		margin-top: auto;
		padding-top: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--color-accent);
		opacity: 0;
		transform: translateY(2px);
		transition: opacity 200ms ease, transform 200ms ease;
	}

	.strip .card:hover .card-cta {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.strip .card,
		.strip .card::before,
		.strip .card::after,
		.strip .card-title,
		.strip .card-cta {
			transition: none;
		}
		.strip .card:hover {
			transform: none;
		}
	}
</style>
