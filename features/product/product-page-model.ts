import type { CheckoutMode, ProductDetail } from "../../commerce/provider-interface/commerce-provider";
import { resolveProductDisplayName, type DisplayAudience } from "./display-name-policy";
import { validateProductModulesByLifecycle } from "./content-module-requirements";

export type ProductPageBlockType =
  | "hero"
  | "concept-summary"
  | "story-modules"
  | "design-and-materials"
  | "technical-clarity"
  | "availability-and-pricing-context"
  | "cta-panel"
  | "collection-context";

export type ProductPageBlock = {
  type: ProductPageBlockType;
  required: boolean;
};

export type ProductPageModel = {
  slug: string;
  displayName: string;
  collection: "analog-time" | "digital-time";
  status: ProductDetail["status"];
  blocks: ProductPageBlock[];
  moduleValidation: ReturnType<typeof validateProductModulesByLifecycle>;
  ctaMode: CheckoutMode;
};

const baseBlocks: ProductPageBlock[] = [
  { type: "hero", required: true },
  { type: "concept-summary", required: true },
  { type: "story-modules", required: true },
  { type: "design-and-materials", required: false },
  { type: "technical-clarity", required: true },
  { type: "availability-and-pricing-context", required: true },
  { type: "cta-panel", required: true },
  { type: "collection-context", required: false },
];

export const buildProductPageModel = (input: {
  product: ProductDetail;
  audience: DisplayAudience;
  commerceMode: CheckoutMode;
}): ProductPageModel => ({
  slug: input.product.slug,
  displayName: resolveProductDisplayName({
    slug: input.product.slug,
    name: input.product.name,
    collection: input.product.collection,
    audience: input.audience,
  }),
  collection: input.product.collection,
  status: input.product.status,
  blocks: baseBlocks,
  moduleValidation: validateProductModulesByLifecycle(input.product),
  ctaMode: input.commerceMode,
});
