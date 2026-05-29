import { describe, it, expect } from 'vitest';
import {
	mulberry32,
	getAllAnimations,
	pickRandomAnimation,
	getAnimationById
} from './registry';

describe('mulberry32', () => {
	it('is deterministic for a given seed', () => {
		const a = mulberry32(42);
		const b = mulberry32(42);
		const seqA = Array.from({ length: 5 }, () => a());
		const seqB = Array.from({ length: 5 }, () => b());
		expect(seqA).toEqual(seqB);
	});

	it('produces values in [0, 1)', () => {
		const r = mulberry32(7);
		for (let i = 0; i < 50; i++) {
			const v = r();
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
	});

	it('produces different sequences for different seeds', () => {
		const a = mulberry32(1);
		const b = mulberry32(2);
		expect(a()).not.toBe(b());
	});
});

describe('animation registry', () => {
	it('exposes at least 100 distinct animation definitions', () => {
		const all = getAllAnimations();
		expect(all.length).toBeGreaterThanOrEqual(100);
		const ids = new Set(all.map((d) => d.id));
		expect(ids.size).toBe(all.length);
	});

	it('exposes a non-empty list of definitions', () => {
		const all = getAllAnimations();
		expect(all.length).toBeGreaterThan(0);
	});

	it('every animation has a unique id, a generator name, and params object', () => {
		const all = getAllAnimations();
		const ids = new Set<string>();
		for (const def of all) {
			expect(typeof def.id).toBe('string');
			expect(def.id.length).toBeGreaterThan(0);
			expect(ids.has(def.id), `duplicate id: ${def.id}`).toBe(false);
			ids.add(def.id);
			expect(typeof def.generator).toBe('string');
			expect(def.params).toBeTypeOf('object');
		}
	});

	it('every generator name references a known generator', () => {
		const known = new Set([
			'starfield',
			'particleNetwork',
			'lineWaves',
			'instancedCubes',
			'constellation',
			'lowPolyDrift',
			'torusKnotWire'
		]);
		for (const def of getAllAnimations()) {
			expect(known.has(def.generator), `unknown generator: ${def.generator}`).toBe(true);
		}
	});
});

describe('pickRandomAnimation', () => {
	it('returns a registry entry', () => {
		const ids = new Set(getAllAnimations().map((d) => d.id));
		const def = pickRandomAnimation(0);
		expect(ids.has(def.id)).toBe(true);
	});

	it('is deterministic given the same seed', () => {
		const a = pickRandomAnimation(123);
		const b = pickRandomAnimation(123);
		expect(a.id).toBe(b.id);
	});

	it('can return different entries for different seeds', () => {
		const seen = new Set<string>();
		for (let s = 0; s < 50; s++) {
			seen.add(pickRandomAnimation(s).id);
		}
		expect(seen.size).toBeGreaterThan(1);
	});
});

describe('getAnimationById', () => {
	it('returns the matching definition', () => {
		const first = getAllAnimations()[0];
		expect(getAnimationById(first.id)).toEqual(first);
	});

	it('returns undefined for an unknown id', () => {
		expect(getAnimationById('does-not-exist-anywhere')).toBeUndefined();
	});
});
