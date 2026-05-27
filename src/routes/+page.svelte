<script lang="ts">
	import SeoHead from '$lib/SeoHead.svelte';
	import { site } from '$lib/site';
</script>

<SeoHead title={site.title} description={site.description} url={site.url + '/'} />

<h1 class="font-mono">LogicalDK</h1>
<p>A blog about Java, Spring, and other things worth writing down.</p>
