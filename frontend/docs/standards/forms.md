# Forms

This base has no form library — forms are built with controlled inputs and `zod` (already a dependency) for validation. Do not add `react-hook-form`, `formik`, or similar unless the task explicitly calls for it.

## Pattern

- Keep form field state in the screen hook (`use-<screen>-screen.hooks.ts`) or a dedicated `use-<form-name>-form.hooks.ts` if it grows large.
- Define a `zod` schema for the submitted payload next to the feature's types or api file, and parse/validate on submit:

```ts
const createEntitySchema = z.object({
  name: z.string().min(1),
});

type CreateEntityInput = z.infer<typeof createEntitySchema>;
```

- Validate at the boundary (on submit, before calling the API action), not on every keystroke unless the UX requires it.
- Surface validation errors as typed state the screen renders — not as thrown exceptions caught ad hoc in JSX.
- The submit handler calls a feature `api/` action (typed input/output, see [api-layer.md](../architecture/api-layer.md)); it does not perform the fetch inline.

## UI

- Every input has a `label` (or `aria-label` if a visible label truly cannot be used) — see [accessibility.md](./accessibility.md).
- Disable the submit control while a mutation is in flight; don't allow duplicate submits.
- Show field-level errors next to the field, and a form-level error for submit failures unrelated to a single field.

## When to reach for a form library

If a form grows complex enough (many interdependent fields, array fields, cross-field validation, perf issues from re-rendering the whole form on each keystroke), that's a signal to introduce `react-hook-form` — but treat it as a deliberate dependency decision (mention it in the PR), not a default.
