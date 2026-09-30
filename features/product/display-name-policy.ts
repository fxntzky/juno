const ANALOG_PLACEHOLDER_RE = /^analog-concept-\d{2}$/;
const DIGITAL_PLACEHOLDER_RE = /^digital-concept-\d{2}$/;
const PLACEHOLDER_NAME_RE = /concept\s+\d{2}$/i;

export type DisplayAudience = "customer-public" | "internal";

const isPlaceholderSlug = (slug: string): boolean => ANALOG_PLACEHOLDER_RE.test(slug) || DIGITAL_PLACEHOLDER_RE.test(slug);

export const resolveProductDisplayName = (input: {
  slug: string;
  name: string;
  collection: "analog-time" | "digital-time";
  audience: DisplayAudience;
}): string => {
  if (input.audience === "internal") {
    return input.name;
  }

  if (!isPlaceholderSlug(input.slug)) {
    return input.name;
  }

  if (!PLACEHOLDER_NAME_RE.test(input.name)) {
    return input.name;
  }

  return input.collection === "analog-time" ? "Analog Concept in Development" : "Digital Concept in Development";
};
