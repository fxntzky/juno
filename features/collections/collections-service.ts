import type { CommerceProvider } from "../../commerce/provider-interface/commerce-provider";

export const createCollectionsService = (provider: CommerceProvider) => ({
  listCollections: () => provider.listCollections(),
});
