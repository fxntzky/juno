import { describe, expect, it } from "vitest";
import type { CatalogProductRecord, CollectionRecord } from "../commerce/provider-interface/commerce-provider";
import { createRuntimeMockProvider } from "../commerce/mock-provider/runtime-core";

const product: CatalogProductRecord = {
  id: "digital-test-m83", slug: "junom83", name: "JUNO M83", collectionId: "digital-time",
  status: "launch-ready", description: "Demo object", platform: { family: "digital-platform-v2" },
  priceIntent: { currency: "USD", min: 380, max: 380, displayMode: "fixed" },
  availability: { status: "in-stock", sellable: true }, inventory: { quantity: 10, backorderable: false },
  storyModules: [], media: [], tags: ["digital"],
};
const collection: CollectionRecord = {
  id: "digital-time", name: "Digital Time", description: "Digital watches", productCountTarget: 1, order: 1,
};

describe("browser demo cart persistence", () => {
  it("restores the cart after a provider restart and persists a clear", async () => {
    const values = new Map<string, string>();
    const cartStorage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    };
    const makeProvider = () => createRuntimeMockProvider(
      { collections: [collection], products: [product] }, { cartStorage },
    );
    const first = makeProvider();
    const added = await first.addToCart({ productId: product.id, quantity: 2 });
    expect(added.subtotal.amount).toBe(760);

    const second = makeProvider();
    const restored = await second.getCart(added.cartId);
    expect(restored.itemCount).toBe(2);
    expect(restored.lines[0]?.name).toBe("JUNO M83");
    expect(restored.subtotal.amount).toBe(760);

    await second.clearCart({ cartId: added.cartId });
    const third = makeProvider();
    expect((await third.getCart(added.cartId)).itemCount).toBe(0);
    // No checkout, shipping, card or personal details are persisted by the cart.
    expect(values.values().next().value).not.toContain("cardNumber");
  });
});
