import { describe, expect, it } from "vitest";
import { mockProvider } from "../commerce/mock-provider/mock-provider";
import { createCartService } from "../features/cart/cart-service";
import { createCheckoutService } from "../features/checkout/checkout-service";

describe("checkout service demo flow", () => {
  it("runs full checkout and places a confirmed order", async () => {
    const cartService = createCartService(mockProvider);
    const checkoutService = createCheckoutService(mockProvider);

    const [firstProduct] = await mockProvider.listProducts("digital-time");
    expect(firstProduct).toBeTruthy();

    const cart = await cartService.addToCart({
      productId: firstProduct.id,
      quantity: 1,
    });

    const started = await checkoutService.beginCheckout({
      cartId: cart.cartId,
      email: "buyer@juno.test",
    });
    expect(started.stage).toBe("started");
    expect(started.mode).toBe("demo");

    const withAddress = await checkoutService.setCheckoutAddress({
      checkoutId: started.checkoutId,
      address: {
        firstName: "Nora",
        lastName: "Ishikawa",
        line1: "Calle 123",
        city: "Buenos Aires",
        state: "CABA",
        postalCode: "1001",
        country: "AR",
      },
    });
    expect(withAddress.stage).toBe("address");

    const withShipping = await checkoutService.setCheckoutShippingOption({
      checkoutId: withAddress.checkoutId,
      shippingOptionId: "standard",
    });
    expect(withShipping.stage).toBe("shipping");

    const withPayment = await checkoutService.setCheckoutPayment({
      checkoutId: withShipping.checkoutId,
      payment: {
        cardholderName: "Nora Ishikawa",
        cardNumber: "4111111111111111",
        expiryMonth: "10",
        expiryYear: "30",
        cvv: "123",
      },
    });
    expect(withPayment.stage).toBe("payment");
    expect(withPayment.canPlaceOrder).toBe(true);

    const order = await checkoutService.placeOrder({
      checkoutId: withPayment.checkoutId,
    });

    expect(order.status).toBe("confirmed");
    expect(order.lines).toHaveLength(1);
    expect(order.total.amount).toBeGreaterThan(order.subtotal.amount);

    const fetchedOrder = await checkoutService.getOrder(order.orderId);
    expect(fetchedOrder?.orderId).toBe(order.orderId);
  });
});
