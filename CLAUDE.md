# LP Studio — règles Claude Code / Cursor

## Cas MVP

Page unique : **Upscaly Consulting** (`supabase/seed/upscaly-consulting.json`).  
Structure inspirée de growthconsult.net, charte dans `docs/brand/identity.md`.

## Modifiable

- `packages/blocks/**`
- `packages/registry/**`
- `packages/types/**`
- `packages/tokens/**` (rare)

## Interdit

- `apps/editor/**`
- API routes
- Texte ou style en dur dans les blocs
- Copier les textes de growthconsult.net

## Pattern obligatoire

```tsx
<h1 className={headingClass(style)}>{content.title}</h1>
```

## Valeurs existantes

Ne jamais écraser `content` / `style` des instances en base lors d'une refonte — étendre le schema uniquement.
