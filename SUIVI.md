# Suivi du projet — Thème Frag Emirates

Fichier de reprise : où en est le projet, ce qui a été décidé, ce qu'il reste à faire.
À lire au début d'une nouvelle conversation (avec `CLAUDE.md` et `_design/HANDOFF.md`).

Dernière mise à jour : 4 octobre 2026 — dernier commit de code `c2c5e50` (Recherche et pages secondaires).
**Toutes les pages du thème sont intégrées.** Prochaine priorité : le contrôle mobile.

---

## 1. Démarrer une session

```powershell
# Aperçu local (laisser tourner en arrière-plan)
shopify theme dev --store frag-emirates.myshopify.com --store-password <mot de passe boutique>
```

- Aperçu : http://127.0.0.1:9292 (thème de développement caché, ID `194364473714`).
- Lien de partage : https://frag-emirates.myshopify.com/?preview_theme_id=194364473714
- Si la page « Cette boutique est privée » s'affiche dans le navigateur : saisir le mot de passe de la boutique.
- Accès API Admin (déjà authentifié) : `shopify store execute -s frag-emirates.myshopify.com ...`
  Autorisations : products, files, publications, online_store_navigation, online_store_pages.
  Si elles expirent : `shopify store auth --store frag-emirates.myshopify.com --scopes read_products,write_products,read_files,write_files,read_publications,write_publications,read_online_store_navigation,write_online_store_navigation,read_online_store_pages,write_online_store_pages`

Avant chaque commit : `shopify theme check` (doit afficher « no offenses ») + validation MCP Shopify.

---

## 2. Pages terminées

| Page | Fichiers principaux | Commit |
|---|---|---|
| Fondations (tokens, polices, styles de base) | `snippets/css-variables.liquid`, `assets/critical.css`, `assets/*.woff2` | `5d6d938` |
| En-tête, bandeau, menu mobile, pied de page | `sections/header.liquid`, `announcement-bar.liquid`, `footer.liquid`, `snippets/search-form.liquid`, `snippets/icon.liquid` | `b3cfd16` |
| Accueil | `sections/hero.liquid`, `collection-links.liquid`, `featured-collection.liquid`, `snippets/product-card.liquid`, `templates/index.json` | `e199bca` |
| Nos parfums (grille, filtres, tri, « Voir plus ») | `sections/main-collection.liquid`, `templates/collection.json` | `7c81ffc` |
| Fiche parfum + « Vous aimerez aussi » | `sections/main-product.liquid`, `product-recommendations.liquid`, `templates/product.json` | `b8d0e3f` |
| Nous contacter | `sections/main-contact.liquid`, `templates/page.contact.json` | `9266a9b`, `7d7f51a` |
| Panier (pas de maquette : construit avec le design system) | `sections/main-cart.liquid`, `templates/cart.json` | `045da79` |
| Recherche (pas de maquette) | `sections/search.liquid`, `snippets/pagination.liquid` | `c2c5e50` |
| 404, pages de contenu, mot de passe, blog, article, liste des collections (pas de maquette) | `sections/404.liquid`, `page.liquid`, `password.liquid`, `blog.liquid`, `article.liquid`, `collections.liquid`, `layout/password.liquid` | `c2c5e50` |

Styles partagés dans `assets/critical.css` : boutons, fil d'Ariane, conteneur de page (`.page-container`), texte riche (`.rte`), pagination, grille produit (`.collection-grid`), champs de formulaire (`.contact-field*`), sélecteur de quantité.

Rendu vérifié sur l'aperçu (HTML + captures **desktop**). Le **mobile n'a pas pu être contrôlé** (fenêtre Chrome bloquée à 1440 px, aperçu non intégrable dans un cadre) → à faire sur téléphone ou via F12 > mode mobile.

---

## 3. Reste à faire

1. **Contrôle mobile** (390 px) de toutes les pages, puis corrections éventuelles.
2. Contrôle visuel desktop des pages sans maquette (recherche, 404, pages de contenu, mot de passe, blog) : seul le rendu HTML a été vérifié pour certaines.
3. Éventuellement : indicateurs (3 barres) du héro quand il y aura plusieurs visuels.
4. Avant mise en ligne : vrais produits / prix / contenus, pages légales, puis publication du thème **par l'utilisateur**.

---

## 4. Décisions prises (ne pas re-discuter)

