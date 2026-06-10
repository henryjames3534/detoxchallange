"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ClipboardList, User } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { PersonalInfoForm } from "@/components/PersonalInfoForm";
import { QuestionCard } from "@/components/QuestionCard";
import { CategoryPills } from "@/components/CategoryPills";
import { CategoryTestStartBanner } from "@/components/CategoryTestStartBanner";
import { TOTAL_QUESTIONS, getFirstUnansweredQuestionIndex, getMissedQuestionCount } from "@/lib/questionnaire";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { computeResults } from "@/lib/scoring";
import { nowIsoUtc } from "@/lib/timezone";
import { saveAnswers, saveResults } from "@/lib/storage";
import type {
  ChallengeAnswers,
  PersonalInfo,
  SymptomFrequency,
} from "@/lib/types";

type Step = "personal" | "questionnaire" | "review";

export function ChallengeClient() {
  const router = useRouter();
  const { t, categories, getCategoryTestLabel } = useLanguage();
  const [step, setStep] = useState<Step>("personal");
  const [personal, setPersonal] = useState<PersonalInfo | null>(null);
  const [scores, setScores] = useState<
    Record<string, Record<string, SymptomFrequency>>
  >({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seenCategoryIntros, setSeenCategoryIntros] = useState<Set<string>>(
    () => new Set(),
  );
  const [activeIntroCategoryId, setActiveIntroCategoryId] = useState<
    string | null
  >(null);

  const currentCategory = categories[categoryIndex];
  const currentQuestion = currentCategory?.questions[questionIndex];

  const handleCategoryIntroComplete = useCallback((categoryId: string) => {
    setSeenCategoryIntros((prev) => {
      if (prev.has(categoryId)) {
        return prev;
      }
      return new Set(prev).add(categoryId);
    });
    setActiveIntroCategoryId(null);
  }, []);

  useEffect(() => {
    if (step !== "questionnaire" || questionIndex !== 0 || !currentCategory) {
      return;
    }

    if (seenCategoryIntros.has(currentCategory.id)) {
      return;
    }

    if (activeIntroCategoryId === currentCategory.id) {
      return;
    }

    setActiveIntroCategoryId(currentCategory.id);
  }, [
    step,
    categoryIndex,
    questionIndex,
    currentCategory?.id,
    seenCategoryIntros,
    activeIntroCategoryId,
  ]);

  const showingCategoryIntro =
    step === "questionnaire" &&
    activeIntroCategoryId !== null &&
    currentCategory?.id === activeIntroCategoryId;

  const answeredCount = useMemo(() => {
    let count = 0;
    for (const cat of categories) {
      const catScores = scores[cat.id] ?? {};
      count += Object.keys(catScores).length;
    }
    return count;
  }, [scores, categories]);

  const globalQuestionIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < categoryIndex; i++) {
      idx += categories[i].questions.length;
    }
    return idx + questionIndex + 1;
  }, [categoryIndex, questionIndex]);

  const currentValue = currentQuestion
    ? scores[currentCategory.id]?.[currentQuestion.id]
    : undefined;

  const setAnswer = useCallback(
    (value: SymptomFrequency) => {
      if (!currentCategory || !currentQuestion) return;
      setScores((prev) => ({
        ...prev,
        [currentCategory.id]: {
          ...prev[currentCategory.id],
          [currentQuestion.id]: value,
        },
      }));
    },
    [currentCategory, currentQuestion],
  );

  const goNext = () => {
    if (!currentCategory) return;
    if (questionIndex < currentCategory.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else if (categoryIndex < categories.length - 1) {
      setCategoryIndex((i) => i + 1);
      setQuestionIndex(0);
    } else {
      setStep("review");
    }
  };

  const goPrev = () => {
    if (step === "review") {
      setStep("questionnaire");
      setCategoryIndex(categories.length - 1);
      setQuestionIndex(categories[categories.length - 1].questions.length - 1);
      return;
    }
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (categoryIndex > 0) {
      const prevCat = categories[categoryIndex - 1];
      setCategoryIndex((i) => i - 1);
      setQuestionIndex(prevCat.questions.length - 1);
    } else {
      setStep("personal");
    }
  };

  const handlePersonalSubmit = (data: PersonalInfo) => {
    setPersonal(data);
    setStep("questionnaire");
  };

  const [submitting, setSubmitting] = useState(false);
  const submitLockRef = useRef<{
    id: string;
    completedAt: string;
    busy: boolean;
  }>({ id: "", completedAt: "", busy: false });

  const handleSubmit = async () => {
    if (!personal || submitting || submitLockRef.current.busy) return;

    submitLockRef.current.busy = true;
    setSubmitting(true);

    if (!submitLockRef.current.id) {
      submitLockRef.current.id = crypto.randomUUID();
      submitLockRef.current.completedAt = nowIsoUtc();
    }

    const answers: ChallengeAnswers = { personal, scores };
    const results = computeResults(answers);
    results.completedAt = submitLockRef.current.completedAt;
    results.submissionId = submitLockRef.current.id;

    saveAnswers(answers);
    saveResults(results);

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(results),
      });
    } catch {
      // Results still saved locally
    }

    router.push("/results");
  };

  const canProceed =
    step === "questionnaire" &&
    currentValue !== undefined &&
    !showingCategoryIntro;

  const allAnswered = answeredCount === TOTAL_QUESTIONS;

  const firstMissedLocation = useMemo(() => {
    for (let i = 0; i < categories.length; i++) {
      const questionIndex = getFirstUnansweredQuestionIndex(categories[i], scores);
      if (questionIndex !== null) {
        return { categoryIndex: i, questionIndex };
      }
    }
    return null;
  }, [scores, categories]);

  const goToMissedQuestion = useCallback(
    (targetCategoryIndex: number, targetQuestionIndex: number) => {
      setStep("questionnaire");
      setCategoryIndex(targetCategoryIndex);
      setQuestionIndex(targetQuestionIndex);
    },
    [],
  );

  const introCategory =
    activeIntroCategoryId != null
      ? categories.find((c) => c.id === activeIntroCategoryId)
      : undefined;

  return (
    <PageShell>
      {introCategory && (
        <CategoryTestStartBanner
          category={introCategory}
          open={showingCategoryIntro}
          onComplete={handleCategoryIntroComplete}
        />
      )}
      <AnimatePresence mode="sync">
          {step === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex w-full flex-col gap-8"
            >
              <div className="w-full text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-5 py-2 text-sm font-medium text-teal-800">
                  <User className="h-4 w-4" />
                  {t.challenge.step1}
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#1e3a5f] sm:text-3xl">
                  {t.challenge.personalTitle}
                </h1>
                <p className="mt-3 text-base leading-relaxed text-sky-700">
                  {t.challenge.personalSubtitle}
                </p>
              </div>
              <GlassCard className="w-full">
                <PersonalInfoForm
                  defaultValues={personal ?? undefined}
                  onSubmit={handlePersonalSubmit}
                />
              </GlassCard>
            </motion.div>
          )}

          {step === "questionnaire" && currentCategory && currentQuestion && (
            <motion.div
              key={`cat-${categoryIndex}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="flex w-full flex-col gap-8"
            >
              <div className="w-full">
                <span className="mb-4 inline-flex items-center gap-2.5 rounded-full border-2 border-cyan-200 bg-cyan-50 px-6 py-2.5 text-base font-semibold text-cyan-900 sm:gap-3 sm:px-7 sm:py-3 sm:text-lg md:text-xl">
                  <ClipboardList className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                  {getCategoryTestLabel(currentCategory.id)}
                </span>
                <h1 className="text-lg font-bold text-[#1e3a5f] sm:text-xl md:text-2xl">
                  {t.challenge.questionnaireTitle}
                </h1>
                <p className="mt-3 text-base text-sky-700">
                  {t.challenge.questionnaireSubtitle}
                </p>
              </div>

              <div className="space-y-5">
                <ProgressBar
                  current={globalQuestionIndex}
                  total={TOTAL_QUESTIONS}
                  label={t.challenge.overallProgress}
                />
                <CategoryPills
                  categories={categories}
                  activeIndex={categoryIndex}
                />
              </div>

              <QuestionCard
                key={currentQuestion.id}
                questionNumber={questionIndex + 1}
                totalInCategory={currentCategory.questions.length}
                text={currentQuestion.text}
                value={currentValue}
                onChange={(v) => {
                  setAnswer(v);
                }}
              />

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:gap-5">
                <Button variant="secondary" onClick={goPrev} className="sm:min-w-[140px]">
                  <ChevronLeft className="h-4 w-4" />
                  {t.challenge.back}
                </Button>
                <Button
                  className="flex-1"
                  onClick={goNext}
                  disabled={!canProceed}
                >
                  {categoryIndex === categories.length - 1 &&
                  questionIndex === currentCategory.questions.length - 1
                    ? t.challenge.reviewAnswers
                    : t.challenge.next}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full flex-col gap-8"
            >
              <div className="w-full text-center">
                <h1 className="text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
                  {t.challenge.reviewTitle}
                </h1>
                <p className="mt-3 text-base text-sky-700">
                  {t.challenge.reviewProgress
                    .replace("{answered}", String(answeredCount))
                    .replace("{total}", String(TOTAL_QUESTIONS))}
                </p>
              </div>
              <GlassCard>
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {categories.map((cat, catIndex) => {
                    const catScores = scores[cat.id] ?? {};
                    const count = Object.keys(catScores).length;
                    const missedCount = getMissedQuestionCount(cat, scores);
                    const complete = missedCount === 0;
                    const firstMissed = getFirstUnansweredQuestionIndex(cat, scores);

                    return (
                      <div
                        key={cat.id}
                        className={`rounded-xl px-5 py-4 ${
                          complete
                            ? "bg-emerald-50 text-emerald-900"
                            : "border border-amber-200 bg-amber-50 text-amber-900"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium sm:text-base">
                            {getCategoryTestLabel(cat.id)}
                          </span>
                          <span className="shrink-0 text-sm font-semibold">
                            {count}/{cat.questions.length}
                          </span>
                        </div>
                        {!complete && firstMissed !== null && (
                          <Button
                            size="sm"
                            variant="secondary"
                            fullWidth
                            className="mt-3 border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
                            onClick={() =>
                              goToMissedQuestion(catIndex, firstMissed)
                            }
                          >
                            {missedCount > 1
                              ? t.challenge.answerMissedPlural.replace(
                                  "{count}",
                                  String(missedCount),
                                )
                              : t.challenge.answerMissed}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {!allAnswered && (
                  <div className="mb-6 space-y-4">
                    <p className="text-center text-sm leading-relaxed text-amber-700">
                      {t.challenge.reviewWarning}
                    </p>
                    {firstMissedLocation && (
                      <div className="flex justify-center">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            goToMissedQuestion(
                              firstMissedLocation.categoryIndex,
                              firstMissedLocation.questionIndex,
                            )
                          }
                        >
                          {t.challenge.goToFirstMissed}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                  <Button variant="secondary" onClick={goPrev} className="sm:min-w-[180px]">
                    <ChevronLeft className="h-4 w-4" />
                    {t.challenge.backToQuestions}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={!allAnswered || submitting}
                  >
                    {submitting ? t.challenge.submitting : t.challenge.submit}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
      </AnimatePresence>
    </PageShell>
  );
}
