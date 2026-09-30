import type { CommerceProvider } from "../../commerce/provider-interface/commerce-provider";

export const createCartService = (provider: CommerceProvider) => ({
  getCart: (cartId?: string) => provider.getCart(cartId),
  addToCart: (input: { cartId?: string; productId: string; quantity: number }) => provider.addToCart(input),
  updateCartLine: (input: { cartId: string; lineId: string; quantity: number }) => provider.updateCartLine(input),
  removeCartLine: (input: { cartId: string; lineId: string }) => provider.removeCartLine(input),
  clearCart: (input: { cartId: string }) => provider.clearCart(input),
});
