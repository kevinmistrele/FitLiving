# 0010 - shadcn/ui

## Context

The auth feature's login screen needed to be built from a real, maintained component registry rather than hand-rolled markup, per `docs/recipes/shadcn.md`. The user chose shadcn/ui at kickoff, blocks-first (`https://ui.shadcn.com/blocks`).

## Decision

Adopt shadcn/ui via `docs/recipes/shadcn.md`:

- `npx shadcn@latest init` — created `components.json` (style `base-nova`, base color `neutral`) and `src/lib/utils.ts` (`cn`).
- The current CLI's default style (`base-nova`) generates components on top of **Base UI** (`@base-ui/react`) instead of Radix — Base UI is the accessible headless-primitives successor project from the same maintainers. The recipe's "never strip the headless primitives out" rule still applies; it just applies to Base UI's primitives now, not Radix's.
- `npx shadcn@latest add login-01` pulled the login block (`src/components/login-form.tsx`) plus its supporting primitives (`button`, `card`, `field`, `input`, `label`, `separator` in `src/components/ui/`).
- The generated `login-form.tsx` shipped a "Login with Google" button and a "Sign up" link. Both were removed — this is a single-owner app with no public sign-up and no OAuth provider configured (`docs/project/fitliving-web.md`, section 2) — leaving email + password + submit. The block was also converted from static markup to a controlled component (props for value/onChange/error/pending state) so `src/features/auth/components/login-screen.tsx` can wire it to real form state without the shared component knowing about Firebase or the auth domain.
- The MCP server (`docs/recipes/shadcn.md` step 2) was **not** connected in this change — it requires an interactive step only the user/machine owner can run (`npx shadcn@latest mcp init --client claude`). The CLI path (`npx shadcn@latest add <name>`) was used instead, which the recipe treats as an equally valid, just less ergonomic, path. Connecting the MCP server later is a nice-to-have, not a blocker.

## Local fix required

The CLI's alias resolution failed on this repo's split-tsconfig layout (`tsconfig.json` referencing `tsconfig.app.json`/`tsconfig.node.json` without its own `compilerOptions`): it silently wrote generated files under a literal `./@/...` folder instead of resolving `@/*` to `src/*`. Fix: `tsconfig.json` now also carries `compilerOptions.baseUrl`/`paths` mirroring `tsconfig.app.json`, matching shadcn's own Vite installation guide — this is inert for `tsc -b` (the root config still has `"files": []`) but lets the CLI (and editor tooling) resolve the alias correctly.

## Consequences

- `src/components/ui/*` are shadcn-registry components and owned code — edited directly when a project need doesn't match the registry default, per [components.md](../standards/components.md).
- Theme tokens (`src/styles.css`) are now shadcn's default token set (`--card`, `--destructive`, `--secondary`, `--ring`, etc.), with only `--primary`/`--primary-foreground`/`--ring` overridden to the FitLiving brand green — one token source, no parallel/duplicate token block.
- New components should be added via the registry (CLI or, once connected, MCP) — never hand-written from memory.
