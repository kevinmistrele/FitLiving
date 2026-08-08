# Recipe: shadcn/ui

Opt-in only. Apply this when the user explicitly chooses shadcn/ui (typically at project kickoff — see `AGENTS.md`). Never as a side effect of another task.

**Prerequisite: the [Tailwind recipe](./tailwind.md) must be applied first** — shadcn/ui components are styled with Tailwind. If the user asks for shadcn without Tailwind, explain the dependency and apply that recipe first (with their ok).

This recipe is different from the others: shadcn components are **not** written by hand and **not** invented by the agent. They come from the official registry — via the shadcn CLI, and ideally via the **shadcn MCP server**, which the agent guides the user to connect. Hand-writing a "shadcn-style" component from memory defeats the point (it drifts from the registry and misses fixes).

## Step 1 — Initialize

```bash
npx shadcn@latest init
```

This creates `components.json`, the `cn` util (goes in `src/lib/utils.ts` — correct layer) and CSS variables in the stylesheet. The repo's `@/*` alias and kebab-case file naming already match what shadcn generates.

## Step 2 — Guide the user to connect the MCP server (agent: do not skip this)

The MCP server lets any agent browse the registry, look up component APIs/demos, and add components without guessing. Connecting it is a **user/machine-level action** — the agent explains it and the user runs it:

- Claude Code: `npx shadcn@latest mcp init --client claude` (or ask the user to approve creating `.mcp.json` with the `shadcn` server entry).
- Cursor / VS Code / other clients: `npx shadcn@latest mcp init` and pick the client.
- Source of truth if the commands change: <https://ui.shadcn.com/docs/mcp>.

After connecting, the user restarts the agent session so the MCP tools load. If the user declines the MCP, that's fine — the CLI path below covers everything, just less ergonomically.

## Step 3 — Adding components (the standing rule)

- Via MCP when connected, or `npx shadcn@latest add <component>` — never pasted from memory.
- Components land in `src/components/ui/` and are **owned code**: editing them afterwards is normal and expected; all rules in [components.md](../standards/components.md) apply (business-agnostic, generic props).
- **Conflict on first add:** this base ships a hand-written `src/components/ui/button.tsx` (with an `isLoading` prop). Adding shadcn's `button` overwrites it — ask the user, and if they adopt shadcn's version, re-add `isLoading` on top and check existing call sites still compile.
- Accessibility is why shadcn wraps Radix — never strip the Radix primitives out of a generated component to "simplify" it (see [accessibility.md](../standards/accessibility.md)).

## Step 4 — Record and update docs

- New ADR in `docs/decisions/` (next sequential number) stating shadcn/ui was adopted at the user's request.
- Add one line to [components.md](../standards/components.md): shared UI comes from the shadcn registry first — check the registry before writing a new `src/components/ui` component from scratch.

## Step 5 — Validate

`npm run lint` (generated files pass this repo's naming and boundary rules), `npm run typecheck`, `npm run test`, and a visual check via `npm run dev` or `npm run test:e2e`.
