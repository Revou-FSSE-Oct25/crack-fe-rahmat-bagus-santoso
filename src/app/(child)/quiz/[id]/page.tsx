"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PartyPopper, ThumbsUp, Award } from "lucide-react";
import { childrenApi, submissionsApi } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { useQuizStore } from "@/store/useQuizStore";
import { cn } from "@/lib/utils";
import type { SubmitResponse } from "@/types/types";

type Phase = "loading" | "quiz" | "feedback" | "done" | "error";

export default function QuizPage() {
  const { id: lessonId } = useParams<{ id: string }>();
  const router = useRouter();
  const accessToken = useUserStore((s) => s.accessToken);
  const activeChild = useUserStore((s) => s.activeChild);
  const hasHydrated = useUserStore((s) => s._hasHydrated);

  const quizzes      = useQuizStore((s) => s.quizzes);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const submissions  = useQuizStore((s) => s.submissions);
  const setQuizzes   = useQuizStore((s) => s.setQuizzes);
  const addSubmission = useQuizStore((s) => s.addSubmission);
  const nextQuiz     = useQuizStore((s) => s.nextQuiz);
  const reset        = useQuizStore((s) => s.reset);

  const [phase, setPhase]           = useState<Phase>("loading");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult]         = useState<SubmitResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg]     = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) { router.push("/login"); return; }
    if (!activeChild)  { router.push("/avatar"); return; }

    reset();

    childrenApi
      .getQuizzesForLesson(activeChild.id, lessonId)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.orderNumber - b.orderNumber);
        setQuizzes(sorted);
        setPhase(sorted.length === 0 ? "done" : "quiz");
      })
      .catch(() => { setErrorMsg("Gagal memuat quiz"); setPhase("error"); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, hasHydrated, accessToken, activeChild?.id]);

  const quiz = quizzes[currentIndex];
  const totalPoints = submissions.reduce((s, r) => s + r.earnedPoints, 0);
  const earnedBadge = [...submissions].reverse().find((s) => s.badge)?.badge ?? null;

  const advance = () => {
    setSelectedId(null);
    setResult(null);
    if (currentIndex + 1 >= quizzes.length) {
      setPhase("done");
    } else {
      nextQuiz();
      setPhase("quiz");
    }
  };

  const handleSubmit = async () => {
    if (!selectedId || !activeChild || !quiz || submitting) return;
    setSubmitting(true);
    try {
      const res = await submissionsApi.submit(activeChild.id, lessonId, quiz.id, { selectedOptionId: selectedId });
      addSubmission(res);
      setResult(res);
      setPhase("feedback");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("409") || msg.toLowerCase().includes("conflict") || msg.toLowerCase().includes("already")) {
        advance();
      } else {
        setErrorMsg(msg || "Gagal submit jawaban");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === "loading") return (
    <div className="min-h-screen bg-park-sky flex items-center justify-center">
      <p className="text-slate-600 text-sm">Memuat quiz...</p>
    </div>
  );

  if (phase === "error") return (
    <div className="min-h-screen bg-park-sky flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-park-berry text-sm text-center">{errorMsg}</p>
      <button onClick={() => router.back()} className="text-park-ocean text-sm font-semibold">← Kembali</button>
    </div>
  );

  if (phase === "done") return (
    <div className="min-h-screen bg-park-sky flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8 text-center">
        <div className="mb-3 flex justify-center text-park-ocean">
          {totalPoints > 0 ? <PartyPopper size={48} /> : <ThumbsUp size={48} />}
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">Quiz Selesai!</h2>
        <p className="text-slate-500 text-sm mb-6">{submissions.length} soal dikerjakan</p>

        <div className="bg-park-sky rounded-2xl py-4 px-6 mb-4">
          <p className="text-xs text-slate-500 mb-1">Total poin</p>
          <p className="text-4xl font-bold text-park-ocean">+{totalPoints}</p>
        </div>

        {earnedBadge && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl py-3 px-4 mb-4 flex items-center gap-3">
            <Award size={24} className="text-yellow-700 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-yellow-700">Badge Diperoleh!</p>
              <p className="text-sm font-bold text-yellow-800">{earnedBadge.name}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/park")}
          className="w-full py-3 rounded-xl bg-park-ocean text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Kembali ke Peta
        </button>
      </div>
    </div>
  );

  if (!quiz) return null;

  return (
    <div className="min-h-screen bg-park-sky flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-sm">

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="text-park-ocean text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            ← Keluar
          </button>
          <span className="text-xs text-slate-500 font-semibold">
            {currentIndex + 1} / {quizzes.length}
          </span>
        </div>

        <div className="w-full h-2 bg-white/60 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-park-ocean rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + (phase === "feedback" ? 1 : 0)) / quizzes.length) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          <div className="bg-park-sky/40 px-5 py-3 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold">Soal {currentIndex + 1}</span>
            <span className="text-xs font-bold text-park-ocean">{quiz.points} poin</span>
          </div>

          <div className="px-5 pt-5 pb-4">
            <p className="text-base font-bold text-slate-800 leading-snug text-center">
              {quiz.question}
            </p>
          </div>

          <div className="px-5 pb-5 space-y-2.5">
            {quiz.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const isDone = phase === "feedback";
              const isCorrectChoice = isDone && result?.isCorrect && isSelected;
              const isWrongChoice   = isDone && !result?.isCorrect && isSelected;

              return (
                <button
                  key={opt.id}
                  disabled={isDone}
                  onClick={() => setSelectedId(opt.id)}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl border-2 text-sm font-semibold text-left transition-all",
                    !isDone && !isSelected && "bg-slate-50 border-slate-200 hover:border-park-ocean hover:bg-park-sky/20",
                    !isDone && isSelected  && "bg-park-sky/30 border-park-ocean text-park-ocean",
                    isCorrectChoice && "bg-green-50 border-green-400 text-green-700",
                    isWrongChoice   && "bg-red-50 border-park-berry text-park-berry",
                    isDone && !isSelected  && "opacity-40 bg-slate-50 border-slate-100 cursor-not-allowed"
                  )}
                >
                  {opt.optionText}
                </button>
              );
            })}
          </div>

          {phase === "feedback" && result && (
            <div className={cn(
              "px-5 py-3.5 border-t",
              result.isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
            )}>
              <p className={cn("text-sm font-bold mb-0.5", result.isCorrect ? "text-green-700" : "text-park-berry")}>
                {result.isCorrect ? `✓ Benar! +${result.earnedPoints} poin` : "✗ Kurang tepat"}
              </p>
              {result.explanation && (
                <p className="text-xs text-slate-600 leading-relaxed">{result.explanation}</p>
              )}
              {result.badge && (
                <p className="text-xs font-bold text-yellow-700 mt-1.5 flex items-center gap-1">
                  <Award size={12} /> Badge: {result.badge.name}
                </p>
              )}
            </div>
          )}

          <div className="px-5 pb-5 pt-3">
            {phase === "quiz" ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedId || submitting}
                className="w-full py-3 rounded-xl bg-park-ocean text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {submitting ? "Memeriksa..." : "Jawab"}
              </button>
            ) : (
              <button
                onClick={advance}
                className="w-full py-3 rounded-xl bg-park-sun text-slate-800 font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {currentIndex + 1 >= quizzes.length ? "Lihat Hasil →" : "Soal Berikutnya →"}
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <p className="mt-3 text-center text-xs text-park-berry">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
