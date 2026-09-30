import { describe, expect, it } from "vitest";
import { resolveProductDisplayName } from "../features/product/display-name-policy";

describe("resolveProductDisplayName", () => {
  it("hides placeholder names only when the displayed name is still placeholder-like", () => {
    const result = resolveProductDisplayName({
      slug: "analog-concept-07",
      name: "Analog Concept 07",
      collection: "analog-time",
      audience: "customer-public",
    });

    expect(result).toBe("Analog Concept in Development");
  });

  it("keeps finalized names even when technical slug is placeholder-shaped", () => {
    const result = resolveProductDisplayName({
      slug: "analog-concept-07",
      name: "Meridian",
      collection: "analog-time",
      audience: "customer-public",
    });

    expect(result).toBe("Meridian");
  });

  it("keeps raw names for internal audience", () => {
    const result = resolveProductDisplayName({
      slug: "digital-concept-04",
      name: "Vector",
      collection: "digital-time",
      audience: "internal",
    });

    expect(result).toBe("Vector");
  });
});
