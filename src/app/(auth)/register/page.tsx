"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authApi.register({ name, email, password });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-park-sky flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-xl font-bold text-slate-900 mb-1">
            Little<span className="text-park-berry">Step</span>
          </div>
          <p className="text-sm text-slate-500">Buat akun baru</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkapmu"
              required
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-ocean focus:ring-2 focus:ring-park-ocean/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-ocean focus:ring-2 focus:ring-park-ocean/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-park-ocean focus:ring-2 focus:ring-park-ocean/20 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-park-berry bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-park-ocean text-white rounded-xl py-3 text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-park-ocean font-semibold hover:underline">
            Masuk
          </Link>
        </p>

      </div>
    </div>
  );
}
