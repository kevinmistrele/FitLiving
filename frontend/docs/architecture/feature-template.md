# Feature Template

Use this structure when adding a feature:

```txt
src/features/example/
  api/
    get-example.ts
  components/
    example-panel.tsx
  hooks/
    use-example-screen.hooks.ts
  types/
    example.types.ts
  utils/
    example-utils.ts
  stores/
    example-store.ts
  i18n/
    en.json
    pt.json
    index.ts
```

Only create folders that are needed. Most features never need `stores/` — see [state-management.md](./state-management.md) for when a feature-local store is actually justified. Add `i18n/` as soon as the feature has any user-facing copy, and register it in `src/i18n/feature-registry.ts` — see [i18n.md](./i18n.md). Translations are never added to one shared app-wide file.

**Also add a zone for the new feature to `eslint.config.js`'s `import/no-restricted-paths`** (see [dependency-rules.md](./dependency-rules.md)) — the cross-feature-import ban is lint-enforced per feature, so a feature without a zone isn't protected yet.

## API

Feature API files should contain typed request functions and feature hooks when they are specific to the feature.

Pattern:

```ts
interface GetEntityParams {
  entityId: string;
}

interface Entity {
  id: string;
  name: string;
}

function getEntity(params: GetEntityParams): Promise<Entity> {
  return apiClient.get<Entity>(`/entities/${params.entityId}`);
}
```

## Screen Hook

Use a screen hook when a screen has non-trivial state or orchestration.

The hook may:

- call feature hooks;
- derive display state;
- expose callbacks;
- keep UI state local.

The hook should not render UI.

## Components

Feature components receive typed props and should not call API clients directly.

The feature's top-level screen component is named `<feature>-screen.tsx` (exporting `<Feature>Screen`), pairing with its `use-<feature>-screen.hooks.ts` hook — e.g. `welcome-screen.tsx` / `useWelcomeScreen`. Everything else in `components/` is a fragment the screen composes.

Use `function` declarations:

```tsx
interface EntityPanelProps {
  title: string;
}

function EntityPanel(props: EntityPanelProps) {
  return <section>{props.title}</section>;
}
```

## Where the rest of the rules live

- API conventions: [api-layer.md](./api-layer.md)
- Server/local state: [state-management.md](./state-management.md)
- Translations: [i18n.md](./i18n.md)
- Feature flags: [feature-flags.md](./feature-flags.md)
- Component/hook/TypeScript standards: `docs/standards/`
- Test expectations for a new feature: `docs/standards/tests.md`
