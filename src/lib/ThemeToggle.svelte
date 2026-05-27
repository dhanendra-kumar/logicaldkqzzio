<script lang="ts">
	import { onMount } from 'svelte';

	let isDark = $state(false);

	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');
	});

	function toggle() {
		isDark = !isDark;
		document.documentElement.classList.toggle('dark', isDark);
		try {
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		} catch {
			// localStorage unavailable; silent.
		}
	}
</script>

<button type="button" aria-label="Toggle theme" onclick={toggle}>
	{isDark ? 'light' : 'dark'}
</button>
