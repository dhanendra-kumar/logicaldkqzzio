<script lang="ts">
	import SeoHead from '$lib/SeoHead.svelte';
	import { site } from '$lib/site';
</script>

<SeoHead
	title="About"
	description="About Dhanendra Kumar — software engineer, motorcyclist, occasional blogger."
	url="{site.url}/about/"
/>

<h1>About</h1>

<section class="profile">
	<div class="avatar" aria-hidden="true">
		<span>DK</span>
	</div>
	<div class="bio">
		<p class="name">
			<strong>Dhanendra Kumar</strong> — software engineer
		</p>
		<p class="role">A decade of Java, Spring Boot, MongoDB, and the small details in between.</p>
	</div>
</section>

<p>
	I write here when I figure something out that I would have liked to read myself. Posts lean
	toward backend topics — the JVM ecosystem, data modeling, the small operational details that
	take a week to learn and ten seconds to forget.
</p>

<h2>Stack I work with</h2>
<ul class="stack">
	<li><strong>Languages:</strong> Java, Groovy, TypeScript, a little Kotlin</li>
	<li><strong>Frameworks:</strong> Spring Boot, Grails, SvelteKit (this site)</li>
	<li><strong>Data:</strong> MongoDB, PostgreSQL, occasionally Oracle</li>
	<li><strong>Ops:</strong> Docker, GitHub Actions, GitLab CI</li>
</ul>

<h2>Outside of work</h2>
<p>
	Motorcycling and long rides — the longest so far was a nine-day trip to Leh and Ladakh.
	Photography along the way. Trance and rock when I'm coding.
</p>

<h2>Reach me</h2>
<ul class="reach">
	<li>
		<a href="https://github.com/dhanendra-kumar" aria-label="GitHub: @dhanendra-kumar">
			<span class="key">GitHub</span>
			<span class="val">@dhanendra-kumar</span>
		</a>
	</li>
	<li>
		<a href="mailto:dhanendrakumarkht@gmail.com" aria-label="Email: dhanendrakumarkht@gmail.com">
			<span class="key">Email</span>
			<span class="val">dhanendrakumarkht@gmail.com</span>
		</a>
	</li>
</ul>

<style>
	.profile {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background-color: var(--color-surface);
		box-shadow: var(--shadow-soft);
		margin: 0.5rem 0 1.5rem;
	}

	.avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 1.1rem;
		color: #fff;
		background-image: linear-gradient(135deg, var(--color-grad-1), var(--color-grad-2), var(--color-grad-3));
		box-shadow: var(--shadow-glow);
		flex-shrink: 0;
	}

	.bio p {
		margin: 0;
	}

	.bio .name {
		font-size: 1rem;
	}

	.bio .role {
		color: var(--color-muted);
		font-size: 0.9rem;
		margin-top: 0.2rem;
	}

	.stack {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 0.4rem;
	}

	.stack li {
		padding: 0.5rem 0.75rem;
		border-left: 2px solid var(--color-accent);
		background: var(--color-accent-soft);
		border-radius: 4px;
	}

	.reach {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}

	.reach li a {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		padding: 0.6rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		background-color: var(--color-surface);
		color: var(--color-fg);
		background-image: none;
	}

	.reach li a:hover {
		border-color: var(--color-accent);
		background-color: var(--color-surface-hover);
		color: var(--color-fg);
		background-image: none;
	}

	.reach .key {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--color-muted);
	}

	.reach .val {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--color-link);
	}
</style>
