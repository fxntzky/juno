import type { CommerceProvider } from "../../commerce/provider-interface/commerce-provider";

export const createProductService = (provider: CommerceProvider) => ({
  getProductBySlug: (slug: string) => provider.getProductBySlug(slug),
});
