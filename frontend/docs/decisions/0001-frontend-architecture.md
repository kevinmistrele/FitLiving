# 0001 - Feature-Based Front-End Architecture

## Context

The project needs a structure that scales for multiple features, teams and AI-agent contributions.

## Decision

Use a feature-based React architecture inspired by Bulletproof React:

- `src/app` composes the application.
- `src/features/*` contains feature-owned code.
- shared folders provide business-agnostic primitives and services.
- dependency flow stays unidirectional.
- cross-feature imports are avoided.

## Consequences

- New features are easier to add without touching unrelated code.
- Agents can inspect a smaller area before editing.
- Shared code must stay generic and cannot depend on feature internals.
- Some composition happens one level higher in `src/app` instead of directly between features.

## Where the detail lives

This record captures the decision and its rationale. The operational rules live in `docs/architecture/` (structure, dependency rules, API layer, state management) and `docs/standards/` (TypeScript, React, components, hooks, forms, styling, accessibility, errors, security, performance, tests, documentation) — see [AGENTS.md](../../AGENTS.md) for the entry point.
