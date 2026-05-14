"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Award } from "lucide-react";
import { modulesApi } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import type { Module, Lesson } from "@/types/types";

export default function LearnPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const accessToken = useUserStore((state) => state.accessToken);
  const activeChild = useUserStore((state) => state.activeChild);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  const [module, setModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) { router.push("/login"); return; }
    if (!activeChild) { router.push("/avatar"); return; }

    const fetchData = async () => {
      try {
        const [mod, lessonList] = await Promise.all([
          modulesApi.getOne(id),
          modulesApi.getLessons(id),
        ]);
        setModule(mod);
        setLessons(lessonList.sort((a, b) => a.orderNumber - b.orderNumber));
      } catch {
        setError("Gagal memuat materi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, hasHydrated, accessToken, activeChild, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-park-sky flex items-center justify-center">
        <p className="text-slate-600 text-sm">Memuat materi...</p>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-park-sky flex items-center justify-center">
        <p className="text-park-berry text-sm">{error ?? "Materi tidak ditemukan"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-park-sky px-6 pt-6 pb-6">
        <button
          onClick={() => router.back()}
          className="text-park-ocean text-sm font-semibold mb-4 flex items-center gap-1 hover:opacity-70 transition-opacity"
        >
          ← Kembali ke Peta
        </button>
        <h1 className="text-2xl font-bold text-park-ocean">{module.title}</h1>
        {module.description && (
          <p className="text-sm text-slate-600 mt-1">{module.description}</p>
        )}
        <p className="text-xs text-slate-400 mt-2">{lessons.length} pelajaran</p>
      </div>

      <div className="px-6 py-6 space-y-4 max-w-2xl mx-auto">
        {lessons.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-12">
            Belum ada pelajaran di modul ini.
          </p>
        )}

        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="bg-park-sky/40 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-park-ocean text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <h2 className="font-bold text-slate-800 text-sm">{lesson.title}</h2>
            </div>

            <div className="px-4 py-4">
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {lesson.content}
              </p>
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={() => router.push(`/quiz/${lesson.id}`)}
                className="w-full py-3 rounded-xl bg-park-sun text-slate-800 font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
              >
                Mulai Quiz →
              </button>
            </div>
          </div>
        ))}

        {module.badge && (
          <div className="mt-2 border border-yellow-200 bg-yellow-50 rounded-2xl px-4 py-4 flex items-center gap-3">
            <Award size={24} className="text-yellow-700 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-yellow-800">Selesaikan semua quiz untuk mendapat:</p>
              <p className="text-sm font-bold text-yellow-700">{module.badge.name}</p>
              {module.badge.description && (
                <p className="text-xs text-yellow-600 mt-0.5">{module.badge.description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
