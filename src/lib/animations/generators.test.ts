import { describe, it, expect, vi } from 'vitest';
import { starfield, type ThreeLike } from './generators';

function makeThreeMock() {
	const disposed = { geometry: 0, material: 0 };
	const setAttribute = vi.fn();
	const geomDispose = vi.fn(() => disposed.geometry++);
	const matDispose = vi.fn(() => disposed.material++);

	const three: ThreeLike = {
		Group: class {
			children: unknown[] = [];
			rotation = { x: 0, y: 0, z: 0 };
			position = { x: 0, y: 0, z: 0 };
			add(...c: unknown[]) {
				this.children.push(...c);
				return this;
			}
		} as unknown as ThreeLike['Group'],
		BufferGeometry: class {
			setAttribute = setAttribute;
			dispose = geomDispose;
		} as unknown as ThreeLike['BufferGeometry'],
		BufferAttribute: class {
			array: ArrayLike<number>;
			itemSize: number;
			constructor(a: ArrayLike<number>, i: number) {
				this.array = a;
				this.itemSize = i;
			}
		} as unknown as ThreeLike['BufferAttribute'],
		Color: class {
			r = 1;
			g = 1;
			b = 1;
			constructor(_hex?: string) {}
		} as unknown as ThreeLike['Color'],
		PointsMaterial: class {
			opts: Record<string, unknown>;
			dispose = matDispose;
			constructor(opts?: Record<string, unknown>) {
				this.opts = opts ?? {};
			}
		} as unknown as ThreeLike['PointsMaterial'],
		Points: class {
			geometry: { dispose: () => void };
			material: { dispose: () => void };
			rotation = { x: 0, y: 0, z: 0 };
			constructor(g: { dispose: () => void }, m: { dispose: () => void }) {
				this.geometry = g;
				this.material = m;
			}
		} as unknown as ThreeLike['Points']
	};

	return { three, disposed, setAttribute };
}

describe('starfield generator', () => {
	it('builds a group containing a points cloud with N×3 positions', () => {
		const { three, setAttribute } = makeThreeMock();
		const result = starfield({ count: 200 }, { from: '#7ee787', to: '#6fb4ff' }, three);

		expect(result.object).toBeDefined();
		expect(setAttribute).toHaveBeenCalled();
		const [name, attr] = setAttribute.mock.calls[0] as [string, { array: Float32Array; itemSize: number }];
		expect(name).toBe('position');
		expect(attr.array.length).toBe(200 * 3);
		expect(attr.itemSize).toBe(3);
	});

	it('clamps tiny counts to a sane minimum', () => {
		const { three, setAttribute } = makeThreeMock();
		starfield({ count: 5 }, { from: '#7ee787', to: '#6fb4ff' }, three);
		const [, attr] = setAttribute.mock.calls[0] as [string, { array: Float32Array }];
		expect(attr.array.length).toBeGreaterThanOrEqual(50 * 3);
	});

	it('tick advances rotation deterministically', () => {
		const { three } = makeThreeMock();
		const result = starfield({ count: 100, speed: 1 }, { from: '#7ee787', to: '#6fb4ff' }, three);
		const points = (result.object as unknown as { children: { rotation: { y: number } }[] }).children[0];
		const initialY = points.rotation.y;
		result.tick(1);
		expect(points.rotation.y).not.toBe(initialY);
	});

	it('dispose releases geometry and material', () => {
		const { three, disposed } = makeThreeMock();
		const result = starfield({ count: 100 }, { from: '#7ee787', to: '#6fb4ff' }, three);
		result.dispose();
		expect(disposed.geometry).toBe(1);
		expect(disposed.material).toBe(1);
	});
});
