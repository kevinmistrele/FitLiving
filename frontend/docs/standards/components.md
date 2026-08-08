# Components

## Shared vs. feature components

- `src/components/*` (e.g. `components/ui/button.tsx`) must be business-agnostic: no feature imports, no knowledge of any domain concept, only generic props.
- `src/features/<feature>/components/*` may know about that feature's domain, but still receive data/callbacks through props rather than fetching their own data.

## Before creating a new component

Check `src/components/ui` for an existing one that already does this. Reuse or extend it (adding a prop) before writing a new component that duplicates it.

This project uses shadcn/ui (see [0010-shadcn.md](../decisions/0010-shadcn.md)): shared UI comes from the shadcn registry first — check the registry (CLI `npx shadcn@latest add <name>`, or the MCP server once connected) before writing a new `src/components/ui` component from scratch. Registry components land in `src/components/ui/` as owned code; editing them afterwards to fit this project is expected.

## Shape

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button(props: PropsWithChildren<ButtonProps>) {
  const { children, disabled, isLoading = false, type = 'button', ...buttonProps } = props;

  return (
    <button disabled={disabled || isLoading} type={type} {...buttonProps}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
```

- Extend the native HTML element's attribute type (`ButtonHTMLAttributes<HTMLButtonElement>`) instead of re-declaring `onClick`, `className`, etc.
- Default values via destructuring defaults, not `defaultProps`.
- Keep JSX free of heavy logic — compute derived values above the `return`, or in a hook.
- Don't extract a nested render function inside a component (`function renderItems() { return <ul>...</ul> }` called from the JSX) — it grows unmanageably and can't be memoized or tested on its own. Extract a sibling component instead:

```tsx
// avoid: nested render function
function Component() {
  function renderItems() {
    return <ul>...</ul>;
  }
  return <div>{renderItems()}</div>;
}

// prefer: extracted component
function Items() {
  return <ul>...</ul>;
}

function Component() {
  return (
    <div>
      <Items />
    </div>
  );
}
```

## Naming

- Component files: `kebab-case.tsx` (`entity-panel.tsx`), component export: `PascalCase` (`EntityPanel`).
- Boolean props: `is`, `has`, `can`, `should` prefixes (`isLoading`, `hasError`).
- Event callback props: `onX` (`onSubmit`, `onSelect`); the internal handler implementing it: `handleX`.
