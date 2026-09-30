import type { CollectionId, CommerceProvider } from "../../commerce/provider-interface/commerce-provider";

export const createCatalogService = (provider: CommerceProvider) => ({
  listCollections: () => provider.listCollections(),
  listProductsByCollection: (collectionId: CollectionId) => provider.listProducts(collectionId),
});
