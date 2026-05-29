<script lang="ts">
	import { onDestroy } from 'svelte';
	import { pickRandomAnimation, type AnimationDef } from './registry';
	import type { SceneHandle } from './scene';

	let { pathname, seed }: { pathname?: string; seed?: number } = $props();

	let canvas: HTMLCanvasElement | null = $state(null);
	let handle: SceneHandle | null = null;
	let pendingId = 0;

	function isReducedMotion(): boolean {
		if (typeof window === 'undefined') return true;
		try {
			return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		} catch {
			return false;
		}
	}

	function isSmallViewport(): boolean {
		if (typeof window === 'undefined') return false;
		return window.innerWidth < 540;
	}

	function hashString(s: string): number {
		let h = 2166136261;
		for (let i = 0; i < s.length; i++) {
			h ^= s.charCodeAt(i);
			h = Math.imul(h, 16777619);
		}
		return h >>> 0;
	}

	function pickFor(path: string | undefined, baseSeed: number | undefined): AnimationDef {
		// Combine the pathname hash with an optional explicit seed and a per-load nonce
		// so each navigation picks a new variant even if the same path is revisited.
		const navNonce = typeof window !== 'undefined' ? Math.floor(Math.random() * 1e9) : 0;
		const composed = (hashString(path ?? '/') ^ ((baseSeed ?? 0) >>> 0) ^ navNonce) >>> 0;
		return pickRandomAnimation(composed);
	}

	const active: AnimationDef | null = $derived.by(() => {
		if (typeof window === 'undefined') return null;
		if (isReducedMotion()) return null;
		if (isSmallViewport()) return null;
		return pickFor(pathname, seed);
	});

	$effect(() => {
		const def = active;
		const el = canvas;
		if (!def || !el) return;

		const myId = ++pendingId;
		// Tear down any in-flight scene before we mount a new one.
		const prev = handle;
		handle = null;
		prev?.dispose();

		let cancelled = false;
		(async () => {
			const mod = await import('./scene');
			if (cancelled || myId !== pendingId || !canvas) return;
			handle = await mod.mountScene(canvas, def);
		})();

		return () => {
			cancelled = true;
		};
	});

	onDestroy(() => {
		pendingId++;
		handle?.dispose();
		handle = null;
	});
</script>

<div class="bg-canvas-wrapper" aria-hidden="true" data-animation={active?.id ?? ''}>
	<canvas bind:this={canvas}></canvas>
	<div class="grain"></div>
	<div class="vignette"></div>
</div>

<style>
	.bg-canvas-wrapper {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	canvas {
		display: block;
		width: 100vw;
		height: 100vh;
		opacity: 0.9;
	}

	:global(.dark) .bg-canvas-wrapper canvas {
		opacity: 0.95;
	}

	.grain,
	.vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.vignette {
		background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.25) 100%);
	}

	:global(.dark) .bg-canvas-wrapper .vignette {
		background: radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.55) 100%);
	}

	.grain {
		opacity: 0.05;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>");
	}

	@media (prefers-reduced-motion: reduce) {
		canvas {
			display: none;
		}
	}
</style>
