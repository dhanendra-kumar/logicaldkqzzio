export type GeneratorName =
	| 'starfield'
	| 'particleNetwork'
	| 'lineWaves'
	| 'instancedCubes'
	| 'constellation'
	| 'lowPolyDrift'
	| 'torusKnotWire';

export type AnimationDef = {
	id: string;
	generator: GeneratorName;
	params: Record<string, number | string | boolean>;
	palette?: { from: string; via?: string; to: string };
};

export function mulberry32(seed: number): () => number {
	let t = seed >>> 0;
	return function () {
		t = (t + 0x6d2b79f5) >>> 0;
		let r = t;
		r = Math.imul(r ^ (r >>> 15), r | 1);
		r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
}

const palettes: AnimationDef['palette'][] = [
	{ from: '#7ee787', to: '#6fb4ff' },
	{ from: '#7ee787', via: '#6fb4ff', to: '#c490ff' },
	{ from: '#6fb4ff', to: '#c490ff' },
	{ from: '#0a7d23', via: '#0969da', to: '#7b3fe4' },
	{ from: '#a5f3aa', to: '#6fb4ff' },
	{ from: '#c490ff', via: '#6fb4ff', to: '#7ee787' },
	{ from: '#22d3ee', to: '#a78bfa' },
	{ from: '#f59e0b', via: '#ef4444', to: '#a855f7' }
];

type Pack = Record<string, number>;
type GenPacks = { generator: GeneratorName; packs: Pack[] };

const generatorPacks: GenPacks[] = [
	{
		generator: 'starfield',
		packs: [
			{ count: 600, depth: 600, speed: 0.3, size: 1.2 },
			{ count: 900, depth: 700, speed: 0.4, size: 1.3 },
			{ count: 1200, depth: 800, speed: 0.5, size: 1.4 },
			{ count: 1500, depth: 900, speed: 0.35, size: 1.1 },
			{ count: 1800, depth: 1000, speed: 0.25, size: 1.0 },
			{ count: 800, depth: 650, speed: 0.6, size: 1.6 },
			{ count: 2200, depth: 1100, speed: 0.2, size: 0.9 },
			{ count: 1000, depth: 750, speed: 0.45, size: 1.5 },
			{ count: 1400, depth: 850, speed: 0.55, size: 1.25 },
			{ count: 700, depth: 600, speed: 0.7, size: 1.7 },
			{ count: 1100, depth: 720, speed: 0.38, size: 1.15 },
			{ count: 1600, depth: 950, speed: 0.28, size: 1.05 },
			{ count: 1300, depth: 820, speed: 0.48, size: 1.35 },
			{ count: 950, depth: 680, speed: 0.42, size: 1.3 },
			{ count: 2000, depth: 1050, speed: 0.22, size: 0.95 }
		]
	},
	{
		generator: 'particleNetwork',
		packs: [
			{ count: 60, radius: 5, linkDistance: 1.5, speed: 0.2 },
			{ count: 80, radius: 6, linkDistance: 1.6, speed: 0.25 },
			{ count: 100, radius: 7, linkDistance: 1.7, speed: 0.3 },
			{ count: 120, radius: 8, linkDistance: 1.8, speed: 0.22 },
			{ count: 70, radius: 5.5, linkDistance: 1.4, speed: 0.35 },
			{ count: 90, radius: 6.5, linkDistance: 1.55, speed: 0.28 },
			{ count: 110, radius: 7.5, linkDistance: 1.75, speed: 0.18 },
			{ count: 75, radius: 6, linkDistance: 1.65, speed: 0.32 },
			{ count: 95, radius: 7, linkDistance: 1.5, speed: 0.24 },
			{ count: 85, radius: 6.2, linkDistance: 1.45, speed: 0.27 },
			{ count: 130, radius: 8.5, linkDistance: 1.9, speed: 0.2 },
			{ count: 65, radius: 5.2, linkDistance: 1.35, speed: 0.4 },
			{ count: 105, radius: 7.2, linkDistance: 1.7, speed: 0.26 },
			{ count: 115, radius: 7.8, linkDistance: 1.85, speed: 0.21 }
		]
	},
	{
		generator: 'lineWaves',
		packs: [
			{ lines: 10, amplitude: 1.0, speed: 0.5, segments: 70 },
			{ lines: 12, amplitude: 1.1, speed: 0.55, segments: 75 },
			{ lines: 14, amplitude: 1.2, speed: 0.6, segments: 80 },
			{ lines: 16, amplitude: 1.3, speed: 0.65, segments: 85 },
			{ lines: 18, amplitude: 1.4, speed: 0.7, segments: 90 },
			{ lines: 20, amplitude: 1.5, speed: 0.45, segments: 95 },
			{ lines: 8, amplitude: 0.9, speed: 0.8, segments: 65 },
			{ lines: 22, amplitude: 1.6, speed: 0.4, segments: 100 },
			{ lines: 11, amplitude: 1.15, speed: 0.58, segments: 72 },
			{ lines: 13, amplitude: 1.25, speed: 0.62, segments: 78 },
			{ lines: 15, amplitude: 1.35, speed: 0.68, segments: 82 },
			{ lines: 17, amplitude: 1.45, speed: 0.5, segments: 88 }
		]
	},
	{
		generator: 'instancedCubes',
		packs: [
			{ count: 150, spread: 10, speed: 0.3, size: 0.4 },
			{ count: 200, spread: 12, speed: 0.35, size: 0.45 },
			{ count: 250, spread: 14, speed: 0.4, size: 0.5 },
			{ count: 300, spread: 16, speed: 0.45, size: 0.55 },
			{ count: 350, spread: 18, speed: 0.25, size: 0.4 },
			{ count: 180, spread: 11, speed: 0.5, size: 0.6 },
			{ count: 220, spread: 13, speed: 0.32, size: 0.42 },
			{ count: 280, spread: 15, speed: 0.38, size: 0.48 },
			{ count: 320, spread: 17, speed: 0.28, size: 0.44 },
			{ count: 160, spread: 10.5, speed: 0.55, size: 0.5 },
			{ count: 240, spread: 13.5, speed: 0.36, size: 0.46 },
			{ count: 260, spread: 14.5, speed: 0.42, size: 0.52 }
		]
	},
	{
		generator: 'constellation',
		packs: [
			{ count: 60, links: 2, radius: 6, speed: 0.15 },
			{ count: 80, links: 3, radius: 7, speed: 0.2 },
			{ count: 100, links: 3, radius: 8, speed: 0.25 },
			{ count: 120, links: 4, radius: 9, speed: 0.18 },
			{ count: 70, links: 2, radius: 6.5, speed: 0.22 },
			{ count: 90, links: 3, radius: 7.5, speed: 0.17 },
			{ count: 110, links: 4, radius: 8.5, speed: 0.13 },
			{ count: 85, links: 3, radius: 7.2, speed: 0.19 },
			{ count: 95, links: 3, radius: 7.8, speed: 0.21 },
			{ count: 75, links: 2, radius: 6.8, speed: 0.24 },
			{ count: 105, links: 4, radius: 8.2, speed: 0.16 },
			{ count: 115, links: 4, radius: 8.8, speed: 0.14 }
		]
	},
	{
		generator: 'lowPolyDrift',
		packs: [
			{ shapes: 12, radius: 1.0, speed: 0.25, spread: 12 },
			{ shapes: 16, radius: 1.1, speed: 0.3, spread: 13 },
			{ shapes: 20, radius: 1.2, speed: 0.35, spread: 14 },
			{ shapes: 24, radius: 1.3, speed: 0.4, spread: 15 },
			{ shapes: 14, radius: 1.05, speed: 0.28, spread: 12.5 },
			{ shapes: 18, radius: 1.15, speed: 0.32, spread: 13.5 },
			{ shapes: 22, radius: 1.25, speed: 0.37, spread: 14.5 },
			{ shapes: 28, radius: 1.4, speed: 0.22, spread: 16 },
			{ shapes: 10, radius: 0.9, speed: 0.45, spread: 11 },
			{ shapes: 26, radius: 1.35, speed: 0.27, spread: 15.5 }
		]
	},
	{
		generator: 'torusKnotWire',
		packs: [
			{ p: 2, q: 3, radius: 2.0, tube: 0.5, speed: 0.15 },
			{ p: 2, q: 3, radius: 2.4, tube: 0.6, speed: 0.2 },
			{ p: 3, q: 4, radius: 2.6, tube: 0.55, speed: 0.18 },
			{ p: 3, q: 5, radius: 2.8, tube: 0.45, speed: 0.22 },
			{ p: 2, q: 5, radius: 2.5, tube: 0.5, speed: 0.25 },
			{ p: 4, q: 5, radius: 3.0, tube: 0.4, speed: 0.16 },
			{ p: 2, q: 7, radius: 2.7, tube: 0.45, speed: 0.19 },
			{ p: 3, q: 7, radius: 2.9, tube: 0.4, speed: 0.21 },
			{ p: 2, q: 3, radius: 2.2, tube: 0.65, speed: 0.17 },
			{ p: 5, q: 7, radius: 3.2, tube: 0.35, speed: 0.14 }
		]
	}
];

// Additional palette-only variants for the slimmer generators, to lift the
// total above 100 while keeping each pack visually distinct via its colorway.
const extraPaletteVariants: { generator: GeneratorName; baseIndex: number }[] = [
	{ generator: 'lineWaves', baseIndex: 0 },
	{ generator: 'lineWaves', baseIndex: 2 },
	{ generator: 'lineWaves', baseIndex: 5 },
	{ generator: 'instancedCubes', baseIndex: 1 },
	{ generator: 'instancedCubes', baseIndex: 4 },
	{ generator: 'instancedCubes', baseIndex: 7 },
	{ generator: 'constellation', baseIndex: 1 },
	{ generator: 'constellation', baseIndex: 3 },
	{ generator: 'constellation', baseIndex: 6 },
	{ generator: 'lowPolyDrift', baseIndex: 0 },
	{ generator: 'lowPolyDrift', baseIndex: 2 },
	{ generator: 'lowPolyDrift', baseIndex: 5 },
	{ generator: 'torusKnotWire', baseIndex: 0 },
	{ generator: 'torusKnotWire', baseIndex: 3 },
	{ generator: 'torusKnotWire', baseIndex: 6 },
	{ generator: 'torusKnotWire', baseIndex: 8 }
];

function buildBaseRegistry(): AnimationDef[] {
	const out: AnimationDef[] = [];
	for (const { generator, packs } of generatorPacks) {
		packs.forEach((params, i) => {
			const palette = palettes[(i + generator.length) % palettes.length];
			out.push({
				id: `${generator}-v${i.toString().padStart(2, '0')}`,
				generator,
				params,
				palette
			});
		});
	}
	let paletteCursor = 1;
	for (const ev of extraPaletteVariants) {
		const gp = generatorPacks.find((g) => g.generator === ev.generator);
		if (!gp) continue;
		const params = gp.packs[ev.baseIndex];
		const palette = palettes[(paletteCursor + ev.baseIndex) % palettes.length];
		out.push({
			id: `${ev.generator}-x${paletteCursor.toString().padStart(2, '0')}`,
			generator: ev.generator,
			params,
			palette
		});
		paletteCursor++;
	}
	return out;
}

const baseRegistry: AnimationDef[] = buildBaseRegistry();

// Internal mutable store so parameter packs (step 12) can extend without breaking the public API.
let _registry: AnimationDef[] = [...baseRegistry];

export function _setRegistry(defs: AnimationDef[]): void {
	_registry = [...defs];
}

export function getAllAnimations(): AnimationDef[] {
	return _registry;
}

export function getAnimationById(id: string): AnimationDef | undefined {
	return _registry.find((d) => d.id === id);
}

export function pickRandomAnimation(seed?: number): AnimationDef {
	const all = _registry;
	if (all.length === 0) throw new Error('animation registry is empty');
	const rand = seed === undefined ? Math.random : mulberry32(seed);
	const idx = Math.floor(rand() * all.length) % all.length;
	return all[idx];
}