- **Base du thème** : Skeleton **stable** (commit `a4f32d3` du dépôt Shopify/skeleton-theme, sections + templates JSON). La v2.0 « developer preview » (`{% block %}` / `{% partial %}`) a été abandonnée : erreur 500 sur cette boutique et non publiable.
- **Polices** auto-hébergées dans `assets/` (Cormorant Garamond, Jost — licence OFL), pas de Google Fonts (RGPD, performance).
- **Breakpoints** : 750 px (mobile / desktop), 990 px pour l'en-tête, la fiche parfum et le panier.
- **Champs et boutons à 48 px** (demande utilisateur ; minimum 44 px du design system respecté). Les hauteurs 52–64 px de la maquette ont été réduites.
- **Contact** : introduction sur 960 px, préférence de recontact + sujet côte à côte, message de 140 px.
- **Photo fiche parfum** : réglages « Format » (portrait 3:4 par défaut) et « Largeur » (460 px par défaut) dans l'éditeur de thème.
- **« Marques »** au lieu de « Maison » pour le filtre et « Nos marques » sur l'accueil. Les phrases du bandeau et du héro qui disent « maisons » sont laissées telles quelles **pour l'instant** (à revoir plus tard).
- Textes d'interface en français (`locales/fr.default.json`), réglages de sections en français.
- Pas de faux contenu : placeholders `[…]` conservés ; pas de vignettes vides dans la galerie produit.

---

## 5. Données de la boutique de dev

Créées par le script `_seed/` (relançable, exclu du thème par `.shopifyignore`) :

```bash
node _seed/seed.mjs definitions   # métachamps parfum.*
node _seed/seed.mjs products      # 8 produits de test (tag prix-de-test)
node _seed/seed.mjs collections   # 7 collections
node _seed/seed.mjs navigation    # 6 pages, 3 menus, page Contact (titre + modèle)
```

- **Métachamps** `parfum.*` : `famille_olfactive` (liste, 8 valeurs), `notes_principales`, `concentration`, `notes_tete`, `notes_coeur`, `notes_fond`.
- **Produits** : Vulcan Feu, Grecia, Royal Blend (French Avenue, avec photo) + [Nom du parfum 4 à 8]. Prix de **test**, à remplacer. Contenances = variantes (« 100 ml », et « [Contenance 2] » sur le n° 7).
- **Collections** : Nos parfums (auto, type Parfum), Nouveautés, Meilleures ventes (manuelles), une par marque.
- **Menus** : Menu principal (Nos parfums, Nous contacter), Services et contact, Informations légales. L'ancien « Footer menu » (lien « Vos choix en matière de confidentialité ») est conservé, non affiché — à décider avant mise en ligne.
- **Pages** : Commandes, Livraison et retours, FAQ, Mentions légales, Politique de confidentialité, CGV (contenu `[Contenu à compléter]`), Nous contacter (modèle `contact`).
- Produits de démo (snowboards) et collections de démo : **supprimés**.
- **Search & Discovery** installé : filtres Marque (Fournisseur), Famille olfactive (métachamp, correspondance OU), Prix, Disponibilité (masqué par le thème).
- Devise : **EUR**. Langue principale : **français**.

---

## 6. Réglages admin en attente (à faire par l'utilisateur)

