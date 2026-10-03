# Frag Emirates — maquettes à intégrer

E-shop de parfums du Moyen-Orient, sélection resserrée (Swiss Arabian, French Avenue, Khadlaj, Arabiyat Prestige). Ton : luxe sobre, très simple d'usage.

## Contenu du dossier

| Dossier | Contenu |
|---|---|
| `maquettes/desktop/` | 4 pages en 1440 px : `Main` (accueil), `NosParfums` (catalogue), `Parfum` (fiche produit, exemple Vulcan Feu), `Contact` |
| `maquettes/mobile/` | Les mêmes 4 pages en 390 px (`…Mobile.dc.html`) |
| `design-tokens.json` | Couleurs, typographies, espacements, rayons, ombres — **la référence visuelle** |
| `images/` | Photos produit : `vulcan-feu.jpg`, `grecia.jpg`, `royal-blend.jpg` |
| `logo/` | Logo en SVG + PNG transparent. **En-tête = `frag-emirates-logo-texte.svg`** (texte seul : 60 px de haut en desktop, 42 px en mobile, 36 px dans le menu burger). `frag-emirates-logo.svg` (avec flacon) = version complète pour d'autres usages. |

## Important : format des maquettes

Les fichiers `.dc.html` viennent d'un outil de maquette. Ils **ne s'ouvrent pas tels quels dans un navigateur** (ils dépendent d'un runtime absent : `support.js`, balises `<x-dc>`, `<sc-for>`, `<sc-if>`, trous `{{…}}`, classe `DCLogic`).
À lire comme une **spécification** : la structure HTML, les styles inline (valeurs exactes) et les données dans `renderVals()` font foi. À réimplémenter proprement dans la stack choisie — ne pas copier le runtime.

- `<sc-for list="{{products}}" as="p">` = boucle sur la liste `products` définie dans `renderVals()`.
- `<sc-if value="{{x}}">` = affichage conditionnel.
- `onClick="{{fn}}"` = gestionnaire défini dans `renderVals()` ; l'état est dans `this.state`.

## Système visuel (résumé de `design-tokens.json`)

- Fond ivoire `#faf5e8`, texte brun `#4e2610`, texte secondaire `#735340`, accent sable `#ead7a0` (jamais en texte sur fond clair).
- Sections foncées `#2b1508` avec texte crème `#f5ecd8` (bandeau d'annonce, héro, bas de pied de page).
- Titres : **Cormorant Garamond** 500–600 (jamais en capitales). Texte : **Jost**. Labels et boutons en capitales espacées (`letter-spacing` 0.1–0.14em).
- Angles presque vifs (2 px), badges arrondis ; pas d'ombre sur l'interface.
- Focus clavier visible (anneau ivoire + brun), cibles tactiles ≥ 44 px.

## Pages et comportements

**Commun** — bandeau d'annonce foncé ; en-tête (desktop : logo, « Nos parfums », « Nous contacter », recherche, panier ; mobile : burger ☰ qui ouvre un panneau latéral avec recherche + liens, logo centré, recherche + panier) ; pied de page : newsletter, liens « Services et contact » et « Informations légales », réseaux sociaux, moyens de paiement, retour en haut.

**Accueil** — écran d'affichage (héro, visuel à définir), bande « Nos maisons », Nouveautés (4 cartes), Meilleures ventes (4 cartes). Grilles : 4 colonnes desktop, 2 colonnes mobile.

**Nos parfums** — titre + boutons **Filtres** et **Trier par**.
- Filtres : masqués par défaut ; au clic, panneau latéral (plein écran sur mobile) avec Maison, Famille olfactive (« Afficher plus »), **Prix = jauge à deux curseurs de 1 à 100 €**, boutons « Tout effacer » / « Voir les résultats ».
- Tri : menu déroulant sous le bouton (Nouveautés, Meilleures ventes, Prix croissant, Prix décroissant).
- Grille 4 colonnes desktop / 2 colonnes mobile, bouton « Voir plus de parfums ».

**Fiche parfum** — galerie (grande photo + miniatures), puis dans cet ordre : nom/maison, **description**, **bloc paiement** (contenance à gauche + prix à droite, choix de contenance, quantité −/+, « Ajouter au panier », encadré livraison/retours/paiement), **pyramide olfactive** en liste à puces (tête / cœur / fond). En bas : « Vous aimerez aussi ».

**Contact** — intro courte (coordonnées, horaires), formulaire : prénom, nom, e-mail*, téléphone, préférence de recontact (e-mail / téléphone / WhatsApp), sujet, message*, bouton Envoyer.

## Contenu à compléter (placeholders entre crochets)

Prix, concentrations, descriptions, pyramides olfactives, familles olfactives, délais de livraison/retour, seuil de livraison offerte, % de réduction newsletter, téléphone, e-mail, horaires, visuel du héro, liste réelle des moyens de paiement. Ne rien inventer : garder les crochets tant que l'info n'est pas fournie.

Contrainte : ne jamais afficher le nom du parfum de niche dont un produit s'inspire.
