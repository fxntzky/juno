import type {
  CatalogProductRecord,
  CartLine,
  CartSnapshot,
  CheckoutPaymentInput,
  CheckoutPaymentSummary,
  CheckoutSnapshot,
  CollectionRecord,
  CommerceProvider,
  Inventory,
  Money,
  OrderSnapshot,
  ProductDetail,
  ProductSummary,
  ShippingOption,
} from "../provider-interface/commerce-provider";

type RuntimeCatalog = {
  collections: CollectionRecord[];
  products: CatalogProductRecord[];
};

type CartStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const DEMO_CART_STORAGE_KEY = "juno-demo-cart-v2";

type RuntimeOptions = {
  cartStorage?: CartStorage;
  mediaBySlug?: Record<string, string>;
  mediaGalleryBySlug?: Record<
    string,
    Array<{
      type: "image" | "video";
      url: string;
      alt?: string;
    }>
  >;
};

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const cloneMoney = (money: Money): Money => ({ ...money });

const ensureInventory = (product: CatalogProductRecord): Inventory => {
  if (product.inventory) {
    return { ...product.inventory };
  }

  return {
    quantity: product.availability.sellable ? 10 : 0,
    backorderable: false,
  };
};

const cloneCartLine = (line: CartLine): CartLine => ({
  ...line,
  unitPrice: cloneMoney(line.unitPrice),
  lineTotal: cloneMoney(line.lineTotal),
});

const cloneCart = (cart: CartSnapshot): CartSnapshot => ({
  cartId: cart.cartId,
  lines: cart.lines.map((line) => cloneCartLine(line)),
  itemCount: cart.itemCount,
  subtotal: cloneMoney(cart.subtotal),
});

const cloneShippingOption = (option: ShippingOption): ShippingOption => ({ ...option, price: cloneMoney(option.price) });

const cloneCheckout = (checkout: CheckoutSnapshot): CheckoutSnapshot => ({
  ...checkout,
  subtotal: cloneMoney(checkout.subtotal),
  shippingTotal: cloneMoney(checkout.shippingTotal),
  taxTotal: cloneMoney(checkout.taxTotal),
  total: cloneMoney(checkout.total),
  ...(checkout.shippingAddress ? { shippingAddress: { ...checkout.shippingAddress } } : {}),
  ...(checkout.shippingOption ? { shippingOption: cloneShippingOption(checkout.shippingOption) } : {}),
  ...(checkout.payment ? { payment: { ...checkout.payment } } : {}),
});

const cloneOrder = (order: OrderSnapshot): OrderSnapshot => ({
  ...order,
  shippingAddress: { ...order.shippingAddress },
  shippingOption: cloneShippingOption(order.shippingOption),
  payment: { ...order.payment },
  lines: order.lines.map((line) => cloneCartLine(line)),
  subtotal: cloneMoney(order.subtotal),
  shippingTotal: cloneMoney(order.shippingTotal),
  taxTotal: cloneMoney(order.taxTotal),
  total: cloneMoney(order.total),
});

const createShippingOptions = (): ShippingOption[] => [
  { id: "standard", label: "Standard Shipping", etaDays: 6, price: { currency: "USD", amount: 12 } },
  { id: "express", label: "Express Shipping", etaDays: 2, price: { currency: "USD", amount: 24 } },
];

const detectCardBrand = (cardNumber: string): CheckoutPaymentSummary["brand"] => {
  if (cardNumber.startsWith("4")) {
    return "visa";
  }

  if (/^5[1-5]/.test(cardNumber)) {
    return "mastercard";
  }

  return "unknown";
};

const sanitizeDigits = (value: string): string => value.replace(/\D/g, "");

const validateEmail = (email: string): void => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email is required for checkout.");
  }
};

