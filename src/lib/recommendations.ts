import type { CategoryResult, ChallengeResults } from "./types";

export interface FoodItem {
  name: string;
  benefit: string;
  icon: string;
}

export interface DietPlan {
  title: string;
  summary: string;
  eat: FoodItem[];
  avoid: string[];
  hydration: string[];
  dailyTips: string[];
}

export interface CategoryAdvice {
  categoryId: string;
  name: string;
  percent: number;
  focus: string;
  foods: string[];
}

const CATEGORY_FOODS: Record<string, { focus: string; foods: string[] }> = {
  emotions: {
    focus: "Nervous system & mood balance",
    foods: [
      "Wild salmon & walnuts (omega-3)",
      "Dark leafy greens (magnesium)",
      "Chamomile or passionflower tea",
      "Avocado & pumpkin seeds",
    ],
  },
  skin: {
    focus: "Skin detox & liver support",
    foods: [
      "Beets & carrot juice",
      "Lemon water on waking",
      "Blueberries & turmeric",
      "Cucumber & celery sticks",
    ],
  },
  ent: {
    focus: "Mucus reduction & immunity",
    foods: [
      "Warm ginger-honey tea",
      "Bone broth & garlic",
      "Pineapple (bromelain)",
      "Steamed vegetables, low dairy",
    ],
  },
  brain: {
    focus: "Mental clarity & focus",
    foods: [
      "Blueberries & green tea",
      "Eggs & fatty fish (choline)",
      "Rosemary & rosemary tea",
      "Walnuts & dark chocolate (85%+)",
    ],
  },
  digestive: {
    focus: "Gut repair & microbiome",
    foods: [
      "Sauerkraut & kimchi (probiotics)",
      "Papaya & pineapple enzymes",
      "Gluten-free oats & chia pudding",
      "Steamed zucchini & bone broth",
    ],
  },
  kidney: {
    focus: "Kidney filtration & hydration",
    foods: [
      "Cucumber & parsley water",
      "Cranberry (unsweetened)",
      "Watermelon & celery juice",
      "Low-sodium vegetable soups",
    ],
  },
  joints: {
    focus: "Inflammation & joint comfort",
    foods: [
      "Turmeric golden milk",
      "Cherries & tart cherry juice",
      "Ginger & green tea",
      "Collagen-rich bone broth",
    ],
  },
  metabolism: {
    focus: "Blood sugar & metabolic reset",
    foods: [
      "Cinnamon & apple cider vinegar",
      "Lean protein every meal",
      "Bitter greens (arugula, dandelion)",
      "Intermittent fasting window (12–14h)",
    ],
  },
};

