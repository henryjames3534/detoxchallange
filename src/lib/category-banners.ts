export interface CategoryBannerConfig {
  emoji: string;
  subtitle: string;
  /** Local path under /public */
  image: string;
  gradient: string;
}

export const CATEGORY_BANNERS: Record<string, CategoryBannerConfig> = {
  emotions: {
    emoji: "💚",
    subtitle: "Mood, anxiety, and emotional wellness",
    image: "/category-banners/emotions.jpg",
    gradient: "from-violet-600 via-purple-600 to-fuchsia-700",
  },
  skin: {
    emoji: "✨",
    subtitle: "Skin clarity, rashes, and dermatologic signs",
    image: "/category-banners/skin.jpg",
    gradient: "from-rose-500 via-pink-600 to-orange-500",
  },
  ent: {
    emoji: "👂",
    subtitle: "Ear, nose, throat, and respiratory symptoms",
    image: "/category-banners/ent.jpg",
    gradient: "from-sky-500 via-cyan-600 to-teal-600",
  },
  brain: {
    emoji: "🧠",
    subtitle: "Focus, memory, sleep, and mental clarity",
    image: "/category-banners/brain.jpg",
    gradient: "from-indigo-600 via-blue-600 to-violet-700",
  },
  digestive: {
    emoji: "🌿",
    subtitle: "Gut health, digestion, and food tolerance",
    image: "/category-banners/digestive.jpg",
    gradient: "from-emerald-500 via-green-600 to-lime-600",
  },
  kidney: {
    emoji: "💧",
    subtitle: "Urinary health and kidney-related symptoms",
    image: "/category-banners/kidney.jpg",
    gradient: "from-cyan-500 via-teal-600 to-blue-700",
  },
  joints: {
    emoji: "🦴",
    subtitle: "Joints, muscles, and mobility discomfort",
    image: "/category-banners/joints.jpg",
    gradient: "from-amber-500 via-orange-600 to-red-600",
  },
  metabolism: {
    emoji: "⚡",
    subtitle: "Energy, weight, cravings, and metabolic balance",
    image: "/category-banners/metabolism.jpg",
    gradient: "from-yellow-500 via-amber-600 to-orange-700",
  },
};

export function getCategoryBanner(categoryId: string): CategoryBannerConfig {
  return (
    CATEGORY_BANNERS[categoryId] ?? {
      emoji: "📋",
      subtitle: "Answer each symptom honestly",
      image: "/banner.png",
      gradient: "from-cyan-600 to-teal-700",
    }
  );
}
