// Client-only runtime that mounts a chosen animation into a canvas.
// Imported dynamically by BackgroundCanvas.svelte so three.js never touches
// the SSR/prerender path.
import type { AnimationDef } from './registry';
import {
	starfield,
	particleNetwork,
	lineWaves,
	instancedCubes,
	constellation,
	lowPolyDrift,
	torusKnotWire,
	type GeneratorResult,
	type Palette,
	type ThreeLike
} from './generators';

export type SceneHandle = {
	dispose: () => void;
	pause: () => void;
	resume: () => void;
};

type Generator = (params: AnimationDef['params'], palette: Palette, three: ThreeLike) => GeneratorResult;

const generators: Record<string, Generator> = {
	starfield: starfield as unknown as Generator,
	particleNetwork: particleNetwork as unknown as Generator,
	lineWaves: lineWaves as unknown as Generator,
	instancedCubes: instancedCubes as unknown as Generator,
	constellation: constellation as unknown as Generator,
	lowPolyDrift: lowPolyDrift as unknown as Generator,
	torusKnotWire: torusKnotWire as unknown as Generator
};

export async function mountScene(canvas: HTMLCanvasElement, def: AnimationDef): Promise<SceneHandle> {
	const three = await import('three');
	const palette = def.palette ?? { from: '#7ee787', to: '#6fb4ff' };
	const generator = generators[def.generator];
	if (!generator) throw new Error(`unknown generator: ${def.generator}`);

	const scene = new three.Scene();
	const camera = new three.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
	camera.position.z = 12;

	const renderer = new three.WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
	renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
	renderer.setClearColor(0x000000, 0);

	const built = generator(def.params, palette, three as unknown as ThreeLike);
	scene.add(built.object as unknown as import('three').Object3D);

	let last = performance.now();
	let rafId = 0;
	let running = true;

	const onResize = () => {
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h, false);
	};
	window.addEventListener('resize', onResize);

	const onVisibility = () => {
		if (document.hidden) pause();
		else resume();
	};
	document.addEventListener('visibilitychange', onVisibility);

	function frame(now: number) {
		if (!running) return;
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;
		built.tick(dt);
		renderer.render(scene, camera);
		rafId = requestAnimationFrame(frame);
	}
	rafId = requestAnimationFrame((t) => {
		last = t;
		frame(t);
	});

	function pause() {
		if (!running) return;
		running = false;
		cancelAnimationFrame(rafId);
	}
	function resume() {
		if (running) return;
		running = true;
		last = performance.now();
		rafId = requestAnimationFrame(frame);
	}

	return {
		pause,
		resume,
		dispose() {
			pause();
			window.removeEventListener('resize', onResize);
			document.removeEventListener('visibilitychange', onVisibility);
			built.dispose();
			renderer.dispose();
		}
	};
}
