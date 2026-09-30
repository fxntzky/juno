import type { PropsWithChildren } from "react";
import type { CommerceProvider } from "../../commerce/provider-interface/commerce-provider";
import { CartProvider } from "./CartProvider";
import { CommerceProviderContext } from "./CommerceProviderContext";

export const AppProviders = ({
  provider,
  children,
}: PropsWithChildren<{ provider: CommerceProvider }>) => {
  return (
    <CommerceProviderContext provider={provider}>
      <CartProvider>{children}</CartProvider>
    </CommerceProviderContext>
  );
};
