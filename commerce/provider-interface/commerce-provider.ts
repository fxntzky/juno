export type CollectionId = "analog-time" | "digital-time";
export type CurrencyCode = "USD";
export type ProductLifecycleStatus = "concept" | "prototype" | "launch-ready";
export type AvailabilityStatus = "concept" | "preorder" | "in-stock" | "out-of-stock";
export type CheckoutStage = "started" | "address" | "shipping" | "payment" | "review" | "placed";
export type CheckoutMode = "demo" | "production";
export type StoryModuleType =
  | "philosophy"
  | "geology"
  | "materials"
  | "places"
  | "civilization"
  | "planetary-time"
  | "engineering";

export type Money = { currency: CurrencyCode; amount: number };
export type MediaAsset = { type: "image" | "video"; url: string; alt?: string };

export type StoryModule = {
  id: string;
  type: StoryModuleType;
  title: string;
  body: string;
};

export type Availability = {
  status: AvailabilityStatus;
  sellable: boolean;
};

export type Inventory = {
  quantity: number;
  backorderable: boolean;
};

export type PriceIntent = {
  currency: CurrencyCode;
  min: number;
  max: number;
  displayMode: "positioning-only" | "range" | "fixed";
};

export type CollectionRecord = {
  id: CollectionId;
  name: "Analog Time" | "Digital Time";
  description: string;
  productCountTarget: number;
  order: number;
};

export type CatalogProductRecord = {
  id: string;
  slug: string;
  name: string;
  collectionId: CollectionId;
  status: ProductLifecycleStatus;
  description: string;
  platform: { family: string };
  priceIntent?: PriceIntent;
  availability: Availability;
  inventory?: Inventory;
  storyModules: StoryModule[];
  media: MediaAsset[];
  tags: string[];
};

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  collection: CollectionId;
  status: ProductLifecycleStatus;
  availability: Availability;
  inventory: Inventory;
  currentPrice: Money;
  priceRange?: { min: Money; max: Money };
  thumbnailUrl?: string;
};

export type ProductDetail = ProductSummary & {
  description: string;
  platform: { family: string };
  storyModules: StoryModule[];
  media: MediaAsset[];
  tags: string[];
  available: boolean;
};

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  thumbnailUrl?: string;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
};

export type CartSnapshot = {
  cartId: string;
  lines: CartLine[];
  itemCount: number;
  subtotal: Money;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type ShippingOption = {
  id: string;
  label: string;
  etaDays: number;
  price: Money;
};

export type CheckoutPaymentInput = {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
};

export type CheckoutPaymentSummary = {
  brand: "visa" | "mastercard" | "unknown";
  last4: string;
};

export type CheckoutSnapshot = {
  checkoutId: string;
  cartId: string;
  mode: CheckoutMode;
  stage: CheckoutStage;
  email: string;
  shippingAddress?: ShippingAddress;
  shippingOption?: ShippingOption;
  payment?: CheckoutPaymentSummary;
  subtotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  total: Money;
  canPlaceOrder: boolean;
  message: string;
};

export type OrderSnapshot = {
  orderId: string;
  orderNumber: string;
  createdAtIso: string;
  cartId: string;
  email: string;
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  payment: CheckoutPaymentSummary;
  lines: CartLine[];
  subtotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  total: Money;
  status: "confirmed";
};

export interface CommerceProvider {
  listCollections(): Promise<CollectionRecord[]>;
  listProducts(collectionId: CollectionId): Promise<ProductSummary[]>;
  getProductBySlug(slug: string): Promise<ProductDetail | null>;

  getCart(cartId?: string): Promise<CartSnapshot>;
  addToCart(input: { cartId?: string; productId: string; quantity: number }): Promise<CartSnapshot>;
  updateCartLine(input: { cartId: string; lineId: string; quantity: number }): Promise<CartSnapshot>;
  removeCartLine(input: { cartId: string; lineId: string }): Promise<CartSnapshot>;
  clearCart(input: { cartId: string }): Promise<CartSnapshot>;

  listShippingOptions(input?: { country?: string }): Promise<ShippingOption[]>;
  beginCheckout(input: { cartId: string; email: string }): Promise<CheckoutSnapshot>;
  setCheckoutAddress(input: { checkoutId: string; address: ShippingAddress }): Promise<CheckoutSnapshot>;
  setCheckoutShippingOption(input: { checkoutId: string; shippingOptionId: string }): Promise<CheckoutSnapshot>;
  setCheckoutPayment(input: { checkoutId: string; payment: CheckoutPaymentInput }): Promise<CheckoutSnapshot>;
  getCheckout(checkoutId: string): Promise<CheckoutSnapshot>;
  placeOrder(input: { checkoutId: string }): Promise<OrderSnapshot>;

  getOrder(orderId: string): Promise<OrderSnapshot | null>;
}
