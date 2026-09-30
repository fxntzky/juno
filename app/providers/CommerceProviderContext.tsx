import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { createCartService } from "../../features/cart/cart-service";
import { createCatalogService } from "../../features/catalog/catalog-service";
import { createCheckoutService } from "../../features/checkout/checkout-service";
import { createCollectionsService } from "../../features/collections/collections-service";
import { createProductService } from "../../features/product/product-service";
import type { CommerceProvider } from "../../commerce/provider-interface/commerce-provider";

type CommerceServices = {
  provider: CommerceProvider;
  catalogService: ReturnType<typeof createCatalogService>;
  collectionsService: ReturnType<typeof createCollectionsService>;
  productService: ReturnType<typeof createProductService>;
  cartService: ReturnType<typeof createCartService>;
  checkoutService: ReturnType<typeof createCheckoutService>;
};

const CommerceServicesContext = createContext<CommerceServices | null>(null);

export const CommerceProviderContext = ({
  provider,
  children,
}: PropsWithChildren<{ provider: CommerceProvider }>) => {
  const services = useMemo<CommerceServices>(
    () => ({
      provider,
      catalogService: createCatalogService(provider),
      collectionsService: createCollectionsService(provider),
      productService: createProductService(provider),
      cartService: createCartService(provider),
      checkoutService: createCheckoutService(provider),
    }),
    [provider],
  );

  return <CommerceServicesContext.Provider value={services}>{children}</CommerceServicesContext.Provider>;
};

export const useCommerceServices = (): CommerceServices => {
  const context = useContext(CommerceServicesContext);
  if (!context) {
    throw new Error("useCommerceServices must be used within CommerceProviderContext");
  }
  return context;
};
