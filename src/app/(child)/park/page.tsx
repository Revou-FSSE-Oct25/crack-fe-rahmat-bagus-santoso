"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { modulesApi, childrenApi } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import { ParkLayout } from "@/components/park/ParkLayout";
import type { Module, ModuleProgress } from "@/types/types";

export default function ParkPage() {
  const router = useRouter();
  const accessToken  = useUserStore((state) => state.accessToken);
  const activeChild  = useUserStore((state) => state.activeChild);
  const hasHydrated  = useUserStore((state) => state._hasHydrated);

  const [modules, setModules] = useState<Module[]>([]);
  const [progresses, setProgresses] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.push("/login");
      return;
    }
    if (!activeChild) {
      router.push("/avatar");
      return;
    }

    const fetchData = async () => {
      try {
        const [mods, progs] = await Promise.all([
          modulesApi.getAll(),
          childrenApi.getProgress(activeChild.id),
        ]);
        setModules(mods);
        setProgresses(progs);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(`Gagal memuat taman: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasHydrated, accessToken, activeChild, router]);

  const getStatus = (moduleId: string): ModuleProgress["status"] =>
    progresses.find((p) => p.moduleId === moduleId)?.status ?? "NOT_STARTED";

  if (loading) {
    return (
      <div className="min-h-screen bg-park-sky flex items-center justify-center">
        <p className="text-slate-600 text-sm">Memuat taman...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-park-sky flex items-center justify-center">
        <p className="text-park-berry text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-park-sky">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-park-ocean text-center">
          The Learning Park
        </h1>
        <p className="text-sm text-slate-500 text-center mt-1">
          Halo, {activeChild?.name}! Pilih wahana yang ingin kamu jelajahi.
        </p>
      </div>

      <ParkLayout modules={modules} getStatus={getStatus} />
    </div>
  );
}
