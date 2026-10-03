# CLAUDE.md — Thème Frag Emirates

## Projet

Thème Shopify sur mesure (base **Skeleton**) pour **Frag Emirates**, boutique de parfums.

La référence est le dossier `_design/` :
- `HANDOFF.md`
- `design-tokens.json`
- les maquettes `.dc.html`

Ce sont des **spécifications à reproduire**, pas du code à copier.

## Contenu

- Ne jamais inventer de texte, de prix ou d'information.
- Garder les placeholders entre crochets tels quels (ex. `[...]`).
- Ne jamais afficher le nom d'un parfum de niche dont un produit s'inspire.

## Code

- Respecter les conventions Skeleton : sections, theme blocks, snippets.
- Couleurs, polices et espacements viennent **uniquement** des tokens (`design-tokens.json`), sous forme de variables CSS.
- Pas de framework ni de librairie externe.
- Deux cibles : mobile (390 px) et desktop (1440 px).
- Accessibilité conforme au `HANDOFF.md`.

## Qualité

- Valider tout code Liquid avec le MCP Shopify.
- Lancer `shopify theme check` avant chaque commit.
- Faire un petit commit Git par étape terminée.

## Sécurité

- Travailler uniquement avec `shopify theme dev` sur un thème de développement.
- Ne jamais faire `push` ni `publish`.
- Ne jamais toucher aux autres thèmes de la boutique.
- Ne rien modifier dans l'admin (produits, réglages) sans accord explicite.

## Communication

- Répondre en français.
- Avancer une étape à la fois.
- Après chaque étape, expliquer en 2-3 phrases ce qui a été fait et pourquoi, puis attendre la validation avant de continuer.
