// Données de test pour la boutique de développement.
// Textes entre crochets = placeholders du HANDOFF, à remplacer par le vrai contenu.
// Prix = VALEURS DE TEST (produits tagués « prix-de-test »), à remplacer avant mise en ligne.

export const STORE = 'frag-emirates.myshopify.com';
export const API_VERSION = '2026-07';
export const ONLINE_STORE_PUBLICATION = 'gid://shopify/Publication/352105103730';

export const FAMILLES = ['Ambré', 'Boisé', 'Épicé', 'Fruité', 'Gourmand', 'Floral', 'Frais', 'Musqué'];

export const DEFINITIONS = [
  { key: 'famille_olfactive', name: 'Famille olfactive', type: 'list.single_line_text_field', choices: FAMILLES,
    description: 'Filtre « Famille olfactive » de la page Nos parfums.' },
  { key: 'notes_principales', name: 'Notes principales', type: 'single_line_text_field',
    description: 'Ligne sous le nom du parfum sur les cartes produit.' },
  { key: 'concentration', name: 'Concentration', type: 'single_line_text_field',
    description: 'Affichée sur la fiche : « Concentration · Contenance ».' },
  { key: 'notes_tete', name: 'Notes de tête', type: 'list.single_line_text_field',
    description: 'Pyramide olfactive de la fiche parfum.' },
  { key: 'notes_coeur', name: 'Notes de cœur', type: 'list.single_line_text_field',
    description: 'Pyramide olfactive de la fiche parfum.' },
  { key: 'notes_fond', name: 'Notes de fond', type: 'list.single_line_text_field',
    description: 'Pyramide olfactive de la fiche parfum.' }
];

const DESCRIPTION = '<p>[Description courte — deux ou trois phrases sur le caractère du parfum, son sillage et le moment où le porter.]</p>';

// variants : [contenance, prix de test]
export const PRODUCTS = [
  { handle: 'vulcan-feu', title: 'Vulcan Feu', vendor: 'French Avenue', notes: 'Mangue, piment, thym, oud',
    variants: [['100 ml', '49.00']], image: 'vulcan-feu.jpg', alt: 'Flacon Vulcan Feu de French Avenue' },
  { handle: 'grecia', title: 'Grecia', vendor: 'French Avenue',
    variants: [['100 ml', '39.00']], image: 'grecia.jpg', alt: 'Flacon Grecia de French Avenue' },
  { handle: 'royal-blend', title: 'Royal Blend', vendor: 'French Avenue',
    variants: [['100 ml', '59.00']], image: 'royal-blend.jpg', alt: 'Flacon Royal Blend de French Avenue' },
  { handle: 'nom-du-parfum-4', title: '[Nom du parfum 4]', vendor: 'Swiss Arabian', familles: ['Ambré', 'Boisé'],
    variants: [['100 ml', '19.00']] },
  { handle: 'nom-du-parfum-5', title: '[Nom du parfum 5]', vendor: 'Swiss Arabian', familles: ['Floral'],
    variants: [['100 ml', '89.00']] },
  { handle: 'nom-du-parfum-6', title: '[Nom du parfum 6]', vendor: 'Khadlaj', familles: ['Épicé'],
    variants: [['100 ml', '29.00']] },
  { handle: 'nom-du-parfum-7', title: '[Nom du parfum 7]', vendor: 'Khadlaj', familles: ['Frais', 'Musqué'],
    variants: [['100 ml', '69.00'], ['[Contenance 2]', '99.00']] },
  { handle: 'nom-du-parfum-8', title: '[Nom du parfum 8]', vendor: 'Arabiyat Prestige', familles: ['Gourmand', 'Fruité'],
    variants: [['100 ml', '79.00']] }
].map((p) => ({ ...p, description: DESCRIPTION }));

// rules : collection automatique ; products : collection manuelle (ordre = ordre d'affichage)
export const COLLECTIONS = [
  { handle: 'nos-parfums', title: 'Nos parfums', rules: [{ column: 'TYPE', relation: 'EQUALS', condition: 'Parfum' }] },
  { handle: 'nouveautes', title: 'Nouveautés', products: ['vulcan-feu', 'grecia', 'royal-blend', 'nom-du-parfum-4'] },
  { handle: 'meilleures-ventes', title: 'Meilleures ventes',
    products: ['vulcan-feu', 'nom-du-parfum-5', 'nom-du-parfum-8', 'nom-du-parfum-6'] },
  ...['French Avenue', 'Swiss Arabian', 'Khadlaj', 'Arabiyat Prestige'].map((vendor) => ({
    handle: vendor.toLowerCase().replace(/ /g, '-'), title: vendor,
    rules: [{ column: 'VENDOR', relation: 'EQUALS', condition: vendor }]
  }))
];
