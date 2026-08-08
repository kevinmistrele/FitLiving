# TypeScript

- Strict mode is on (`tsconfig.app.json`). Do not weaken it to make a change compile.
- Never use `any`. `@typescript-eslint/no-explicit-any` is an ESLint error, not a suggestion.
- Use `unknown` only when the type is genuinely unknown at that point, and narrow it before use. Avoid `as unknown as X` casts — they are a sign the types upstream are wrong.
- `interface` for object shapes, props, and anything a consumer might extend.
- `type` for unions, aliases, tuples, and utility-type compositions (`Pick`, `Omit`, mapped types). This includes a type inferred from a runtime schema (`type Input = z.infer<typeof schema>`, see [forms.md](./forms.md)) — it's derived from an expression, not authored as a shape, so it stays a `type` even though it describes an object.
- Type every prop, function return value, and API response — inference is fine for locals, not for public boundaries.
- Optional (`?`) means the value can genuinely be absent, not "I don't want to type this yet."
- Keep a type in `src/types` only when more than one feature needs it. Feature-specific types live in `src/features/<feature>/types`.
- Do not add a dependency (e.g. `ts-reset`, `zod` beyond its current use) to work around a typing problem — fix the type.
