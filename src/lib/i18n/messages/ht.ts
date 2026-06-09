import type { Messages } from "../types";
import { questionnaireHt } from "./questionnaire-ht";

export const ht: Messages = {
  lang: { translate: "Tradui" },
  nav: { home: "Akèy", assessment: "Evalyasyon" },
  footer: {
    rights: "Tout dwa rezève pou",
    tagline: "Detoks Medikal AcuActiv · Miami, FL ·",
  },
  home: {
    badge: "Pwogram Detoks Medikal",
    title: "Dekouvri Chaj Toksik Kò Ou",
    subtitle:
      "Nòt sentòm pwofesyonèl, grafik vizyèl, ak yon plan nitrisyon pèsonalize — gide pa Dr. Shlomi Gavish DOM, AP.",
    features: [
      {
        title: "Evalyasyon ak Emoji",
        description:
          "Evalye chak sentòm ak figi entuitif 😊→😢 — 63 kesyon nan 8 sistèm kò.",
      },
      {
        title: "Grafik ak Nòt Toksik",
        description:
          "Grafik radar, sèk ak ba ansanm ak pousantaj chaj toksik pèsonalize ou.",
      },
      {
        title: "Plan Detoks ak Dyèt",
        description:
          "Lis manje pou manje/evite, konsèy idratasyon, ak manje vize sistèm ki pi chaje yo.",
      },
    ],
    systemsTitle: "8 Sistèm Kò Evalye",
    systemsSubtitle: "Evalyasyon konplè sou tout chemen detoks prensipal yo.",
    questions: "Kes.",
    cta: "Ann Kòmanse",
  },
  hero: {
    title: "Defi Detoks",
    startTest: "Kòmanse Tès la",
    viewResults: "Gade rezilta anvan yo →",
    meta: "~15 min · 63 kesyon · 😊 rive 😢",
    metaExtra: " · Grafik ak rekòmandasyon dyèt",
  },
  video: {
    badge: "Idratasyon ak netwayaj",
    title: "Ale avèk detoks natirèl kò ou",
    description:
      "Tankou dlo ki netwaye chak selil, pwogram AcuActiv ede elimine toksin, retabli balans, epi gide ou ak swivi emoji, grafik an dirèk, ak yon dyèt baze sou rezilta ou.",
    cta: "Kòmanse defi a",
  },
  challenge: {
    step1: "Etap 1 nan 2",
    personalTitle: "Enfòmasyon Pèsonèl",
    personalSubtitle:
      "Di nou sou ou anvan ou kòmanse evalyasyon detoks la.",
    questionnaireTitle: "Kesyonè Defi Detoks",
    questionnaireSubtitle:
      "Chwazi figi ki matche ak konbyen fwa ou santi sentòm nan 😊→😢",
    overallProgress: "Pwogrè jeneral",
    back: "Retounen",
    next: "Suivan",
    reviewAnswers: "Revize repons yo",
    reviewTitle: "Ou pare pou soumèt?",
    reviewProgress: "Ou reponn {answered} nan {total} kesyon.",
    answerMissed: "Reponn kesyon ou rate",
    answerMissedPlural: "Reponn kesyon ou rate yo ({count})",
    reviewWarning:
      "Gen kesyon ou pa reponn. Retounen pou konplete yo pou pi bon rezilta.",
    goToFirstMissed: "Ale nan premye kesyon ou rate",
    backToQuestions: "Retounen nan kesyon yo",
    submit: "Soumèt epi wè rezilta yo",
    submitting: "Ap soumèt…",
    categoryTest: "Tès",
    startingSection: "Ap kòmanse pwochen seksyon an",
    questionsInSection: "kesyon nan seksyon sa a",
    tapHowYouFeel: "Peze kijan ou santi ou",
    best: "😊 Pi bon",
    severity: "gravite sentòm →",
    worst: "😢 Pi grav",
  },
  form: {
    firstName: "Non",
    lastName: "Siyati",
    email: "Imèl",
    phone: "Telefòn",
    dateOfBirth: "Dat nesans",
    testDate: "Dat tès la",
    measurementSystem: "Sistèm mezi",
    imperial: "Etazini (Imperyal)",
    metric: "Metrik",
    feet: "Pyè",
    inches: "Pous",
    pounds: "Liv",
    heightCm: "Wotè (cm)",
    weightKg: "Pwa (kg)",
    continue: "Kontinye nan evalyasyon an",
    errors: {
      firstName: "Non obligatwa",
      lastName: "Siyati obligatwa",
      email: "Imèl valab obligatwa",
      phone: "Nimewo telefòn obligatwa",
      dateOfBirth: "Dat nesans obligatwa",
      testDate: "Dat tès la obligatwa",
    },
  },
  frequency: [
    {
      label: "Janm oswa prèske janm m pa gen sentòm nan",
      shortLabel: "Janm",
    },
    {
      label: "Pafwa m gen li",
      shortLabel: "Pafwa",
    },
    {
      label: "Pafwa m gen li, efè a grav",
      shortLabel: "Pafwa (grav)",
    },
    {
      label: "Souvan m gen li, efè a pa grav",
      shortLabel: "Souvan",
    },
    {
      label: "Souvan m gen li, efè a grav",
      shortLabel: "Souvan (grav)",
    },
  ],
  results: {
    noResults: "Pa gen rezilta",
    noResultsHint:
      "Konplete defi detoks la pou debloke grafik ak plan dyèt ou.",
    startAssessment: "Kòmanse evalyasyon an",
    reportTitle: "Rapò Evalyasyon Detoks",
    complete: "Evalyasyon fini",
    yourResults: "Rezilta Detoks Ou",
    grandTotal: "Total Jeneral",
    toxicBurden: "Chaj Toksik",
    low: "😊 Ba",
    high: "😢 Wo",
    systemBreakdown: "Detay pa Sistèm",
    visualAnalytics: "📊 Analiz Vizyèl",
    dietTitle: "🥗 Dyèt Detoks ou ak Rekòmandasyon",
    disclaimerTitle: "Avi medikal",
    disclaimer:
      "Sijesyon dyèt yo se pou edikasyon epi yo pa ranplase swen Dr. Shlomi Gavish DOM, AP. Pwodwi detoks mande yon konsiltasyon pasyan.",
    home: "Akèy",
    savePdf: "Sove / Enprime PDF",
    retake: "Refè tès la",
  },
  toxicLevels: {
    low: "Chaj toksik ba",
    mild: "Chaj toksik leje",
    moderate: "Chaj toksik modere",
    elevated: "Chaj toksik wo",
    high: "Chaj toksik wo anpil — konsiltasyon rekòmande",
  },
  categories: {
    emotions: "Emosyon",
    skin: "Po",
    ent: "Zòrèy, Nen ak Gòj",
    brain: "Lespri ak Sèvo",
    digestive: "Digestif",
    kidney: "Ren",
    joints: "Atikilasyon",
    metabolism: "Metabolism",
  },
  banners: {
    skin: "Klète po, gratèl ak siy dermatolojik",
    ent: "Sentòm zòrèy, nen, gòj ak respiratwa",
    joints: "Atikilasyon, misk ak doulè mobilite",
    kidney: "Sante irinè ak sentòm ki gen rapò ak ren",
    brain: "Konsantrasyon, memwa, dòmi ak klète mantal",
    digestive: "Sante intesten, digestyon ak tolerans manje",
    emotions: "Imè, anksyete ak byennèt emosyonèl",
    metabolism: "Enèji, pwa, anvi manje ak balans metabolik",
    default: "Reponn chak sentòm ak onètete",
  },
  questionnaire: questionnaireHt,
};
