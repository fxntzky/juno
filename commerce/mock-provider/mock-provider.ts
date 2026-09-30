import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { CatalogProductRecord, CollectionRecord } from "../provider-interface/commerce-provider";
import { createRuntimeMockProvider } from "./runtime-core";

type CollectionManifest = { collections: CollectionRecord[] };

const mockRoot = dirname(fileURLToPath(import.meta.url));
const catalogRoot = join(mockRoot, "..", "..", "catalog");
const collectionsManifestPath = join(catalogRoot, "collections.json");

const readJsonFile = <T>(filePath: string): T => {
  const source = readFileSync(filePath, "utf8");
  return JSON.parse(source) as T;
};

const loadCatalog = (): { collections: CollectionRecord[]; products: CatalogProductRecord[] } => {
  const collectionManifest = readJsonFile<CollectionManifest>(collectionsManifestPath);
  const collections = [...collectionManifest.collections].sort((a, b) => a.order - b.order);
  const products: CatalogProductRecord[] = [];

  for (const collection of collections) {
    const collectionDir = join(catalogRoot, collection.id);
    const entries = readdirSync(collectionDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const productFilePath = join(collectionDir, entry.name, "product.json");
      if (!existsSync(productFilePath)) {
        continue;
      }

      const product = readJsonFile<CatalogProductRecord>(productFilePath);
      if (product.collectionId !== collection.id) {
        throw new Error(
          `Catalog mismatch: ${product.slug} is inside ${collection.id} but declares ${product.collectionId}.`,
        );
      }

      products.push(product);
    }
  }

  return { collections, products };
};

export const mockProvider = createRuntimeMockProvider(loadCatalog());
