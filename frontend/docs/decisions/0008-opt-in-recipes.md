# 0008 - Opt-in recipes and project kickoff

## Context

Common additions people want when starting from this base (Tailwind, Zustand) shouldn't be pre-installed — every clone would carry weight it may never use, and unexercised variants rot. But without guidance, each adoption gets improvised differently per project.

## Decision

- `docs/recipes/` holds one step-by-step adoption guide per optional library, written to be executable by an agent: exact install commands, files to change, which docs to update, and the requirement to record a new ADR on adoption.
- `AGENTS.md` gained a "Project Kickoff" section: on a fresh clone (the `welcome` example is still the only feature), the agent asks the user which recipes to apply before building the first feature. On an established project, recipes are applied only on explicit request — never as a side effect.
- Initial recipes: Tailwind, Zustand and shadcn/ui. The shadcn recipe is guidance-first: components come from the official registry (CLI, or the shadcn MCP server the agent guides the user to connect) — never hand-written from memory. TanStack Router was deliberately left out — it would _replace_ react-router (decision [0002](./0002-routing.md)), a heavier, riskier swap than an addition.

## Consequences

- The base stays dependency-free by default; each opted-in addition costs its own ADR, keeping the decision log honest.
- Recipes are docs, so they can go stale — the same-PR doc-update rule (`AGENTS.md`, review checklist) is the defense.
