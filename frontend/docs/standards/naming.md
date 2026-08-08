# Naming

Casing rules (`PascalCase` components/types, `camelCase` functions/variables, `kebab-case` files) are in [react.md](./react.md). This doc covers what to call things.

- Names are clear and descriptive; no abbreviations unless universally understood (`id`, `url`).
- Extract conditional logic into a named boolean instead of inlining the expression:
  `const isAdult = age >= 18; if (isAdult) { ... }` — not `if (age >= 18) { ... }`.

## Function prefixes

| Prefix                                  | Meaning                                                    | Example                                                        |
| --------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| `is` / `has` / `can` / `should`         | Returns a boolean.                                         | `isEmpty()`, `hasPermission()`, `canEdit()`, `shouldRefetch()` |
| `get` / `set`                           | Reads / writes a value.                                    | `getUser()`, `setLocale()`                                     |
| `fetch` / `load`                        | Retrieves data from an external source / initializes data. | `fetchOrders()`, `loadSettings()`                              |
| `create` / `update` / `delete` / `save` | Mutates data.                                              | `createReport()`, `deleteFile()`                               |
| `calculate`                             | Computes and returns a value.                              | `calculateTotal()`                                             |
| `reset`                                 | Restores a default state.                                  | `resetForm()`                                                  |
| `handle`                                | Event handler (see [react.md](./react.md)).                | `handleSubmit()`                                               |

Pick the prefix that matches what the function does — a `get` that fires a network request should be a `fetch`; a `handle` that contains business logic should delegate to a named function.
