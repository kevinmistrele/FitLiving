# Recipe: Tailwind CSS

Opt-in only. Apply this when the user explicitly chooses Tailwind (typically at project kickoff — see `AGENTS.md`). Never as a side effect of another task.

The conventions for _writing_ Tailwind in this repo already exist in [styling.md](../standards/styling.md) ("If the project adopts Tailwind") — this recipe is only the mechanical adoption steps.

## Steps

1. Install (Tailwind v4, Vite plugin — no `tailwind.config` file needed):

   ```bash
   npm install tailwindcss @tailwindcss/vite
   npm install -D prettier-plugin-tailwindcss
   ```

2. Register the Vite plugin in `vite.config.ts`:

   ```ts
   import tailwindcss from '@tailwindcss/vite';
   // ...
   plugins: [react(), tailwindcss()],
   ```

3. Wire the stylesheet — at the top of `src/styles.css`:

   ```css
   @import 'tailwindcss';
   ```

   Migrate the `:root` tokens (colors, font) into an `@theme` block so the theme is the single source of truth. Keep in plain CSS only resets and what Tailwind can't express. **The `:focus-visible` outline rule must survive** — see [accessibility.md](../standards/accessibility.md).

4. Enable class sorting in `.prettierrc.cjs`:

   ```js
   plugins: ['prettier-plugin-tailwindcss'],
   ```

5. Record the decision: new ADR in `docs/decisions/` (next sequential number) stating Tailwind was adopted at the user's request.

6. Update [styling.md](../standards/styling.md): its first paragraph says the base has no utility-CSS framework — change it to state Tailwind is adopted and component styles are Tailwind classes (the doc itself asks for this one-line update).

7. Validate: `npm run dev` (visual smoke), `npm run build`, `npm run format`.

## After adoption

All rules in styling.md's Tailwind section apply: theme scale over arbitrary values, no dynamically built class names, extract components instead of `@apply`, variant prefixes over JS state, mobile-first.