const validatePaymentInput = (payment: CheckoutPaymentInput): CheckoutPaymentSummary => {
  const digits = sanitizeDigits(payment.cardNumber);
  if (digits.length < 12 || digits.length > 19) {
    throw new Error("Card number is invalid.");
  }

  if (!/^\d{2}$/.test(payment.expiryMonth)) {
    throw new Error("Expiry month must be two digits.");
  }

  const month = Number(payment.expiryMonth);
  if (month < 1 || month > 12) {
    throw new Error("Expiry month is invalid.");
  }

  if (!/^\d{2}$/.test(payment.expiryYear)) {
    throw new Error("Expiry year must be two digits.");
  }

  if (!/^\d{3,4}$/.test(payment.cvv)) {
    throw new Error("CVV is invalid.");
  }

  if (payment.cardholderName.trim().length < 3) {
    throw new Error("Cardholder name is required.");
  }

  return {
    brand: detectCardBrand(digits),
    last4: digits.slice(-4),
  };
};

const recalculateCart = (cart: CartSnapshot): CartSnapshot => {
  let itemCount = 0;
  let subtotal = 0;

  for (const line of cart.lines) {
    itemCount += line.quantity;
    line.lineTotal = {
      currency: line.unitPrice.currency,
      amount: roundMoney(line.unitPrice.amount * line.quantity),
    };
    subtotal += line.lineTotal.amount;
  }

  cart.itemCount = itemCount;
  cart.subtotal = { currency: "USD", amount: roundMoney(subtotal) };
  return cart;
};

const computeTotals = (subtotal: Money, shipping: Money): { tax: Money; total: Money } => {
  const taxable = subtotal.amount + shipping.amount;
  const taxAmount = roundMoney(taxable * 0.095);
  return {
    tax: { currency: "USD", amount: taxAmount },
    total: { currency: "USD", amount: roundMoney(taxable + taxAmount) },
  };
};

