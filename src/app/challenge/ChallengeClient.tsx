"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
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
import { CATEGORIES, TOTAL_QUESTIONS, getCategoryTestLabel, getFirstUnansweredQuestionIndex, getMissedQuestionCount } from "@/lib/questionnaire";
import { computeResults } from "@/lib/scoring";
import { saveAnswers, saveResults } from "@/lib/storage";
import type {
  ChallengeAnswers,
  PersonalInfo,
  SymptomFrequency,
} from "@/lib/types";

type Step = "personal" | "questionnaire" | "review";

export function ChallengeClient() {
  const router = useRouter();
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

  const currentCategory = CATEGORIES[categoryIndex];
  const currentQuestion = currentCategory?.questions[questionIndex];

  const handleCategoryIntroComplete = useCallback(() => {
    setSeenCategoryIntros((prev) => {
      if (!activeIntroCategoryId || prev.has(activeIntroCategoryId)) {
        return prev;
      }
      return new Set(prev).add(activeIntroCategoryId);
    });
    setActiveIntroCategoryId(null);
  }, [activeIntroCategoryId]);

  useEffect(() => {
    if (step !== "questionnaire" || questionIndex !== 0 || !currentCategory) {
      return;
    }

    if (seenCategoryIntros.has(currentCategory.id)) {
      return;
    }

    setActiveIntroCategoryId(currentCategory.id);
  }, [step, categoryIndex, questionIndex, currentCategory?.id, seenCategoryIntros]);

  const showingCategoryIntro =
    step === "questionnaire" &&
    activeIntroCategoryId !== null &&
    currentCategory?.id === activeIntroCategoryId;

  const answeredCount = useMemo(() => {
    let count = 0;
    for (const cat of CATEGORIES) {
      const catScores = scores[cat.id] ?? {};
      count += Object.keys(catScores).length;
    }
    return count;
  }, [scores]);

  const globalQuestionIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < categoryIndex; i++) {
      idx += CATEGORIES[i].questions.length;
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
    } else if (categoryIndex < CATEGORIES.length - 1) {
      setCategoryIndex((i) => i + 1);
      setQuestionIndex(0);
    } else {
      setStep("review");
    }
  };

  const goPrev = () => {
    if (step === "review") {
      setStep("questionnaire");
      setCategoryIndex(CATEGORIES.length - 1);
      setQuestionIndex(CATEGORIES[CATEGORIES.length - 1].questions.length - 1);
      return;
    }
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (categoryIndex > 0) {
      const prevCat = CATEGORIES[categoryIndex - 1];
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

  const handleSubmit = async () => {
    if (!personal) return;
    const answers: ChallengeAnswers = { personal, scores };
    const results = computeResults(answers);
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
    for (let i = 0; i < CATEGORIES.length; i++) {
      const questionIndex = getFirstUnansweredQuestionIndex(CATEGORIES[i], scores);
      if (questionIndex !== null) {
        return { categoryIndex: i, questionIndex };
      }
    }
    return null;
  }, [scores]);

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
      ? CATEGORIES.find((c) => c.id === activeIntroCategoryId)
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
      <AnimatePresence mode="wait">
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
                  Step 1 of 2
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#1e3a5f] sm:text-3xl">
                  Personal Information
                </h1>
                <p className="mt-3 text-base leading-relaxed text-sky-700">
                  Tell us about yourself before starting the detox assessment.
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
              key={`q-${categoryIndex}-${questionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: showingCategoryIntro ? 0.35 : 1,
                x: 0,
                pointerEvents: showingCategoryIntro ? "none" : "auto",
              }}
              exit={{ opacity: 0, x: -20 }}
              className="flex w-full flex-col gap-8"
              aria-hidden={showingCategoryIntro}
            >
              <div className="w-full">
                <span className="mb-4 inline-flex items-center gap-2.5 rounded-full border-2 border-cyan-200 bg-cyan-50 px-6 py-2.5 text-base font-semibold text-cyan-900 sm:gap-3 sm:px-7 sm:py-3 sm:text-lg md:text-xl">
                  <ClipboardList className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                  {getCategoryTestLabel(currentCategory.name)}
                </span>
                <h1 className="text-lg font-bold text-[#1e3a5f] sm:text-xl md:text-2xl">
                  Detox Challenge Questionnaire
                </h1>
                <p className="mt-3 text-base text-sky-700">
                  Pick the face that matches how often you feel this symptom 😊→😢
                </p>
              </div>

              <div className="space-y-5">
                <ProgressBar
                  current={globalQuestionIndex}
                  total={TOTAL_QUESTIONS}
                  label="Overall progress"
                />
                <CategoryPills
                  categories={CATEGORIES}
                  activeIndex={categoryIndex}
                />
              </div>

              <QuestionCard
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
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={goNext}
                  disabled={!canProceed}
                >
                  {categoryIndex === CATEGORIES.length - 1 &&
                  questionIndex === currentCategory.questions.length - 1
                    ? "Review answers"
                    : "Next"}
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
                  Ready to submit?
                </h1>
                <p className="mt-3 text-base text-sky-700">
                  You&apos;ve answered {answeredCount} of {TOTAL_QUESTIONS}{" "}
                  questions.
                </p>
              </div>
              <GlassCard>
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {CATEGORIES.map((cat, catIndex) => {
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
                            {getCategoryTestLabel(cat.name)}
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
                            Answer missed question
                            {missedCount > 1 ? `s (${missedCount})` : ""}
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
                      Some questions are unanswered. Go back to complete them for
                      the most accurate results.
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
                          Go to first missed question
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                  <Button variant="secondary" onClick={goPrev} className="sm:min-w-[180px]">
                    <ChevronLeft className="h-4 w-4" />
                    Back to questions
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                  >
                    Submit & view results
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
      </AnimatePresence>
    </PageShell>
  );
}
