import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const postPath = resolve(process.cwd(), 'src/posts/claude-skill-for-spring-boot.md');

describe('blog post: claude-skill-for-spring-boot', () => {
	it('exists at the expected slug', () => {
		expect(existsSync(postPath)).toBe(true);
	});

	const md = existsSync(postPath) ? readFileSync(postPath, 'utf8') : '';

	it('has frontmatter with title, ISO date, and tags', () => {
		const fm = md.match(/^---\n([\s\S]+?)\n---/);
		expect(fm, 'frontmatter block missing').toBeTruthy();
		const block = fm![1];
		expect(block).toMatch(/^title:\s*.+$/m);
		expect(block).toMatch(/^date:\s*['"]?20\d{2}-\d{2}-\d{2}['"]?$/m);
		expect(block).toMatch(/^tags:\s*\[.*claude.*\]/im);
		expect(block).toMatch(/spring/i);
	});

	it('frames the four levels of Claude integration', () => {
		// The post must name all four artefact types so readers can place themselves.
		expect(md).toMatch(/CLAUDE\.md/);
		expect(md).toMatch(/skill/i);
		expect(md).toMatch(/subagent|sub-agent/i);
		expect(md).toMatch(/API/);
	});

	it('ships a concrete Claude Code skill file in a fenced code block', () => {
		// A fenced block whose body looks like a skill markdown file
		// (frontmatter inside, with name + description).
		const fences = [...md.matchAll(/```[\w-]*\n([\s\S]*?)```/g)].map((m) => m[1]);
		const hasSkill = fences.some(
			(body) => /^---[\s\S]*?\bname:\s*\S+[\s\S]*?\bdescription:/m.test(body)
		);
		expect(hasSkill, 'expected a code block containing a skill frontmatter').toBe(true);
	});

	it('covers the requested practices: TDD, layering, testing, code style, PMD/Checkstyle', () => {
		expect(md).toMatch(/TDD|test.driven/i);
		expect(md).toMatch(/controller|facade|service|repository/i);
		expect(md).toMatch(/JUnit|Mockito|Testcontainers/i);
		expect(md).toMatch(/Lombok|immutab|@Transactional/i);
		expect(md).toMatch(/PMD/);
		expect(md).toMatch(/Checkstyle/i);
	});
});
