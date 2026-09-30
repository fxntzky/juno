import collectionsManifest from "../../catalog/collections.json";
import { productGalleryBySlug, productImageBySlug } from "../../catalog/media-manifest";
import type { CatalogProductRecord, CollectionRecord } from "../provider-interface/commerce-provider";
import { createRuntimeMockProvider } from "./runtime-core";

type ProductModuleImport = {
  default: CatalogProductRecord;
};

const productModules = import.meta.glob("../../catalog/*/*/product.json", {
  eager: true,
}) as Record<string, ProductModuleImport>;

const products = Object.values(productModules).map((module) => module.default);
const collections = [...collectionsManifest.collections].sort((a, b) => a.order - b.order) as CollectionRecord[];

export const browserMockProvider = createRuntimeMockProvider(
  {
    collections,
    products,
  },
  {
    mediaBySlug: productImageBySlug,
    mediaGalleryBySlug: productGalleryBySlug,
    cartStorage: (() => {
      try { return window.localStorage; } catch { return undefined; }
    })(),
  },
);