export const createRuntimeMockProvider = (catalog: RuntimeCatalog, options: RuntimeOptions = {}): CommerceProvider => {
  const productsById = new Map(catalog.products.map((product) => [product.id, product]));
  const productsBySlug = new Map(catalog.products.map((product) => [product.slug, product]));
  const inventoryByProductId = new Map(
    catalog.products.map((product) => {
      const inventory = ensureInventory(product);
      return [product.id, inventory] as const;
    }),
  );

  const carts = new Map<string, CartSnapshot>();
  const checkouts = new Map<string, CheckoutSnapshot>();
  const orders = new Map<string, OrderSnapshot>();

  let lineCounter = 1;
  let cartCounter = 1;
  let checkoutCounter = 1;
  let orderCounter = 1;

  const getProductPrice = (product: CatalogProductRecord): Money => {
    const amount = product.priceIntent?.min ?? 0;
    return { currency: "USD", amount };
  };

  const getProductMedia = (product: CatalogProductRecord): ProductDetail["media"] => {
    const mappedGallery = options.mediaGalleryBySlug?.[product.slug];
    if (mappedGallery && mappedGallery.length > 0) {
      return mappedGallery.map((asset) => ({ ...asset }));
    }

    if (product.media.length > 0) {
      return product.media;
    }

    const mapped = options.mediaBySlug?.[product.slug];
    if (mapped) {
      return [{ type: "image", url: mapped, alt: `${product.name} hero image` }];
    }

    return [];
  };

  const getThumbnail = (product: CatalogProductRecord): string | undefined => {
    const mappedGallery = options.mediaGalleryBySlug?.[product.slug];
    if (mappedGallery && mappedGallery.length > 0) {
      const firstGalleryImage = mappedGallery.find((asset) => asset.type === "image");
      if (firstGalleryImage?.url) {
        return firstGalleryImage.url;
      }
    }

    const mapped = options.mediaBySlug?.[product.slug];
    if (mapped) {
      return mapped;
    }

    const first = getProductMedia(product).find((asset) => asset.type === "image");
    return first?.url;
  };

  const toSummary = (product: CatalogProductRecord): ProductSummary => {
    const inventoryState = inventoryByProductId.get(product.id) ?? ensureInventory(product);
    const inventory = { ...inventoryState };
    const currentPrice = getProductPrice(product);

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      collection: product.collectionId,
      status: product.status,
      availability: {
        status: inventory.quantity > 0 || inventory.backorderable ? "in-stock" : "out-of-stock",
        sellable: inventory.quantity > 0 || inventory.backorderable,
      },
      inventory,
      currentPrice,
      ...(product.priceIntent
        ? {
            priceRange: {
              min: { currency: "USD", amount: product.priceIntent.min },
              max: { currency: "USD", amount: product.priceIntent.max },
            },
          }
        : {}),
      thumbnailUrl: getThumbnail(product),
    };
  };

  const toDetail = (product: CatalogProductRecord): ProductDetail => {
    const summary = toSummary(product);
    return {
      ...summary,
      description: product.description,
      platform: product.platform,
      storyModules: product.storyModules,
      media: getProductMedia(product),
      tags: product.tags,
      available: summary.availability.sellable,
    };
  };

  const createCart = (cartId = `cart-${cartCounter++}`): CartSnapshot => ({
    cartId,
    lines: [],
    itemCount: 0,
    subtotal: { currency: "USD", amount: 0 },
  });

  // Persist product IDs and quantities only, never customer details or payment fixtures.
  // The storage dependency is injected so the domain provider also works in Vitest/Node.
  const persistCart = (cart: CartSnapshot): void => {
    try {
      options.cartStorage?.setItem(
        DEMO_CART_STORAGE_KEY,
        JSON.stringify({
          cartId: cart.cartId,
          lines: cart.lines.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
      );
    } catch {
      // Private browsing / disabled storage must not break the storefront.
    }
  };

  const restoreCart = (cartId: string): CartSnapshot | null => {
    try {
      const raw = options.cartStorage?.getItem(DEMO_CART_STORAGE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw) as { cartId?: unknown; lines?: unknown };
      if (saved?.cartId !== cartId || !Array.isArray(saved.lines)) return null;

      const cart = createCart(cartId);
      for (const item of saved.lines as unknown[]) {
        if (typeof item !== "object" || item === null) continue;
        const line = item as { productId?: unknown; quantity?: unknown };
        if (typeof line.productId !== "string" || typeof line.quantity !== "number" || !Number.isSafeInteger(line.quantity)) continue;
        const product = productsById.get(line.productId);
        const inventory = inventoryByProductId.get(line.productId);
        if (!product || !inventory) continue;
        const quantity = Math.min(line.quantity, inventory.quantity);
        if (quantity <= 0) continue;
        const unitPrice = getProductPrice(product);
        cart.lines.push({
          lineId: `line-${lineCounter++}`,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          thumbnailUrl: getThumbnail(product),
          quantity,
          unitPrice,
          lineTotal: { currency: unitPrice.currency, amount: unitPrice.amount * quantity },
        });
      }
      return recalculateCart(cart);
    } catch {
      return null;
    }
  };

  const getOrCreateCart = (cartId?: string): CartSnapshot => {
    if (cartId) {
      const existing = carts.get(cartId);
      if (existing) return existing;
      const restored = restoreCart(cartId);
      if (restored) {
        carts.set(cartId, restored);
        return restored;
      }
    }

    const created = createCart(cartId);
    carts.set(created.cartId, created);
    return created;
  };

  const assertSellableQuantity = (productId: string, requestedQty: number): void => {
    const inventory = inventoryByProductId.get(productId);
    if (!inventory) {
      throw new Error(`Inventory record missing for product: ${productId}`);
    }

    if (requestedQty <= inventory.quantity) {
      return;
    }

    if (inventory.backorderable) {
      return;
    }

    throw new Error("Requested quantity exceeds available stock.");
  };

  const resolveShippingOption = (shippingOptionId: string): ShippingOption => {
    const option = createShippingOptions().find((item) => item.id === shippingOptionId);
    if (!option) {
      throw new Error(`Shipping option not found: ${shippingOptionId}`);
    }
    return option;
  };

  const getCheckout = (checkoutId: string): CheckoutSnapshot => {
    const checkout = checkouts.get(checkoutId);
    if (!checkout) {
      throw new Error(`Checkout not found: ${checkoutId}`);
    }

    return checkout;
  };

  const getOrder = (orderId: string): OrderSnapshot | null => {
    const order = orders.get(orderId);
    return order ? cloneOrder(order) : null;
  };

  return {
    async listCollections() {
      return catalog.collections.map((collection) => ({ ...collection }));
    },
    async listProducts(collectionId) {
      return catalog.products.filter((product) => product.collectionId === collectionId).map((product) => toSummary(product));
    },
    async getProductBySlug(slug) {
      const product = productsBySlug.get(slug);
      return product ? toDetail(product) : null;
    },
    async getCart(cartId) {
      return cloneCart(getOrCreateCart(cartId));
    },
    async addToCart(input) {
      if (input.quantity <= 0) {
        throw new Error("Quantity must be positive.");
      }

      const product = productsById.get(input.productId);
      if (!product) {
        throw new Error(`Product not found: ${input.productId}`);
      }

      const cart = getOrCreateCart(input.cartId);
      const existingLine = cart.lines.find((line) => line.productId === input.productId);
      const nextQty = (existingLine?.quantity ?? 0) + input.quantity;
      assertSellableQuantity(product.id, nextQty);

      if (existingLine) {
        existingLine.quantity = nextQty;
      } else {
        const unitPrice = getProductPrice(product);
        cart.lines.push({
          lineId: `line-${lineCounter++}`,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          thumbnailUrl: getThumbnail(product),
          quantity: input.quantity,
          unitPrice,
          lineTotal: { currency: unitPrice.currency, amount: unitPrice.amount * input.quantity },
        });
      }

      recalculateCart(cart);
      carts.set(cart.cartId, cart);
      persistCart(cart);
      return cloneCart(cart);
    },
    async updateCartLine(input) {
      const cart = getOrCreateCart(input.cartId);
      const line = cart.lines.find((item) => item.lineId === input.lineId);
      if (!line) {
        return cloneCart(cart);
      }

      if (input.quantity <= 0) {
        cart.lines = cart.lines.filter((item) => item.lineId !== input.lineId);
      } else {
        assertSellableQuantity(line.productId, input.quantity);
        line.quantity = input.quantity;
      }

      recalculateCart(cart);
      carts.set(cart.cartId, cart);
      persistCart(cart);
      return cloneCart(cart);
    },
    async removeCartLine(input) {
      const cart = getOrCreateCart(input.cartId);
      cart.lines = cart.lines.filter((line) => line.lineId !== input.lineId);
      recalculateCart(cart);
      carts.set(cart.cartId, cart);
      persistCart(cart);
      return cloneCart(cart);
    },
    async clearCart(input) {
      const cart = getOrCreateCart(input.cartId);
      cart.lines = [];
      recalculateCart(cart);
      carts.set(cart.cartId, cart);
      persistCart(cart);
      return cloneCart(cart);
    },
    async listShippingOptions() {
      return createShippingOptions().map((option) => cloneShippingOption(option));
    },
    async beginCheckout(input) {
      validateEmail(input.email);
      const cart = getOrCreateCart(input.cartId);
      if (cart.lines.length === 0) {
        throw new Error("Cannot begin checkout with an empty cart.");
      }

      const checkoutId = `chk-${checkoutCounter++}`;
      const subtotal = cloneMoney(cart.subtotal);
      const shippingTotal: Money = { currency: "USD", amount: 0 };
      const taxTotal: Money = { currency: "USD", amount: 0 };
      const total = cloneMoney(subtotal);

      const checkout: CheckoutSnapshot = {
        checkoutId,
        cartId: cart.cartId,
        mode: "demo",
        stage: "started",
        email: input.email,
        subtotal,
        shippingTotal,
        taxTotal,
        total,
        canPlaceOrder: false,
        message: "Demo checkout started. No purchase or payment will take place.",
      };

      checkouts.set(checkoutId, checkout);
      return cloneCheckout(checkout);
    },
    async setCheckoutAddress(input) {
      const checkout = getCheckout(input.checkoutId);
      checkout.shippingAddress = { ...input.address };
      checkout.stage = "address";
      checkout.message = "Shipping address saved. Select a shipping method.";
      checkouts.set(checkout.checkoutId, checkout);
      return cloneCheckout(checkout);
    },
    async setCheckoutShippingOption(input) {
      const checkout = getCheckout(input.checkoutId);
      if (!checkout.shippingAddress) {
        throw new Error("Shipping address is required before selecting a shipping method.");
      }

      const selectedOption = resolveShippingOption(input.shippingOptionId);
      checkout.shippingOption = selectedOption;

      const totals = computeTotals(checkout.subtotal, selectedOption.price);
      checkout.shippingTotal = cloneMoney(selectedOption.price);
      checkout.taxTotal = totals.tax;
      checkout.total = totals.total;
      checkout.stage = "shipping";
      checkout.message = "Simulated shipping selected. Continue with demo payment.";
      checkouts.set(checkout.checkoutId, checkout);
      return cloneCheckout(checkout);
    },
    async setCheckoutPayment(input) {
      const checkout = getCheckout(input.checkoutId);
      if (!checkout.shippingOption) {
        throw new Error("Select a shipping method before adding payment.");
      }

      checkout.payment = validatePaymentInput(input.payment);
      checkout.stage = "payment";
      checkout.canPlaceOrder = true;
      checkout.message = "Demo payment validated locally. No charge has been made.";
      checkouts.set(checkout.checkoutId, checkout);
      return cloneCheckout(checkout);
    },
    async getCheckout(checkoutId) {
      return cloneCheckout(getCheckout(checkoutId));
    },
    async placeOrder(input) {
      const checkout = getCheckout(input.checkoutId);
      const cart = getOrCreateCart(checkout.cartId);

      if (cart.lines.length === 0) {
        throw new Error("Cannot place order with empty cart.");
      }

      if (!checkout.shippingAddress || !checkout.shippingOption || !checkout.payment || !checkout.canPlaceOrder) {
        throw new Error("Checkout is incomplete. Address, shipping, and payment are required.");
      }

      for (const line of cart.lines) {
        assertSellableQuantity(line.productId, line.quantity);
      }

      for (const line of cart.lines) {
        const inventory = inventoryByProductId.get(line.productId);
        if (!inventory) {
          throw new Error(`Inventory record missing for product: ${line.productId}`);
        }
        inventory.quantity = Math.max(0, inventory.quantity - line.quantity);
        inventoryByProductId.set(line.productId, inventory);
      }

      recalculateCart(cart);
      const totals = computeTotals(cart.subtotal, checkout.shippingOption.price);

      const sequence = orderCounter++;
      const orderId = `ord-${sequence}`;
      const orderNumber = `JNO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(sequence).padStart(4, "0")}`;

      const order: OrderSnapshot = {
        orderId,
        orderNumber,
        createdAtIso: new Date().toISOString(),
        cartId: cart.cartId,
        email: checkout.email,
        shippingAddress: { ...checkout.shippingAddress },
        shippingOption: cloneShippingOption(checkout.shippingOption),
        payment: { ...checkout.payment },
        lines: cart.lines.map((line) => cloneCartLine(line)),
        subtotal: cloneMoney(cart.subtotal),
        shippingTotal: cloneMoney(checkout.shippingOption.price),
        taxTotal: totals.tax,
        total: totals.total,
        status: "confirmed",
      };

      orders.set(orderId, order);

      cart.lines = [];
      recalculateCart(cart);
      carts.set(cart.cartId, cart);
      persistCart(cart);

      checkout.stage = "placed";
      checkout.canPlaceOrder = false;
      checkout.message = `Demo order ${order.orderNumber} generated. No payment or shipment.`;
      checkouts.set(checkout.checkoutId, checkout);

      return cloneOrder(order);
    },
    async getOrder(orderId) {
      return getOrder(orderId);
    },
  };
};
