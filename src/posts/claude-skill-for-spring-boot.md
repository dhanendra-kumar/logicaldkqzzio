---
title: A Claude skill that follows your Spring Boot project practices
date: '2026-06-10'
tags: [claude, spring-boot, java, ai, tooling]
description: Where to put project conventions so Claude actually follows them — and a ready-to-drop skill file for a generic Spring Boot codebase.
---

Most teams I talk to are using Claude wrong. Not the prompts — the *placement*. They paste their conventions into a chat window at the start of every session, watch Claude follow them for fifteen minutes, and then quietly drift back to default behaviour the moment the context window gets crowded.

The fix isn't a better prompt. It's putting the conventions somewhere Claude reads on *every* turn. There are four places to do that, and they layer. This post walks through them in order of strength, then drops a complete Claude Code skill you can paste into a generic Spring Boot project.

## The four levels

Think of it as a staircase. Each rung is more powerful and more specific than the one below it.

**1. `CLAUDE.md`** — a markdown file at the repo root. Claude Code reads it at the start of every session and keeps it in context. Best for *always-on* rules that apply everywhere: "we use Maven", "tests live under `src/test/java`", "never commit without `./mvnw verify` passing". Lowest friction, no trigger needed, but it competes with everything else for context budget.

**2. Claude Code skill** — a markdown file under `.claude/skills/your-skill.md` with frontmatter declaring `name` and `description`. Claude loads it lazily and can invoke it by name (`/spring-boot-practices`) or when its description matches the user's request. Best for *named workflows* you want to summon on demand: "review this PR against our practices", "scaffold a new service in our layering". Cheaper than `CLAUDE.md` because it only loads when relevant.

**3. Subagent** — a markdown file under `.claude/agents/your-agent.md` that defines a specialised agent with its own system prompt and tool list. Best for *expert roles* you want to delegate to from the main session: a code-reviewer agent, a flaky-test investigator. Heavier to write but it runs in its own context, so it doesn't bloat the main conversation.

**4. Claude API tool** — a programmatic tool definition you expose from your application via the Anthropic SDK. Different beast entirely: this is for when your Spring Boot service *itself* calls Claude. Out of scope for "make Claude follow our conventions", in scope for "let our app reason about a customer ticket".

For "follow our project practices", levels 1 and 2 do 90% of the work. `CLAUDE.md` for the always-on rules, a skill for the workflows. The rest of this post builds the skill.

## What the skill needs to enforce

Working backwards from the practices we care about:

- **TDD with small steps.** Failing test first, one logical change per commit, stop and confirm before moving on. No solution dumps.
- **Layering.** Controller → facade → service → repository. Controllers stay thin (request mapping, validation kick-off, response shaping). Facades orchestrate. Services hold business logic. Repositories do persistence. No leaks.
- **Testing.** JUnit 5 + Mockito for unit tests, Testcontainers for integration tests that need real Postgres/Mongo. Mock at boundaries, not at internal seams. `given_*_when_*_then_*` naming.
- **Code style.** Lombok only for `@Getter`/`@Builder` on DTOs and entities — no `@Data` (it silently generates `equals`/`hashCode` that break JPA). `@Transactional` on the service method, never the controller. Bean Validation (`@Valid`, `@NotNull`) at the controller boundary; business invariants in the service.
- **Static analysis.** PMD and Checkstyle wired into Maven's `verify` phase so a build that passes locally also passes in CI. No suppressions without a one-line justification comment.

## The skill file

Drop this at `.claude/skills/spring-boot-practices.md`:

````markdown
---
name: spring-boot-practices
description: Apply this project's Spring Boot conventions — TDD, controller→facade→service→repository layering, JUnit/Mockito/Testcontainers testing, Lombok/transaction/validation rules, PMD and Checkstyle. Use whenever writing or reviewing Java code in this repo.
---

# Spring Boot project practices

You are working in a Spring Boot codebase. Follow these rules without exception.

## Workflow (non-negotiable)

