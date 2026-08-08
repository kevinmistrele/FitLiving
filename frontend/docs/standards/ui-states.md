# UI States: Loading, Error, Empty

What the user sees while data is pending, failed, or absent. The error _flow_ (which layer catches what) is [errors.md](./errors.md); the state decision itself belongs to the screen ([react.md](./react.md)).

Every screen that fetches data must decide all four states explicitly: loading, error, empty, success. A screen that only renders the success path is incomplete.

## Loading

Match the indicator to the scope of what's loading:

- **App-level** (boot, context switch): full-screen state owned by the app shell — centered indicator, optionally a short supporting line. Never a blank screen.
- **Lists and tables**: skeletons that mimic the real item layout (3–5 rows, animated), not a spinner in an empty container — skeletons avoid the layout jump when data arrives.
- **A section of a screen** (one card, one chart): indicator centered inside that section's container; the rest of the screen stays interactive.
- **Buttons**: never change the button's size — replace/dim the label with a small centered spinner, and disable it (and sibling action buttons) to prevent double submits.
- **Background work** (autosave): don't block the UI at all; a subtle inline indicator is enough.

Rules that apply everywhere:

- No infinite loading: a timeout or failure must resolve into an error state with a retry action.
- No layout shift: an indicator never pushes surrounding elements around.
- Never stack two full-screen loaders.

## Error

- **Form fields**: message inline, directly below the field that caused it. Color + icon + text — never color alone (see [accessibility.md](./accessibility.md)). Never clear what the user typed.
- **A list/section that failed**: replace it with an inline fallback ("Couldn't load X" + retry button), not a blank area.
- **Business-rule failures** (conflict, duplicate, not allowed): explain _why_ it failed and offer the next action, in a dialog or persistent banner — not a toast that disappears while the user is deciding.
- **Non-blocking action failures** ("couldn't favorite"): a short-lived toast is fine.
- **Global failures** (session expired, offline, maintenance): full-screen state or blocking dialog with a clear title and one primary action. Never a toast — the user may miss it and lose unsaved work.
- Never the browser-native `alert()`/`confirm()`, never a raw technical message (`Error 500`, stack traces) — map to a user-facing message ([errors.md](./errors.md)).
- Wording guides, not blames: "These details don't match our records", not "You entered invalid data". Generic "Something went wrong" without a next step is a last resort, not a default.

## Empty

- "No data" is not an error and not a loading state — show a dedicated empty state saying what would appear here and, when possible, the action that creates the first item.
- A search/filter with no results says so and offers to clear the filter.
