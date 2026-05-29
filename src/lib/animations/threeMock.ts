import { vi } from 'vitest';
import type { ThreeLike } from './generators';

// Test-only fixture: a minimal three.js-shaped mock that lets generators
// build a scene, tick, and dispose without pulling in actual three.
export function makeThreeMock() {
	const counters = { geom: 0, mat: 0 };

	class Group {
		children: unknown[] = [];
		rotation = { x: 0, y: 0, z: 0 };
		position = { x: 0, y: 0, z: 0 };
		scale = { x: 1, y: 1, z: 1, set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; } };
		add(...c: unknown[]) {
			this.children.push(...c);
			return this;
		}
	}
	class BufferGeometry {
		attrs = new Map<string, unknown>();
		setAttribute = vi.fn((name: string, attr: unknown) => this.attrs.set(name, attr));
		setIndex = vi.fn();
		setFromPoints = vi.fn();
		computeBoundingSphere = vi.fn();
		dispose = vi.fn(() => counters.geom++);
	}
	class BoxGeometry extends BufferGeometry {
		constructor(public w?: number, public h?: number, public d?: number) {
			super();
		}
	}
	class TorusKnotGeometry extends BufferGeometry {
		constructor(public r?: number, public t?: number, public ts?: number, public rs?: number, public p?: number, public q?: number) {
			super();
		}
	}
	class IcosahedronGeometry extends BufferGeometry {
		constructor(public r?: number, public detail?: number) {
			super();
		}
	}
	class BufferAttribute {
		constructor(public array: ArrayLike<number>, public itemSize: number) {}
	}
	class Color {
		r = 1;
		g = 1;
		b = 1;
		constructor(public _hex?: string) {}
	}
	class Material {
		opts: Record<string, unknown>;
		dispose = vi.fn(() => counters.mat++);
		constructor(opts?: Record<string, unknown>) {
			this.opts = opts ?? {};
		}
	}
	class Points {
		rotation = { x: 0, y: 0, z: 0 };
		position = { x: 0, y: 0, z: 0 };
		constructor(public geometry: BufferGeometry, public material: Material) {}
	}
	class LineSegments {
		rotation = { x: 0, y: 0, z: 0 };
		position = { x: 0, y: 0, z: 0 };
		constructor(public geometry: BufferGeometry, public material: Material) {}
	}
	class Line {
		rotation = { x: 0, y: 0, z: 0 };
		position = { x: 0, y: 0, z: 0 };
		constructor(public geometry: BufferGeometry, public material: Material) {}
	}
	class Mesh {
		rotation = { x: 0, y: 0, z: 0 };
		position = { x: 0, y: 0, z: 0 };
		scale = { x: 1, y: 1, z: 1, set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; } };
		constructor(public geometry: BufferGeometry, public material: Material) {}
	}
	class InstancedMesh {
		count: number;
		instanceMatrix = { needsUpdate: false };
		instanceColor: { needsUpdate: boolean } | null = null;
		setMatrixAt = vi.fn();
		setColorAt = vi.fn();
		rotation = { x: 0, y: 0, z: 0 };
		constructor(public geometry: BufferGeometry, public material: Material, count: number) {
			this.count = count;
		}
	}
	class Vector3 {
		constructor(public x = 0, public y = 0, public z = 0) {}
		set(x: number, y: number, z: number) {
			this.x = x;
			this.y = y;
			this.z = z;
			return this;
		}
	}
	class Matrix4 {
		elements = new Array(16).fill(0);
		compose = vi.fn();
		makeRotationY = vi.fn();
	}
	class Quaternion {
		constructor(public x = 0, public y = 0, public z = 0, public w = 1) {}
		setFromEuler = vi.fn();
	}
	class Euler {
		constructor(public x = 0, public y = 0, public z = 0) {}
	}

	const three = {
		Group,
		BufferGeometry,
		BoxGeometry,
		TorusKnotGeometry,
		IcosahedronGeometry,
		BufferAttribute,
		Float32BufferAttribute: BufferAttribute,
		Color,
		PointsMaterial: Material,
		LineBasicMaterial: Material,
		MeshBasicMaterial: Material,
		MeshStandardMaterial: Material,
		Points,
		LineSegments,
		Line,
		Mesh,
		InstancedMesh,
		Vector3,
		Matrix4,
		Quaternion,
		Euler,
		AdditiveBlending: 1
	} as unknown as ThreeLike & Record<string, unknown>;

	return { three, counters };
}
