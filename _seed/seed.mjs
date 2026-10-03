// Crée les données de test dans la boutique de dev via l'API Admin (shopify store execute).
// Usage : node _seed/seed.mjs <definitions|products|collections>
// Relançable : les définitions/collections existantes sont ignorées, les produits sont mis à jour (identifiés par handle).

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORE, API_VERSION, ONLINE_STORE_PUBLICATION, DEFINITIONS, PRODUCTS, COLLECTIONS } from './data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = join(ROOT, '_design', 'images');
const TMP = mkdtempSync(join(tmpdir(), 'fe-seed-'));

function gql(query, variables = {}) {
  const q = join(TMP, 'q.graphql'), v = join(TMP, 'v.json'), out = join(TMP, 'out.json');
  writeFileSync(q, query);
  writeFileSync(v, JSON.stringify(variables));
  writeFileSync(out, '');
  const args = ['store', 'execute', '-s', STORE, '--version', API_VERSION, '--allow-mutations', '-j',
    '--query-file', `"${q}"`, '--variable-file', `"${v}"`, '--output-file', `"${out}"`];
  const res = spawnSync('shopify', args, { shell: true, encoding: 'utf8' });
  const text = readFileSync(out, 'utf8');
  if (res.status !== 0 || !text) throw new Error(`shopify store execute a échoué :\n${res.stdout}\n${res.stderr}`);
  return JSON.parse(text);
}

function check(label, payload) {
  const errors = payload.userErrors || [];
  if (errors.length) throw new Error(`${label} : ${JSON.stringify(errors)}`);
}

async function publish(id) {
  const r = gql(`mutation Publish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) { userErrors { field message } }
  }`, { id, input: [{ publicationId: ONLINE_STORE_PUBLICATION }] });
  check(`Publication ${id}`, r.publishablePublish);
}

async function definitions() {
  const existing = gql(`query { metafieldDefinitions(first: 50, ownerType: PRODUCT, namespace: "parfum") { nodes { key } } }`)
    .metafieldDefinitions.nodes.map((n) => n.key);
  for (const d of DEFINITIONS) {
    if (existing.includes(d.key)) { console.log(`= parfum.${d.key} existe déjà`); continue; }
    const definition = {
      namespace: 'parfum', key: d.key, name: d.name, description: d.description, type: d.type,
      ownerType: 'PRODUCT', pin: true, access: { storefront: 'PUBLIC_READ' },
      validations: d.choices ? [{ name: 'choices', value: JSON.stringify(d.choices) }] : []
    };
    const r = gql(`mutation CreateDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id namespace key }
        userErrors { field message code }
      }
    }`, { definition });
    check(`Définition ${d.key}`, r.metafieldDefinitionCreate);
    console.log(`+ parfum.${d.key} (${d.type})`);
  }
}

async function uploadImage(filename) {
  const path = join(IMAGES, filename);
  const r = gql(`mutation StagedUploads($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { field message }
    }
  }`, { input: [{ filename, mimeType: 'image/jpeg', resource: 'IMAGE', httpMethod: 'POST', fileSize: String(statSync(path).size) }] });
  check(`Upload ${filename}`, r.stagedUploadsCreate);
  const target = r.stagedUploadsCreate.stagedTargets[0];
  const form = new FormData();
  for (const { name, value } of target.parameters) form.append(name, value);
  form.append('file', new Blob([readFileSync(path)], { type: 'image/jpeg' }), filename);
  const res = await fetch(target.url, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Envoi de ${filename} : HTTP ${res.status}`);
  return target.resourceUrl;
}

async function products() {
  const existing = gql(`query ProductsByHandle($query: String!) {
    products(first: 50, query: $query) { nodes { handle } }
  }`, { query: PRODUCTS.map((p) => `handle:${p.handle}`).join(' OR ') }).products.nodes.map((n) => n.handle);

  for (const p of PRODUCTS) {
    const metafields = [
      { namespace: 'parfum', key: 'notes_principales', type: 'single_line_text_field', value: p.notes || '[Notes principales]' },
      { namespace: 'parfum', key: 'concentration', type: 'single_line_text_field', value: '[Concentration]' },
      { namespace: 'parfum', key: 'notes_tete', type: 'list.single_line_text_field', value: JSON.stringify(['[notes de tête]']) },
      { namespace: 'parfum', key: 'notes_coeur', type: 'list.single_line_text_field', value: JSON.stringify(['[notes de cœur]']) },
      { namespace: 'parfum', key: 'notes_fond', type: 'list.single_line_text_field', value: JSON.stringify(['[notes de fond]']) }
    ];
    if (p.familles) metafields.push({ namespace: 'parfum', key: 'famille_olfactive', type: 'list.single_line_text_field', value: JSON.stringify(p.familles) });

    const input = {
      title: p.title, handle: p.handle, vendor: p.vendor, productType: 'Parfum', status: 'ACTIVE',
      descriptionHtml: p.description, tags: ['prix-de-test'], metafields,
      productOptions: [{ name: 'Contenance', values: p.variants.map(([name]) => ({ name })) }],
      variants: p.variants.map(([name, price]) => ({
        optionValues: [{ optionName: 'Contenance', name }], price, inventoryItem: { tracked: false }
      }))
    };
    // L'image n'est envoyée qu'à la création, pour ne pas la dupliquer en cas de relance.
    if (p.image && !existing.includes(p.handle)) {
      input.files = [{ originalSource: await uploadImage(p.image), alt: p.alt, contentType: 'IMAGE' }];
    }

    const r = gql(`mutation SetProduct($input: ProductSetInput!, $identifier: ProductSetIdentifiers) {
      productSet(synchronous: true, input: $input, identifier: $identifier) {
        product { id handle title }
        userErrors { field message code }
      }
    }`, { input, identifier: { handle: p.handle } });
    check(`Produit ${p.handle}`, r.productSet);
    await publish(r.productSet.product.id);
    console.log(`${existing.includes(p.handle) ? '~' : '+'} ${p.title} (${p.vendor}) ${r.productSet.product.id}`);
  }
}

async function collections() {
  const productIds = Object.fromEntries(gql(`query ProductsByHandle($query: String!) {
    products(first: 50, query: $query) { nodes { id handle } }
  }`, { query: PRODUCTS.map((p) => `handle:${p.handle}`).join(' OR ') }).products.nodes.map((n) => [n.handle, n.id]));
  const existing = gql(`query Existing($query: String!) { collections(first: 50, query: $query) { nodes { handle } } }`,
    { query: COLLECTIONS.map((c) => `handle:${c.handle}`).join(' OR ') }).collections.nodes.map((n) => n.handle);

  for (const c of COLLECTIONS) {
    if (existing.includes(c.handle)) { console.log(`= ${c.title} existe déjà`); continue; }
    const input = { title: c.title, handle: c.handle };
    if (c.rules) input.ruleSet = { appliedDisjunctively: false, rules: c.rules };
    else { input.sortOrder = 'MANUAL'; input.products = c.products.map((h) => productIds[h]); }
    const r = gql(`mutation CreateCollection($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id handle title }
        userErrors { field message }
      }
    }`, { input });
    check(`Collection ${c.handle}`, r.collectionCreate);
    await publish(r.collectionCreate.collection.id);
    console.log(`+ ${c.title} (${c.rules ? 'automatique' : 'manuelle'}) ${r.collectionCreate.collection.id}`);
  }
}

const steps = { definitions, products, collections };
const step = process.argv[2];
if (!steps[step]) { console.error(`Usage : node _seed/seed.mjs <${Object.keys(steps).join('|')}>`); process.exit(1); }
await steps[step]();
