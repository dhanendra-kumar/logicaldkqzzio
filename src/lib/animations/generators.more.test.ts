import { describe, it, expect } from 'vitest';
import {
	particleNetwork,
	lineWaves,
	instancedCubes,
	constellation,
	lowPolyDrift,
	torusKnotWire
} from './generators';
import { makeThreeMock } from './threeMock';

const palette = { from: '#7ee787', via: '#6fb4ff', to: '#c490ff' };

function smokeTest(name: string, build: (three: ReturnType<typeof makeThreeMock>['three']) => ReturnType<typeof torusKnotWire>) {
	describe(`${name} generator`, () => {
		it('builds an object', () => {
			const { three } = makeThreeMock();
			const r = build(three);
			expect(r.object).toBeDefined();
		});
		it('tick runs without throwing', () => {
			const { three } = makeThreeMock();
			const r = build(three);
			expect(() => {
				r.tick(0.016);
				r.tick(0.032);
			}).not.toThrow();
		});
		it('dispose releases geometry and material at least once each', () => {
			const { three, counters } = makeThreeMock();
			const r = build(three);
			r.dispose();
			expect(counters.geom).toBeGreaterThan(0);
			expect(counters.mat).toBeGreaterThan(0);
		});
	});
}

smokeTest('particleNetwork', (three) =>
	particleNetwork({ count: 60, radius: 5, linkDistance: 2, speed: 0.3 }, palette, three)
);
smokeTest('lineWaves', (three) =>
	lineWaves({ lines: 8, amplitude: 1, speed: 0.6, segments: 60 }, palette, three)
);
smokeTest('instancedCubes', (three) =>
	instancedCubes({ count: 120, spread: 12, speed: 0.4, size: 0.6 }, palette, three)
);
smokeTest('constellation', (three) =>
	constellation({ count: 80, links: 3, radius: 7, speed: 0.2 }, palette, three)
);
smokeTest('lowPolyDrift', (three) =>
	lowPolyDrift({ shapes: 18, radius: 1.2, speed: 0.3, spread: 14 }, palette, three)
);
smokeTest('torusKnotWire', (three) =>
	torusKnotWire({ p: 2, q: 3, radius: 2.4, tube: 0.6, speed: 0.2 }, palette, three)
);
