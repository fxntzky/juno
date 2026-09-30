import { describe, expect, it } from "vitest";
import { mockProvider } from "../commerce/mock-provider/mock-provider";
import { createCartService } from "../features/cart/cart-service";
import { createCatalogService } from "../features/catalog/catalog-service";
import { createCheckoutService } from "../features/checkout/checkout-service";
import { createProductService } from "../features/product/product-service";

describe("digital storefront happy path", () => {
  it("runs add-to-cart to checkout flow and confirms the order", async () => {
    const catalogService = createCatalogService(mockProvider);
    const productService = createProductService(mockProvider);
    const cartService = createCartService(mockProvider);
    const checkoutService = createCheckoutService(mockProvider);

    const digitalProducts = await catalogService.listProductsByCollection("digital-time");
    expect(digitalProducts.length).toBeGreaterThan(0);

    const selected = digitalProducts[0];
    const selectedDetail = await productService.getProductBySlug(selected.slug);
    expect(selectedDetail?.id).toBe(selected.id);

    const cart = await cartService.addToCart({
      productId: selected.id,
      quantity: 1,
    });
    expect(cart.itemCount).toBe(1);
    expect(cart.lines[0]?.productId).toBe(selected.id);

    const checkoutStarted = await checkoutService.beginCheckout({
      cartId: cart.cartId,
      email: "buyer@juno.test",
    });
    expect(checkoutStarted.stage).toBe("started");
    expect(checkoutStarted.mode).toBe("demo");

    const withAddress = await checkoutService.setCheckoutAddress({
      checkoutId: checkoutStarted.checkoutId,
      address: {
        firstName: "Ari",
        lastName: "Mori",
        line1: "123 Orbit Ave",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "US",
      },
    });
    expect(withAddress.stage).toBe("address");

    const shippingOptions = await checkoutService.listShippingOptions({ country: "US" });
    expect(shippingOptions.length).toBeGreaterThan(0);

    const withShipping = await checkoutService.setCheckoutShippingOption({
      checkoutId: withAddress.checkoutId,
      shippingOptionId: shippingOptions[0].id,
    });
    expect(withShipping.stage).toBe("shipping");

    const withPayment = await checkoutService.setCheckoutPayment({
      checkoutId: withShipping.checkoutId,
      payment: {
        cardholderName: "Ari Mori",
        cardNumber: "4111111111111111",
        expiryMonth: "10",
        expiryYear: "30",
        cvv: "123",
      },
    });
    expect(withPayment.stage).toBe("payment");
    expect(withPayment.canPlaceOrder).toBe(true);

    const order = await checkoutService.placeOrder({ checkoutId: withPayment.checkoutId });
    expect(order.status).toBe("confirmed");
    expect(order.lines).toHaveLength(1);
    expect(order.lines[0]?.productId).toBe(selected.id);
  });
});

