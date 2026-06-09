export interface CategoryBannerConfig {
  subtitle: string;
  /** Local path under /public */
  image: string;
  gradient: string;
}

/** Image sequence: 1 Skin, 2 ENT, 3 Joints, 4 Kidney, 5 Brain, 6 Digestive, 7 Emotions, 8 Metabolism */
export const CATEGORY_BANNERS: Record<string, CategoryBannerConfig> = {
  skin: {
    subtitle: "Skin clarity, rashes, and dermatologic signs",
    image: "/category-banners/skin.png",
    gradient: "from-sky-900/40 via-teal-900/20 to-transparent",
  },
  ent: {
    subtitle: "Ear, nose, throat, and respiratory symptoms",
    image: "/category-banners/ent.png",
    gradient: "from-sky-900/40 via-teal-900/20 to-transparent",
  },
  joints: {
    subtitle: "Joints, muscles, and mobility discomfort",
    image: "/category-banners/joints.png",
    gradient: "from-sky-900/40 via-teal-900/20 to-transparent",
  },
  kidney: {
    subtitle: "Urinary health and kidney-related symptoms",
    image: "/category-banners/kidney.png",
    gradient: "from-sky-900/40 via-teal-900/20 to-transparent",
  },
  brain: {
    subtitle: "Focus, memory, sleep, and mental clarity",
    image: "/category-banners/brain.png",
    gradient: "from-sky-900/40 via-teal-900/20 to-transparent",
  },
  digestive: {
    subtitle: "Gut health, digestion, and food tolerance",
    image: "/category-banners/digestive.png",
    gradient: "from-sky-900/40 via-teal-900/20 to-transparent",
  },
  emotions: {
    subtitle: "Mood, anxiety, and emotional wellness",
    image: "/category-banners/emotions.png",
    gradient: "from-sky-900/40 via-violet-900/20 to-transparent",
  },
  metabolism: {
    subtitle: "Energy, weight, cravings, and metabolic balance",
    image: "/category-banners/metabolism.png",
    gradient: "from-sky-900/40 via-teal-900/20 to-transparent",
  },
};

export function getCategoryBanner(categoryId: string): CategoryBannerConfig {
  return (
    CATEGORY_BANNERS[categoryId] ?? {
      subtitle: "Answer each symptom honestly",
      image: "/banner.png",
      gradient: "from-sky-900/40 to-transparent",
    }
  );
}
