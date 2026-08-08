# Styling

This project has adopted Tailwind CSS v4 (see [0009-tailwind.md](../decisions/0009-tailwind.md)). Component styles are Tailwind utility classes; `src/styles.css` holds the `@theme` token block plus resets and what Tailwind can't express (see [0009-tailwind.md](../decisions/0009-tailwind.md)).

## Conventions

- Design tokens (colors, spacing, fonts) live in the Tailwind theme (`@theme` / `tailwind.config`), migrated from `src/styles.css` — one source of truth. `styles.css` keeps only resets and what Tailwind can't express.
- Stick to the theme scale. An arbitrary value (`w-[13px]`, `text-[#3b82f6]`) is a smell — use the nearest scale/token value, or add a token if the value is genuinely part of the design.
- Never build class names dynamically (`text-${color}-500`) — Tailwind only generates classes it can see as complete strings at build time. Use full class names in a conditional or a small lookup map.
- Repeated class strings are deduplicated by extracting a component (see [components.md](./components.md)), not by `@apply`. Reserve `@apply` for the rare truly global pattern.
- Use variant prefixes (`disabled:`, `focus-visible:`, `aria-*:`, `hover:`) instead of JS state for what the platform already tracks — same principle as the native-styling rule above.
- Mobile-first responsive: base classes for small screens, `md:`/`lg:` prefixes to scale up.
- Add `prettier-plugin-tailwindcss` with the adoption so class order is automated, never hand-sorted or argued about in review.
- All-Tailwind or plain CSS per concern, not both: once adopted, component styles are Tailwind classes — don't leave a component half-migrated with a parallel stylesheet.
- The accessibility rules above still hold: `:focus-visible` styling must survive the migration (as a `focus-visible:` ring/outline), and Tailwind's `outline-none` must never leave an element without a visible focus indicator.
