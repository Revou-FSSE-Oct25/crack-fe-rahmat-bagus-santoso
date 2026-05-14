"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cat, Dog, Rabbit, PawPrint, Heart, Smile, Crown, Snowflake, UserRound, type LucideIcon } from "lucide-react";
import { childrenApi, modulesApi } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import type { Child, Module, ModuleProgress } from "@/types/types";

const AVATAR_ICONS: Record<string, LucideIcon> = {
  cat: Cat, dog: Dog, rabbit: Rabbit,
  bear: PawPrint, fox: Heart, panda: Smile, lion: Crown, penguin: Snowflake,
};

function AvatarIcon({ avatar }: { avatar: string | null }) {
  if (avatar) {
    const Icon = AVATAR_ICONS[avatar.toLowerCase()];
    if (Icon) return <Icon size={28} className="text-slate-600" />;
    return <span className="text-2xl">{avatar}</span>;
  }
  return <UserRound size={28} className="text-slate-500" />;
}

export default function DashboardPage() {
  const router = useRouter();
  const user        = useUserStore((s) => s.user);
  const accessToken = useUserStore((s) => s.accessToken);
  const hasHydrated = useUserStore((s) => s._hasHydrated);
  const setActiveChild = useUserStore((s) => s.setActiveChild);
  const logout      = useUserStore((s) => s.logout);

  const [children,    setChildren]    = useState<Child[]>([]);
  const [modules,     setModules]     = useState<Module[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress[]>>({});
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken)           { router.push("/login"); return; }
    if (user?.role !== "PARENT") { router.push("/login"); return; }

    const fetchAll = async () => {
      try {
        const [kids, mods] = await Promise.all([childrenApi.getAll(), modulesApi.getAll()]);
        setChildren(kids);
        setModules(mods);

        const progResults = await Promise.all(
          kids.map((c) => childrenApi.getProgress(c.id).catch(() => [] as ModuleProgress[]))
        );
        const map: Record<string, ModuleProgress[]> = {};
        kids.forEach((c, i) => { map[c.id] = progResults[i]; });
        setProgressMap(map);
      } catch {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [hasHydrated, accessToken, user, router]);

  const handleStartLearning = async (child: Child) => {
    try {
      const activated = await childrenApi.access(child.id);
      setActiveChild(activated);
    } catch {
      setActiveChild(child);
    }
    router.push("/park");
  };

  const handleLogout = () => { logout(); router.push("/login"); };

  if (loading) return (
    <div className="min-h-screen bg-park-sky flex items-center justify-center">
      <p className="text-slate-600 text-sm">Memuat dashboard...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-park-sky flex items-center justify-center">
      <p className="text-park-berry text-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-park-sky">
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Selamat datang,</p>
          <p className="text-base font-bold text-slate-800">{user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-400 font-semibold hover:text-park-berry transition-colors"
        >
          Keluar
        </button>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-700">Anak Saya</h2>
          <button
            onClick={() => router.push("/avatar")}
            className="text-xs text-park-ocean font-semibold hover:opacity-70 transition-opacity"
          >
            + Tambah / Kelola
          </button>
        </div>

        {children.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm mb-4">Belum ada anak yang terdaftar.</p>
            <button
              onClick={() => router.push("/avatar")}
              className="bg-park-ocean text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Tambah Anak
            </button>
          </div>
        )}

        <div className="space-y-3">
          {children.map((child) => {
            const progress    = progressMap[child.id] ?? [];
            const completed   = progress.filter((p) => p.status === "COMPLETED").length;
            const inProgress  = progress.filter((p) => p.status === "IN_PROGRESS").length;
            const totalPoints = progress.reduce((s, p) => s + p.totalPoints, 0);
            const pct = modules.length > 0 ? (completed / modules.length) * 100 : 0;

            return (
              <div key={child.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-park-sky flex items-center justify-center flex-shrink-0">
                    <AvatarIcon avatar={child.avatar} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold text-slate-800 truncate">{child.name}</p>
                      <span className="text-xs text-park-ocean font-bold whitespace-nowrap">{totalPoints} poin</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{child.age} tahun</p>

                    {modules.length > 0 && (
                      <>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-park-ocean rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {completed}/{modules.length} modul selesai
                          {inProgress > 0 && <span className="text-park-ocean ml-1">· {inProgress} sedang berjalan</span>}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {progress.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {modules.map((mod) => {
                      const p = progress.find((pr) => pr.moduleId === mod.id);
                      const status = p?.status ?? "NOT_STARTED";
                      return (
                        <span
                          key={mod.id}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            status === "COMPLETED"  ? "bg-green-100 text-green-700" :
                            status === "IN_PROGRESS"? "bg-park-sky text-park-ocean" :
                                                      "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {mod.title}
                        </span>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => handleStartLearning(child)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-park-ocean text-white font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Mulai Belajar →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