- **TVA incluse dans les prix** : Paramètres > Taxes et droits > « Tous les prix incluent les taxes » (sinon pas de mention « TVA incluse »).
- **Format du prix** « 49,00 € » : Paramètres > Général > Devise > Formatage → `{{amount_with_comma_separator}} €` (aujourd'hui « €49,00 »).
- **Réseaux sociaux** : liens à saisir dans l'éditeur (section Pied de page) — icônes masquées tant qu'ils sont vides.
- **Visuel du héro** : à choisir dans l'éditeur (placeholder affiché en attendant).
- Familles olfactives de Vulcan Feu, Grecia, Royal Blend : non renseignées (ne pas inventer).
- **Message de la page mot de passe** : Boutique en ligne > Préférences > Protection par mot de passe (affiché sous le titre).

**Décisions en attente de réponse**
- Supprimer les 2 définitions de métachamps de démo `test_data.*` (inutilisées) ?
- Afficher ou non le lien Shopify « Vos choix en matière de confidentialité » dans « Informations légales » ?
- Passer en « marques » les phrases du bandeau et du héro qui disent encore « maisons » (reporté par l'utilisateur) ?

---

## 7. Placeholders et textes à valider

**Contenu à fournir** : prix, concentrations, descriptions, pyramides, familles olfactives, `[Notes principales]`, délais de livraison/retour, seuil de livraison offerte, `[XX] %` newsletter, téléphone, e-mail, horaires (page Contact), messages de confirmation (newsletter, formulaire de contact), liste réelle des moyens de paiement, contenu des 6 pages légales/services.

**Textes d'interface ajoutés faute de maquette** (dans `locales/fr.default.json`, modifiables) :
- Catalogue : « Aucun parfum ne correspond à ces critères. »
- Fiche parfum : « Indisponible » (combinaison de contenance inexistante).
- Panier : « Récapitulatif », « Sous-total », mentions TVA / livraison, « Votre panier est vide. », « Découvrir nos parfums », message d'erreur.
- Recherche : « N résultat(s) pour « … » », « Aucun résultat pour « … ». », « Pages et articles ».
- 404 : « Erreur 404 », « Page introuvable », « La page que vous cherchez n'existe pas ou a été déplacée. », « Découvrir nos parfums », « Retour à l'accueil ».
- Mot de passe : « Cette boutique est privée », « Mot de passe », « Entrer ».

---

## 8. Pièges connus

- **Ne pas modifier les fichiers du thème avec `sed -i`** pendant `shopify theme dev` : ses fichiers temporaires cassent l'aperçu (erreur 500 « Upload Errors ») → utiliser l'outil d'édition ; si ça arrive, redémarrer `shopify theme dev`.
- Après création/suppression de sections, si l'aperçu affiche des erreurs d'envoi : redémarrer `shopify theme dev` (resynchronisation complète).
- Le filtre `structured_data` renvoie du JSON brut : toujours l'entourer de `<script type="application/ld+json">`.
- Dans `{% render %}`, pas de filtre ni de comparaison dans les paramètres : passer par `{% assign %}` avant.
- L'éditeur de fichiers crée parfois des `*.tmp` que `shopify theme dev` signale (« Failed to delete … .tmp ») : sans conséquence si les pages ne montrent pas l'écran « Upload Errors ».
- Les captures Chrome peuvent se figer ou sortir zoomées : vérifier alors le rendu par `curl` avec le cookie du mot de passe (`POST /password` avec `form_type=storefront_password`).
- La suppression de dossiers (`git rm`) est autorisée par une règle de permission ajoutée par l'utilisateur ; l'installation d'apps / validation d'autorisations dans l'admin doit être faite par l'utilisateur.

---

## 9. Historique Git

Sauvegardé sur GitHub (dépôt **privé**) : https://github.com/deniroduvvt/frag-emirates-theme — branche `main`.
Les nouveaux commits restent locaux jusqu'à `git push` (fait par l'utilisateur ; Claude ne pousse pas sans accord).
Ne pas confondre avec `shopify theme push`, interdit par CLAUDE.md.

Un commit par étape terminée :

```
8db70bc Thème Skeleton initial
9a094ba Ajout de CLAUDE.md (règles du projet)
45b9b5f Données de test de la boutique de dev (script _seed/)
e626efc Base Skeleton stable (a4f32d3) à la place de la v2.0 en developer preview
5d6d938 Tokens de design en variables CSS, polices et styles de base
b3cfd16 En-tête, bandeau d'annonce, menu mobile et pied de page
0f2fcae Menus et pages du pied de page
e199bca Page d'accueil : héro, Nos maisons, Nouveautés, Meilleures ventes
7c81ffc Page Nos parfums : grille, filtres, tri et chargement progressif
e221cb8 Libellé « Marques » pour le filtre fournisseur et « Nos marques » sur l'accueil
b8d0e3f Fiche parfum et « Vous aimerez aussi »
9266a9b Page Nous contacter
7d7f51a Contact : introduction recentrée, formulaire plus compact
758d820 Champs et boutons à 48 px, photo produit réglable (format, largeur)
045da79 Page panier
0a8e4c8 Ajout de SUIVI.md (état du projet pour reprendre la conversation)
85aec41 SUIVI.md : sauvegarde GitHub
c2c5e50 Recherche et pages secondaires
```
(+ le commit de cette mise à jour de SUIVI.md)

Commandes utiles : `git log --oneline` (liste), `git show <commit>` (détail d'une étape), `git diff <commit>~1 <commit>` (changements).
