# LP Studio — MVP

Éditeur de landing pages à tokens fermés. **MVP** : une page **Upscaly Consulting**, structure inspirée de [growthconsult.net](https://growthconsult.net).

## Démarrage rapide

```bash
cd lp-studio
npm install
npm run dev
```

Ouvrir http://localhost:3000 — redirige vers l'éditeur de la page Upscaly.

## Sans Supabase (défaut MVP)

Les modifications sont persistées dans `apps/editor/data/local-page.json`.

## Avec Supabase

1. Créer un projet Supabase
2. Exécuter `supabase/migrations/001_pages.sql`
3. Insérer le seed `supabase/seed/upscaly-consulting.json`
4. Copier `.env.example` → `apps/editor/.env.local` et renseigner les clés

## Validation

```bash
npm run validate
```

## Structure

- `packages/blocks` — Hero, Services, CTA, Footer
- `packages/registry` — schéma éditable
- `packages/tokens` — charte Upscaly (`#1A3066`, `#E3F2FD`, `#E63946`)
- `apps/editor` — panel + preview live
