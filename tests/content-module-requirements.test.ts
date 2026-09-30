import { describe, expect, it } from "vitest";
import type { ProductDetail } from "../commerce/provider-interface/commerce-provider";
import { validateProductModulesByLifecycle } from "../features/product/content-module-requirements";

const baseProduct = (status: ProductDetail["status"]): ProductDetail => ({
  id: "analog-earth-movement",
  slug: "earth-movement",
  name: "Earth Movement",
  collection: "analog-time",
  status,
  availability: { status: "in-stock", sellable: true },
  inventory: { quantity: 10, backorderable: false },
  currentPrice: { currency: "USD", amount: 410 },
  description: "Test product",
  platform: { family: "shared-quartz-platform-v1" },
  storyModules: [
    {
      id: "story-philosophy",
      type: "philosophy",
      title: "Philosophy",
      body: "Body",
    },
  ],
  media: [],
  tags: ["test"],
  available: true,
});

describe("validateProductModulesByLifecycle", () => {
  it("passes concept products when philosophy module exists", () => {
    const result = validateProductModulesByLifecycle(baseProduct("concept"));
    expect(result.ok).toBe(true);
    expect(result.missingStoryTypes).toHaveLength(0);
  });

  it("fails launch-ready products when engineering module is missing", () => {
    const result = validateProductModulesByLifecycle(baseProduct("launch-ready"));
    expect(result.ok).toBe(false);
    expect(result.missingStoryTypes).toEqual(["engineering"]);
    expect(result.hasNarrativeContext).toBe(true);
  });
});
