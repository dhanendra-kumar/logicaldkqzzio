<script lang="ts">
	type Props = { data: Record<string, unknown> };
	let { data }: Props = $props();

	const CLOSING_SCRIPT = /<\/script>/gi;
	// Escape closing script tags so an unlucky or hostile string in the
	// serialised JSON cannot terminate the surrounding script element.
	const serialised = $derived(JSON.stringify(data).replace(CLOSING_SCRIPT, '<\\/script>'));
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${serialised}<\/script>`}
</svelte:head>