function basePlanByToxicLevel(percent: number): Omit<DietPlan, "dailyTips"> & {
  dailyTips: string[];
} {
  if (percent < 15) {
    return {
      title: "Maintenance Cleanse",
      summary:
        "Your toxic burden is low. Focus on sustaining vitality with a clean, anti-inflammatory plate.",
      eat: [
        { name: "Organic leafy greens", benefit: "Daily chlorophyll & minerals", icon: "🥬" },
        { name: "Filtered water (2–3 L)", benefit: "Cellular hydration", icon: "💧" },
        { name: "Wild fish & legumes", benefit: "Clean protein", icon: "🐟" },
        { name: "Berries & citrus", benefit: "Antioxidant support", icon: "🫐" },
      ],
      avoid: ["Processed snacks", "Excess alcohol", "Refined sugar"],
      hydration: ["Warm lemon water each morning", "Herbal teas: mint, ginger"],
      dailyTips: [
        "Walk 20 minutes after meals",
        "Sleep 7–8 hours for natural detox",
      ],
    };
  }
  if (percent < 35) {
    return {
      title: "Gentle Detox Protocol",
      summary:
        "Mild burden detected. A 2-week whole-food cleanse can restore energy and digestion.",
      eat: [
        { name: "Cruciferous vegetables", benefit: "Liver phase-II support", icon: "🥦" },
        { name: "Lemon & ginger shots", benefit: "Digestive fire", icon: "🍋" },
        { name: "Quinoa & sweet potato", benefit: "Stable energy", icon: "🍠" },
        { name: "Green smoothies", benefit: "Alkaline minerals", icon: "🥤" },
      ],
      avoid: [
        "Fried foods & seed oils",
        "Soda & artificial sweeteners",
        "Late-night heavy meals",
      ],
      hydration: ["1 glass water before each meal", "Dandelion or milk thistle tea"],
      dailyTips: [
        "No food 3 hours before bed",
        "Dry brushing 3× weekly",
      ],
    };
  }
  if (percent < 55) {
    return {
      title: "Active Detox Program",
      summary:
        "Moderate toxic load. Follow a structured 21-day elimination diet under clinical guidance.",
      eat: [
        { name: "Bone broth (daily)", benefit: "Gut lining repair", icon: "🍲" },
        { name: "Steamed veggies & salads", benefit: "Fiber & enzymes", icon: "🥗" },
        { name: "Beets & artichoke", benefit: "Bile flow & liver", icon: "🫘" },
        { name: "Soaked almonds & chia", benefit: "Fiber & healthy fats", icon: "🌰" },
      ],
      avoid: [
        "Gluten, dairy & soy (trial elimination)",
        "Caffeine & alcohol",
        "Red meat & pork (2–3 weeks)",
        "Packaged & canned foods",
      ],
      hydration: [
        "Cucumber-mint infused water",
        "Warm water with apple cider vinegar",
      ],
      dailyTips: [
        "Eat within a 10-hour window",
        "Epsom salt bath 2× weekly",
      ],
    };
  }
  return {
    title: "Intensive Clinical Detox",
    summary:
      "Elevated burden — prioritize Dr. Gavish's medical detox program with supervised diet & supplements.",
    eat: [
      { name: "Clear vegetable broths", benefit: "Easy assimilation", icon: "🥣" },
      { name: "Steamed greens only", benefit: "Minimal digestive load", icon: "🥬" },
      { name: "Fresh herbs: cilantro, parsley", benefit: "Heavy-metal chelation support", icon: "🌿" },
      { name: "Probiotic foods (small amounts)", benefit: "Microbiome reset", icon: "🦠" },
    ],
    avoid: [
      "All sugar, alcohol & caffeine",
      "Grains, legumes & nightshades (initial phase)",
      "Dairy, eggs & processed oils",
      "Eating after 6 PM",
    ],
    hydration: [
      "Room-temperature water only between meals",
      "Medical-grade electrolytes if advised",
    ],
    dailyTips: [
      "Book consultation: acuactiv@gmail.com",
      "Gentle walking & deep breathing only",
      "Track symptoms daily in a journal",
    ],
  };
}

export function getTopCategories(
  categories: CategoryResult[],
  count = 3,
): CategoryResult[] {
  return [...categories].sort((a, b) => b.percent - a.percent).slice(0, count);
}

export function getCategoryAdvice(
  categories: CategoryResult[],
): CategoryAdvice[] {
  return getTopCategories(categories, 3)
    .filter((c) => c.percent >= 20)
    .map((c) => {
      const advice = CATEGORY_FOODS[c.categoryId];
      return {
        categoryId: c.categoryId,
        name: c.name,
        percent: c.percent,
        focus: advice?.focus ?? "General wellness",
        foods: advice?.foods ?? ["Whole foods", "Filtered water"],
      };
    });
}

export function getDietPlan(results: ChallengeResults): DietPlan {
  const base = basePlanByToxicLevel(results.toxicLevelPercent);
  const topAdvice = getCategoryAdvice(results.categories);

  const extraTips = topAdvice.map(
    (a) => `Focus on ${a.name}: ${a.foods[0]}`,
  );

  return {
    ...base,
    dailyTips: [...base.dailyTips, ...extraTips].slice(0, 6),
  };
}

export function getWellnessSummary(results: ChallengeResults): string {
  const { toxicLevelPercent, toxicLevelLabel } = results;
  const top = getTopCategories(results.categories, 1)[0];

  if (toxicLevelPercent < 25) {
    return `Overall you're in a strong zone (${toxicLevelLabel.toLowerCase()}). Keep supporting your body with hydration and colorful plants.`;
  }
  if (top && top.percent >= 50) {
    return `Your ${top.name} system shows the highest strain (${top.percent.toFixed(0)}%). The diet plan below targets this area first.`;
  }
  return `${toxicLevelLabel}. Follow the personalized nutrition protocol below for the next 2–3 weeks, then retake this assessment.`;
}
