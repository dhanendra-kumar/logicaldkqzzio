// Lightweight structural type for the parts of three.js we use.
// Lets generators stay unit-testable without bundling three into the test runtime.
// New constructors can be added freely; we cast to ThreeLikeAny inside generators
// to keep the public surface small.
export interface ThreeLike {
	Group: new () => {
		children: unknown[];
		rotation: { x: number; y: number; z: number };
		position: { x: number; y: number; z: number };
		add: (...c: unknown[]) => unknown;
	};
	BufferGeometry: new () => {
		setAttribute: (name: string, attr: unknown) => void;
		dispose: () => void;
	};
	BufferAttribute: new (array: ArrayLike<number>, itemSize: number) => {
		array: ArrayLike<number>;
		itemSize: number;
	};
	Color: new (hex?: string) => { r: number; g: number; b: number };
	PointsMaterial: new (opts?: Record<string, unknown>) => { dispose: () => void };
	Points: new (
		geom: { dispose: () => void },
		mat: { dispose: () => void }
	) => { rotation: { x: number; y: number; z: number } };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ThreeLikeAny = ThreeLike & Record<string, any>;

export type Palette = { from: string; via?: string; to: string };

export type GeneratorResult = {
	object: unknown;
	tick: (dt: number) => void;
	dispose: () => void;
};

export type GeneratorParams = Record<string, number | string | boolean>;

function num(p: GeneratorParams, key: string, fallback: number): number {
	const v = p[key];
	return typeof v === 'number' ? v : fallback;
}

function pickColor(palette: Palette, three: ThreeLikeAny, t: number): InstanceType<ThreeLike['Color']> {
	const stops = palette.via ? [palette.from, palette.via, palette.to] : [palette.from, palette.to];
	const idx = Math.min(stops.length - 1, Math.floor(t * stops.length));
	return new three.Color(stops[idx]);
}

export function starfield(
	params: GeneratorParams,
	palette: Palette,
	three: ThreeLike
): GeneratorResult {
	const count = Math.max(50, num(params, 'count', 1200));
	const depth = num(params, 'depth', 800);
	const speed = num(params, 'speed', 0.4);
	const size = num(params, 'size', 1.4);

	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		positions[i * 3] = (Math.random() - 0.5) * depth;
		positions[i * 3 + 1] = (Math.random() - 0.5) * depth;
		positions[i * 3 + 2] = (Math.random() - 0.5) * depth;
	}

	const geometry = new three.BufferGeometry();
	geometry.setAttribute('position', new three.BufferAttribute(positions, 3));

	const material = new three.PointsMaterial({
		size,
		color: new three.Color(palette.from),
		sizeAttenuation: true,
		transparent: true,
		opacity: 0.85
	});

	const points = new three.Points(geometry, material);
	const group = new three.Group();
	group.add(points);

	return {
		object: group,
		tick(dt: number) {
			points.rotation.y += dt * 0.05 * speed;
			points.rotation.x += dt * 0.01 * speed;
		},
		dispose() {
			geometry.dispose();
			material.dispose();
		}
	};
}

// ---- particleNetwork: points + thin lines connecting nearby neighbours ----
export function particleNetwork(
	params: GeneratorParams,
	palette: Palette,
	t: ThreeLike
): GeneratorResult {
	const three = t as ThreeLikeAny;
	const count = Math.max(20, num(params, 'count', 90));
	const radius = num(params, 'radius', 6);
	const linkDistance = num(params, 'linkDistance', 1.6);
	const speed = num(params, 'speed', 0.25);

	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		positions[i * 3] = (Math.random() - 0.5) * radius * 2;
		positions[i * 3 + 1] = (Math.random() - 0.5) * radius * 2;
		positions[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;
	}

	const pointsGeom = new three.BufferGeometry();
	pointsGeom.setAttribute('position', new three.BufferAttribute(positions, 3));
	const pointsMat = new three.PointsMaterial({
		size: 0.08,
		color: new three.Color(palette.from),
		transparent: true,
		opacity: 0.9
	});
	const points = new three.Points(pointsGeom, pointsMat);

	const linkPositions: number[] = [];
	for (let i = 0; i < count; i++) {
		for (let j = i + 1; j < count; j++) {
			const dx = positions[i * 3] - positions[j * 3];
			const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
			const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
			if (dx * dx + dy * dy + dz * dz < linkDistance * linkDistance) {
				linkPositions.push(
					positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
					positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
				);
			}
		}
	}
	const linkGeom = new three.BufferGeometry();
	linkGeom.setAttribute('position', new three.BufferAttribute(new Float32Array(linkPositions), 3));
	const linkMat = new three.LineBasicMaterial({
		color: pickColor(palette, three, 0.6),
		transparent: true,
		opacity: 0.35
	});
	const lines = new three.LineSegments(linkGeom, linkMat);

	const group = new three.Group();
	group.add(points);
	group.add(lines);

	return {
		object: group,
		tick(dt: number) {
			group.rotation.y += dt * 0.05 * speed;
		},
		dispose() {
			pointsGeom.dispose();
			pointsMat.dispose();
			linkGeom.dispose();
			linkMat.dispose();
		}
	};
}