1. **TDD.** Write a failing test before any implementation code. Run it. Confirm it fails for the right reason.
2. **Small steps.** One logical change per step. A step is "small" if you can describe it in one sentence and commit it as one commit.
3. **Stop after each step.** Summarise what changed, suggest a commit message, wait for the user's "go" before continuing.
4. **No solution dumps.** If asked for "the whole thing", remind the user of the small-steps rule and propose step 1.

## Layering

Respect: `controller → facade → service → repository`.

- **Controller**: HTTP concerns only. `@RestController`, request DTOs, `@Valid`, `ResponseEntity` shaping, exception → status mapping. No business logic, no autowired repositories.
- **Facade**: orchestrates multiple services for a use case. Stateless. Translates between request/response DTOs and domain objects.
- **Service**: business logic and invariants. Owns `@Transactional` boundaries. Talks to repositories. Returns domain types, never JPA entities to upper layers.
- **Repository**: Spring Data interface or query-only class. No business decisions.

Reject changes that smuggle persistence into facades, business logic into controllers, or HTTP concerns into services.

## Testing

- **Unit tests** under `src/test/java/...`, mirror production package. JUnit 5 + Mockito. Mock collaborators at the *layer boundary*, not at internal seams.
- **Integration tests** under `src/test/java/.../it/` with the `*IT.java` suffix. Use Testcontainers for real Postgres/Mongo/Kafka — never mock these.
- Naming: `methodUnderTest_givenX_whenY_thenZ`.
- A bug fix starts with a regression test that fails on the current code.

## Code style

- **Lombok**: `@Getter`, `@Builder`, `@RequiredArgsConstructor` only. Forbidden: `@Data`, `@EqualsAndHashCode` on JPA entities, `@Slf4j` (use `private static final Logger log = LoggerFactory.getLogger(...)` for explicitness).
- **Immutability**: request/response DTOs are records or final classes with builders. No setters on domain objects.
- **Validation**: `@Valid` at the controller boundary with `jakarta.validation` annotations on DTOs. Business invariants raise domain exceptions inside services.
- **Transactions**: `@Transactional` on service methods only. Specify `readOnly = true` for queries. Never on controllers or repositories.
- **Exceptions**: domain exceptions extend a project base class. A single `@ControllerAdvice` maps them to HTTP status. No `RuntimeException` thrown from controllers.

## Static analysis

- PMD and Checkstyle run in Maven's `verify` phase. A passing local build means `./mvnw verify` is green, not just `test`.
- Do not add `@SuppressWarnings` or `// CHECKSTYLE:OFF` without a one-line comment explaining why on the same line.
- If a rule fires repeatedly across the codebase, suggest amending the ruleset rather than suppressing on every site.

## When asked to "fix" something

1. Reproduce with a failing test.
2. Propose the smallest change that turns it green.
3. Confirm the rest of the suite, PMD, and Checkstyle still pass.
4. Stop and report.
````

## How it gets triggered

Two ways:

- **Explicit**: the user types `/spring-boot-practices` and Claude loads the skill into context for the rest of the turn.
- **Implicit**: when Claude sees a request whose intent matches the skill's `description` ("review this Java diff", "scaffold a service"), it loads the skill on its own. This is why the `description` line matters more than people think — write it like you're writing a search query for *future-you*.

## What goes in `CLAUDE.md` instead

Keep `CLAUDE.md` lean. The skill above carries the workflow and conventions; `CLAUDE.md` should carry the things Claude can't infer from reading the code: the build command (`./mvnw verify`), the Java version, where secrets live, which environment variables are required to run integration tests, who owns which module. Rule of thumb: if grep can answer it, leave it out.

## Next in this series

Two follow-ups planned:

- **Building a `java-springboot-reviewer` subagent** — a separate agent with read-only tools that audits a diff against the same practices. Useful as a second pair of eyes in larger PRs.
- **Exposing a Spring service as a Claude API tool** — when the Spring Boot app itself is the one calling Claude, what the tool definition looks like, and how to keep your prompts cached.

The skill above is the foundation. Get it living in your repo first, watch what Claude gets wrong over a week, and refine the rules until your reviews stop catching the same things twice.
