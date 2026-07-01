# Responsive — règle par défaut LP Studio

Convention **obligatoire** pour tout projet LP Studio (landing pages, blocs, preview éditeur).

## Principe mobile-first

Sur **mobile** (preview 390px, container &lt; 480px) :

- Les blocs et cartes sont **empilés verticalement**
- Chaque élément prend **100 % de la largeur** (`w-full`, `grid-cols-1`)
- **Pas** de grille 2+ colonnes côte à côte

Les colonnes multiples n’apparaissent qu’à partir de la **tablette** (container ≥ 768px).

## Breakpoints container

Définis dans `packages/tokens/src/responsive.css` :

| Token | Taille | Usage |
|-------|--------|-------|
| `@sm` | 30rem (480px) | Typo, espacements, boutons — **pas** pour grilles multi-colonnes |
| `@md` | 48rem (768px) | 2 colonnes (services, stats, footer) |
| `@lg` | 64rem (1024px) | 3–4 colonnes, layout hero split |

Le preview utilise des **container queries** (`@container` dans `BlockRenderer`), pas la largeur fenêtre seule.

## Utilitaires à utiliser (ne pas réinventer)

Importer depuis `@lp-studio/tokens` :

| Utilitaire | Rôle |
|------------|------|
| `serviceGridClass()` | Grille services 1 → 2 → 3 cols |
| `heroStatGridCenteredClass()` | Stats hero centrées |
| `heroStatGridSidebarClass()` | Stats hero latérales |
| `heroSplitLayoutClass()` | Hero texte + stats |
| `footerLayoutGridClass()` | Footer |
| `fullWidthOnMobileClass()` | Carte / article pleine largeur |

Nouveau bloc avec grille ? **Ajouter un utilitaire** dans `packages/tokens/src/index.ts`, puis l’utiliser dans le bloc.

## Interdit dans `packages/blocks/**`

```tsx
// ❌ Colonnes fixes sans mobile-first
<div className="grid grid-cols-2 ..." />

// ❌ Multi-colonnes dès @sm (384px par défaut Tailwind — trop tôt)
<div className="grid @sm:grid-cols-2 ..." />

// ✅ Utiliser les helpers tokens
<div className={serviceGridClass()} />
```

## Intégration éditeur

`apps/editor/app/globals.css` importe `responsive.css` :

```css
@import "../../../packages/tokens/src/responsive.css";
```

Tout nouveau projet LP Studio doit conserver cet import.

## Validation CI

`npm run validate` exécute `validate-blocks.ts` qui refuse :

- `grid-cols-2` … `grid-cols-12` sans `grid-cols-1` dans le même className
- `@sm:grid-cols-*` dans les fichiers `*Block.tsx`

## Preview éditeur

| Mode | Largeur | Colonnes services |
|------|---------|-------------------|
| Mobile | 390px | 1 |
| Tablette | 768px | 2 |
| Desktop | 100% | 3 |