// ---- lineWaves: stacked sinusoid ribbons ----
export function lineWaves(
	params: GeneratorParams,
	palette: Palette,
	t: ThreeLike
): GeneratorResult {
	const three = t as ThreeLikeAny;
	const lineCount = Math.max(3, num(params, 'lines', 14));
	const amplitude = num(params, 'amplitude', 1.2);
	const speed = num(params, 'speed', 0.6);
	const segments = Math.max(20, num(params, 'segments', 80));
	const stride = num(params, 'stride', 0.45);

	const group = new three.Group();
	const geometries: { dispose(): void }[] = [];
	const materials: { dispose(): void }[] = [];
	const lines: { rotation: { x: number; y: number; z: number }; position: { x: number; y: number; z: number } }[] = [];
	const phases: number[] = [];

	for (let l = 0; l < lineCount; l++) {
		const positions = new Float32Array(segments * 3);
		const phase = (l / lineCount) * Math.PI * 2;
		phases.push(phase);
		for (let s = 0; s < segments; s++) {
			const x = (s / (segments - 1) - 0.5) * 12;
			positions[s * 3] = x;
			positions[s * 3 + 1] = Math.sin(x * 0.9 + phase) * amplitude;
			positions[s * 3 + 2] = 0;
		}
		const geom = new three.BufferGeometry();
		geom.setAttribute('position', new three.BufferAttribute(positions, 3));
		const mat = new three.LineBasicMaterial({
			color: pickColor(palette, three, l / lineCount),
			transparent: true,
			opacity: 0.55
		});
		const line = new three.Line(geom, mat);
		line.position.y = (l - lineCount / 2) * stride;
		group.add(line);
		geometries.push(geom);
		materials.push(mat);
		lines.push(line);
	}

	let elapsed = 0;
	return {
		object: group,
		tick(dt: number) {
			elapsed += dt * speed;
			for (let i = 0; i < lines.length; i++) {
				lines[i].rotation.z = Math.sin(elapsed + phases[i]) * 0.02;
			}
		},
		dispose() {
			geometries.forEach((g) => g.dispose());
			materials.forEach((m) => m.dispose());
		}
	};
}

// ---- instancedCubes: a drifting cubic pixel-field ----
export function instancedCubes(
	params: GeneratorParams,
	palette: Palette,
	t: ThreeLike
): GeneratorResult {
	const three = t as ThreeLikeAny;
	const count = Math.max(20, num(params, 'count', 300));
	const spread = num(params, 'spread', 12);
	const speed = num(params, 'speed', 0.4);
	const size = num(params, 'size', 0.45);

	const geom = new three.BoxGeometry(size, size, size);
	const mat = new three.MeshBasicMaterial({
		color: pickColor(palette, three, 0.4),
		transparent: true,
		opacity: 0.65
	});
	const mesh = new three.InstancedMesh(geom, mat, count);

	const matrix = new three.Matrix4();
	const q = new three.Quaternion();
	const e = new three.Euler();
	const pos = new three.Vector3();
	const scl = new three.Vector3(1, 1, 1);
	for (let i = 0; i < count; i++) {
		pos.set(
			(Math.random() - 0.5) * spread,
			(Math.random() - 0.5) * spread,
			(Math.random() - 0.5) * spread
		);
		e.x = Math.random() * Math.PI;
		e.y = Math.random() * Math.PI;
		e.z = Math.random() * Math.PI;
		q.setFromEuler(e);
		matrix.compose(pos, q, scl);
		mesh.setMatrixAt(i, matrix);
	}
	mesh.instanceMatrix.needsUpdate = true;

	const group = new three.Group();
	group.add(mesh);

	return {
		object: group,
		tick(dt: number) {
			mesh.rotation.y += dt * 0.04 * speed;
			mesh.rotation.x += dt * 0.02 * speed;
		},
		dispose() {
			geom.dispose();
			mat.dispose();
		}
	};
}

