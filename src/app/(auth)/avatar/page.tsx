"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cat, Dog, Rabbit, PawPrint, Heart, Smile, Crown, Snowflake, UserRound, type LucideIcon } from "lucide-react";
import { childrenApi } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import type { Child } from "@/types/types";

const AVATAR_ICONS: Record<string, LucideIcon> = {
  cat: Cat, dog: Dog, rabbit: Rabbit,
  bear: PawPrint, fox: Heart, panda: Smile, lion: Crown, penguin: Snowflake,
};

function AvatarIcon({ avatar, name }: { avatar: string | null; name: string }) {
  if (avatar) {
    const Icon = AVATAR_ICONS[avatar.toLowerCase()];
    if (Icon) return <Icon size={40} className="text-park-ocean" />;
    return <span className="text-3xl">{avatar}</span>;
  }
  return <span className="text-2xl font-bold text-park-ocean">{name.charAt(0).toUpperCase()}</span>;
}

export default function AvatarPage() {
  const router = useRouter();
  const accessToken = useUserStore((state) => state.accessToken);
  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const setActiveChild = useUserStore((state) => state.setActiveChild);

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.push("/login");
      return;
    }

    childrenApi.getAll()
      .then(setChildren)
      .catch(() => setError("Gagal memuat profil anak"))
      .finally(() => setLoading(false));
  }, [hasHydrated, accessToken, router]);

  const handleSelectChild = async (child: Child) => {
    try {
      const accessed = await childrenApi.access(child.id);
      setActiveChild(accessed);
      router.push("/park");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memilih profil");
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const created = await childrenApi.create({
        name: newName,
        age: parseInt(newAge),
      });
      setChildren((prev) => [...prev, created]);
      setShowForm(false);
      setNewName("");
      setNewAge("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menambah anak");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-sm">Memuat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-white text-2xl font-bold mb-2">Siapa yang mau belajar?</h1>
      <p className="text-slate-400 text-sm mb-10">Pilih profilmu</p>

      {error && (
        <p className="text-park-berry text-sm mb-6">{error}</p>
      )}

      <div className="flex flex-wrap gap-6 justify-center mb-10">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => handleSelectChild(child)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-24 h-24 rounded-2xl bg-park-sky flex items-center justify-center group-hover:ring-4 group-hover:ring-white transition-all">
              <AvatarIcon avatar={child.avatar} name={child.name} />
            </div>
            <span className="text-slate-300 text-sm font-semibold group-hover:text-white transition-colors">
              {child.name}
            </span>
          </button>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="flex flex-col items-center gap-3 group"
        >
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-600 flex items-center justify-center group-hover:border-slate-400 group-hover:text-slate-300 transition-all">
            <UserRound size={36} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
          </div>
          <span className="text-slate-500 text-sm font-semibold group-hover:text-slate-300 transition-colors">
            Tambah anak
          </span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Tambah profil anak</h2>

            <form onSubmit={handleAddChild} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama anak"
                  required
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-ocean focus:ring-2 focus:ring-park-ocean/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Usia</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                  placeholder="4"
                  min={4}
                  max={10}
                  required
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-ocean focus:ring-2 focus:ring-park-ocean/20 transition-all"
                />
              </div>

              {formError && (
                <p className="text-xs text-park-berry bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-park-ocean text-white rounded-xl py-2.5 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {formLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
