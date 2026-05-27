export function formatDate(input: string | Date): string {
	const date = typeof input === 'string' ? new Date(input) : input;
	if (Number.isNaN(date.getTime())) {
		return typeof input === 'string' ? input : '';
	}
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, '0');
	const d = String(date.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}
