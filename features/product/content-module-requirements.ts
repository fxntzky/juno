import type { ProductDetail, StoryModuleType } from "../../commerce/provider-interface/commerce-provider";

const requiredStoryTypesByStatus: Record<"concept" | "prototype" | "launch-ready", StoryModuleType[]> = {
  concept: ["philosophy"],
  prototype: ["philosophy", "materials"],
  "launch-ready": ["engineering"],
};

export type ProductModuleValidationResult = {
  ok: boolean;
  missingStoryTypes: StoryModuleType[];
  hasNarrativeContext: boolean;
};

export const validateProductModulesByLifecycle = (product: ProductDetail): ProductModuleValidationResult => {
  const requiredTypes = requiredStoryTypesByStatus[product.status];
  const presentTypes = new Set(product.storyModules.map((module) => module.type));
  const missingStoryTypes = requiredTypes.filter((type) => !presentTypes.has(type));

  const narrativeTypes: StoryModuleType[] = [
    "philosophy",
    "geology",
    "materials",
    "places",
    "civilization",
    "planetary-time",
  ];

  const hasNarrativeContext = narrativeTypes.some((type) => presentTypes.has(type));

  return {
    ok: missingStoryTypes.length === 0 && hasNarrativeContext,
    missingStoryTypes,
    hasNarrativeContext,
  };
};
