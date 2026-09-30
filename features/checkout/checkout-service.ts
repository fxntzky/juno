import type { CommerceProvider, CheckoutPaymentInput, ShippingAddress } from "../../commerce/provider-interface/commerce-provider";

export const createCheckoutService = (provider: CommerceProvider) => ({
  getCartForCheckout: (cartId: string) => provider.getCart(cartId),
  listShippingOptions: (input?: { country?: string }) => provider.listShippingOptions(input),
  beginCheckout: (input: { cartId: string; email: string }) => provider.beginCheckout(input),
  setCheckoutAddress: (input: { checkoutId: string; address: ShippingAddress }) => provider.setCheckoutAddress(input),
  setCheckoutShippingOption: (input: { checkoutId: string; shippingOptionId: string }) =>
    provider.setCheckoutShippingOption(input),
  setCheckoutPayment: (input: { checkoutId: string; payment: CheckoutPaymentInput }) => provider.setCheckoutPayment(input),
  getCheckout: (checkoutId: string) => provider.getCheckout(checkoutId),
  placeOrder: (input: { checkoutId: string }) => provider.placeOrder(input),
  getOrder: (orderId: string) => provider.getOrder(orderId),
});
