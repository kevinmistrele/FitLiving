# Recipe: Design-tool MCP → component

Read this whenever the task involves generating a component from a design tool's MCP output — Figma's MCP server is the common case, but the same problem and process apply to any design-to-code MCP (Sketch, Adobe XD, Penpot, etc.). Outside that scenario, the standards docs already cover everything.

## The problem

A design tool's MCP gets style and layout right, but hands back everything as one monolithic component: a single giant function with all states inlined, hardcoded text, raw hex colors, and inline/exported SVG icons. Left as-is, that output breaks several standing rules:

- [components.md](../standards/components.md): components should be small and reused from `src/components/ui` before writing a new one — the MCP doesn't know your component library exists, so it always draws primitives from scratch.
- [components.md](../standards/components.md) "Naming": one file per component with a clear visual responsibility, not one file per screen.
- [i18n.md](../architecture/i18n.md): user-facing copy belongs in the owning feature's `en.json`/`pt.json`, not inlined as literal strings.
- [styling.md](../standards/styling.md): colors and spacing should come from design tokens/theme, not raw hex values.
- [ponytail/overview.md](../ponytail/overview.md): check for an existing component before recreating a primitive.

Treat the MCP's output as a visual reference — never as the final diff.

## Process

Apply this after the MCP has generated the raw component, before considering it done:

1. **Never accept the MCP output as final.** It's a draft, not a ready-to-review component.
2. **Map design frames/layers to components.** Each visually independent section (e.g. a "header" block, a "calendar" block, an "actions" footer) becomes its own file, named in kebab-case derived from the section/layer name in the design file.
3. **Extract shared types** used across the resulting sub-components into a `<name>.types.ts` next to them.
4. **Replace every hardcoded hex color or magic spacing value** with the project's design tokens (Tailwind theme values if the [Tailwind recipe](./tailwind.md) is adopted, or the relevant CSS custom properties otherwise) or an existing component's variant prop. Don't leave a raw `#1a2b3c` in place if an equivalent token or variant already exists.
5. **Replace native tags and raw/inline SVG icons** with the matching component from `src/components/ui` (or the shadcn registry, if that [recipe](./shadcn.md) is adopted) — see [components.md](../standards/components.md).
6. **Extract every literal string into the owning feature's i18n files** (`src/features/<feature>/i18n/{en,pt}.json`) — see [i18n.md](../architecture/i18n.md). Never leave text hardcoded straight from the design tool.
7. **The top-level component only orchestrates**: it receives state/handlers via props (or from the screen's hook), resolves `t()` once, and passes a prepared `labels` object down to its dumb child sections. No business logic lives there.
8. **Each child section takes only props** — no own data fetching, no independent `useTranslate()` call cascading through every leaf when a single resolved `labels` object from the parent would do.

## Reference shape

Use this file layout as the mental template when decomposing a new screen coming out of a design MCP:

```txt
<feature>-modal.tsx              # orchestrates: resolves t() once, builds `labels`, distributes to sections
<feature>-<section-a>-section.tsx
<feature>-<section-b>-section.tsx
<feature>-modal-footer.tsx
<feature>-<repeated-primitive>.tsx   # extracted once a primitive repeats 3+ times
<feature>.types.ts               # types shared across the files above
```

Same granularity for a full page instead of a modal: `<screen>.page.tsx` orchestrates, one file per visual section underneath it.

## Checklist before considering it done

- [ ] No file mixes more than one clear visual responsibility.
- [ ] No loose hex color or spacing value without first checking for an equivalent token/variant.
- [ ] No native tag (`<button>`, `<input>`, raw `<svg>`) where an equivalent exists in `src/components/ui` (or the shadcn registry).
- [ ] No hardcoded text — everything routed through the feature's `en.json`/`pt.json`.
- [ ] The top-level component holds no business logic, only orchestration.
- [ ] Shared types centralized in `.types.ts`.
- [ ] Normal validation and [review checklist](../agents/review-checklist.md) run afterwards, same as any other change.

## When not to decompose

The [ponytail ladder](../ponytail/overview.md) still applies: a section that's a few lines of simple JSX, with no repetition and no realistic reuse, can stay inline in the parent — don't force a file per `<div>`. The bar is "does this have its own visual responsibility" (something that would have a name as a section/layer in the design file), not "every element becomes a file."