// ---- constellation: scattered stars with curated link arcs ----
export function constellation(
	params: GeneratorParams,
	palette: Palette,
	t: ThreeLike
): GeneratorResult {
	const three = t as ThreeLikeAny;
	const count = Math.max(20, num(params, 'count', 80));
	const links = Math.max(1, num(params, 'links', 3));
	const radius = num(params, 'radius', 7);
	const speed = num(params, 'speed', 0.2);

	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		const phi = Math.acos(2 * Math.random() - 1);
		const theta = Math.random() * Math.PI * 2;
		positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
		positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
		positions[i * 3 + 2] = radius * Math.cos(phi);
	}

	const pGeom = new three.BufferGeometry();
	pGeom.setAttribute('position', new three.BufferAttribute(positions, 3));
	const pMat = new three.PointsMaterial({
		size: 0.12,
		color: new three.Color(palette.from),
		transparent: true,
		opacity: 0.9
	});
	const pts = new three.Points(pGeom, pMat);

	const linkPositions: number[] = [];
	for (let i = 0; i < count; i++) {
		for (let k = 0; k < links; k++) {
			const j = Math.floor(Math.random() * count);
			if (j === i) continue;
			linkPositions.push(
				positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
				positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
			);
		}
	}
	const lGeom = new three.BufferGeometry();
	lGeom.setAttribute('position', new three.BufferAttribute(new Float32Array(linkPositions), 3));
	const lMat = new three.LineBasicMaterial({
		color: pickColor(palette, three, 0.8),
		transparent: true,
		opacity: 0.25
	});
	const segs = new three.LineSegments(lGeom, lMat);

	const group = new three.Group();
	group.add(pts);
	group.add(segs);

	return {
		object: group,
		tick(dt: number) {
			group.rotation.y += dt * 0.03 * speed;
			group.rotation.x += dt * 0.015 * speed;
		},
		dispose() {
			pGeom.dispose();
			pMat.dispose();
			lGeom.dispose();
			lMat.dispose();
		}
	};
}

// ---- lowPolyDrift: floating icosahedra ----
export function lowPolyDrift(
	params: GeneratorParams,
	palette: Palette,
	t: ThreeLike
): GeneratorResult {
	const three = t as ThreeLikeAny;
	const shapeCount = Math.max(4, num(params, 'shapes', 18));
	const radius = num(params, 'radius', 1.2);
	const speed = num(params, 'speed', 0.3);
	const spread = num(params, 'spread', 14);

	const group = new three.Group();
	const geometries: { dispose(): void }[] = [];
	const materials: { dispose(): void }[] = [];
	const meshes: { rotation: { x: number; y: number; z: number } }[] = [];

	for (let i = 0; i < shapeCount; i++) {
		const geom = new three.IcosahedronGeometry(radius * (0.6 + Math.random() * 0.8), 0);
		const mat = new three.MeshBasicMaterial({
			color: pickColor(palette, three, i / shapeCount),
			transparent: true,
			opacity: 0.55,
			wireframe: true
		});
		const mesh = new three.Mesh(geom, mat);
		mesh.position.x = (Math.random() - 0.5) * spread;
		mesh.position.y = (Math.random() - 0.5) * spread;
		mesh.position.z = (Math.random() - 0.5) * spread;
		group.add(mesh);
		geometries.push(geom);
		materials.push(mat);
		meshes.push(mesh);
	}

	return {
		object: group,
		tick(dt: number) {
			for (const m of meshes) {
				m.rotation.x += dt * 0.2 * speed;
				m.rotation.y += dt * 0.3 * speed;
			}
		},
		dispose() {
			geometries.forEach((g) => g.dispose());
			materials.forEach((m) => m.dispose());
		}
	};
}

// ---- torusKnotWire: a slowly spinning wireframe knot ----
export function torusKnotWire(
	params: GeneratorParams,
	palette: Palette,
	t: ThreeLike
): GeneratorResult {
	const three = t as ThreeLikeAny;
	const p = num(params, 'p', 2);
	const q = num(params, 'q', 3);
	const radius = num(params, 'radius', 2.4);
	const tube = num(params, 'tube', 0.6);
	const speed = num(params, 'speed', 0.2);

	const geom = new three.TorusKnotGeometry(radius, tube, 140, 18, p, q);
	const mat = new three.MeshBasicMaterial({
		color: pickColor(palette, three, 0.5),
		transparent: true,
		opacity: 0.55,
		wireframe: true
	});
	const mesh = new three.Mesh(geom, mat);
	const group = new three.Group();
	group.add(mesh);

	return {
		object: group,
		tick(dt: number) {
			mesh.rotation.y += dt * 0.3 * speed;
			mesh.rotation.x += dt * 0.15 * speed;
		},
		dispose() {
			geom.dispose();
			mat.dispose();
		}
	};
}
