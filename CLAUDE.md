# LP Studio — règles Claude Code / Cursor

## Cas MVP

Page unique : **Upscaly Consulting** (`supabase/seed/upscaly-consulting.json`).  
Structure inspirée de growthconsult.net, charte dans `docs/brand/identity.md`.

## Workflow création landing

Ordre obligatoire : **brief → inspiration (OPL + Lapa + Landingfolio) → version initiale landing → ajustements utilisateur dans l'éditeur**.

Documentation workspace : [`../docs/LANDING-WORKFLOW.md`](../docs/LANDING-WORKFLOW.md)

## Modifiable par défaut (landing)

| Zone | Chemin |
|------|--------|
| Contenu page | `apps/editor/data/local-page.json` |
| Seeds | `supabase/seed/*.json` |
| Rendu blocs | `packages/blocks/**` |
| Design system | `packages/tokens/**` |
| Schema | `packages/registry/**`, `packages/types/**` — uniquement si extension demandée |

## Interdit par défaut (éditeur & toolkit)

**Sauf demande explicite de l'utilisateur**, ne jamais modifier :

- `apps/editor/components/**` — shell, panneaux latéraux, preview
- `BlockContextEditor.tsx` — **toolkit rapide**
- `EditorShell.tsx`, `StylePanel.tsx`, `PreviewToolbar.tsx`, pickers, etc.
- `apps/editor/app/api/**`, `apps/editor/lib/**` (infra éditeur)
- `apps/editor/app/edit/**` (pages éditeur)

### Exceptions autorisées

- `apps/editor/app/globals.css` — import `responsive.css`
- `apps/editor/public/brand/**` — assets landing

## Autres interdictions

- Texte ou style en dur dans les blocs (`content` props uniquement)
- Copier les textes de growthconsult.net
- Écraser `content` / `style` en base sans accord — étendre le schema si besoin

## Pattern obligatoire

```tsx
<h1 className={headingClass(style)}>{content.title}</h1>
```

## Responsive (défaut projet)

Voir **`docs/responsive.md`**. Convention workspace : [`../docs/RESPONSIVE.md`](../docs/RESPONSIVE.md).

## Inspiration design

**[One Page Love](https://onepagelove.com/)**, **[Lapa Ninja](https://www.lapa.ninja/)**, **[Landingfolio](https://www.landingfolio.com/)** — après le brief, avant la version initiale. Voir [`../docs/DESIGN-INSPIRATION.md`](../docs/DESIGN-INSPIRATION.md). Adapter à `docs/brand/identity.md`, ne pas copier de contenus tiers.

## Règles Cursor workspace

- `../../.cursor/rules/landing-creation-workflow.mdc`
- `../../.cursor/rules/landing-scope.mdc`
- `../../.cursor/rules/design-inspiration.mdc`
- `../../.cursor/rules/responsive-mobile-first.mdc`
