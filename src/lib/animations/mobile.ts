// Viewports at or above this width get the desktop scenes unchanged.
// Below it, expensive params (particle counts, line counts, shape counts) are
// scaled down so phones and small tablets keep a smooth frame rate.
export const MOBILE_BREAKPOINT = 540;

// Params whose value is "how many things to draw". Scaling these has the
// largest perf impact and the smallest visual impact.
// Per-key floor avoids over-clamping low-count params (lines, shapes) while
// keeping bigger ones (count) from collapsing to nothing.
const HEAVY_COUNT_KEYS: Record<string, number> = {
	count: 60,
	lines: 4,
	shapes: 4
};

// Mobile multiplier — keeps enough density to feel atmospheric without
// hammering low-end GPUs. Tuned by eye on a mid-range phone profile.
const MOBILE_SCALE = 0.4;

export function scaleForViewport<P extends Record<string, unknown>>(
	params: P,
	viewportWidth: number
): P {
	if (viewportWidth >= MOBILE_BREAKPOINT) return params;

	const out: Record<string, unknown> = { ...params };
	for (const [key, value] of Object.entries(params)) {
		const floor = HEAVY_COUNT_KEYS[key];
		if (floor === undefined) continue;
		if (typeof value !== 'number') continue;
		out[key] = Math.max(floor, Math.round(value * MOBILE_SCALE));
	}
	return out as P;
}
