# Accessibility

Basic accessibility is mandatory for any interactive UI, not optional polish. Part of this is lint-enforced via `eslint-plugin-jsx-a11y` (`npm run lint` fails on e.g. a missing `alt`) — but the rules below cover cases the linter cannot check (keyboard operability, focus management, color-only signals), so lint passing is not the same as accessible.

- Prefer semantic HTML (`button`, `nav`, `label`, `section`) over generic `div`/`span` with handlers attached.
- Every input has a `label`, `aria-label`, or `aria-labelledby`.
- Icon-only buttons need an accessible name (`aria-label`, visually-hidden text) — an icon alone is not a name.
- Clickable custom elements must use correct semantics/roles and be reachable and operable by keyboard (`Tab`, `Enter`/`Space`), not only `onClick`.
- Never remove or hide the visible focus indicator (`:focus-visible` in `src/styles.css`).
- Do not use color as the only signal for state (error, success, required) — pair it with text, an icon, or a label.
- Respect heading order and landmark structure when composing screens in `src/app`.

This is the floor, not a target to trade off against a deadline — it's cheaper to build in than to retrofit.
