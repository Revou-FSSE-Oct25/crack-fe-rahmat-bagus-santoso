import Link from "next/link";
import { ParkScene } from "@/components/park/ParkScene";

export default function Home() {
  return (
    <div className="min-h-screen font-quicksand bg-slate-50">

      <nav className="flex justify-between items-center px-12 py-5">
        <div className="text-base font-bold text-slate-900">
          Little<span className="text-park-berry">Step</span>
        </div>
        <div className="flex gap-2">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-500 px-4 py-2 hover:text-slate-700 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="bg-slate-900 text-white rounded-lg px-5 py-2 text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Daftar
          </Link>
        </div>
      </nav>

      <div className="grid grid-cols-2 gap-8 px-12 pt-6 pb-8 items-center">
        <div>
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-md mb-5 bg-park-sun text-yellow-900">
            untuk anak 4–10 tahun
          </span>
          <h1 className="text-4xl font-bold text-slate-900 leading-tight mb-4">
            Belajar yang
            <br />
            terasa seperti
            <br />
            <span className="text-park-ocean">bermain.</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed mb-7">
            Micro-lesson pendek dan kuis seru — dalam satu taman petualangan
            yang dibuat khusus untuk anak.
          </p>
          <div className="flex flex-col gap-2 items-start">
            <Link
              href="/register"
              className="w-full text-center text-white text-sm font-bold rounded-xl py-3 px-6 bg-park-ocean hover:opacity-90 transition-opacity"
            >
              Mulai sekarang — gratis
            </Link>
            <Link
              href="/login"
              className="text-sm text-slate-400 underline underline-offset-4 hover:text-slate-600 transition-colors"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">

          <div className="rounded-2xl p-4 bg-park-sky">
            <p className="text-xs font-bold tracking-widest uppercase mb-2.5 text-park-ocean">
              Wahana di taman
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { emoji: "🏰", label: "Kastil Warna" },
                { emoji: "🎠", label: "Karusel Angka" },
                { emoji: "🌳", label: "Hutan Huruf" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="bg-white rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 flex items-center gap-3 bg-yellow-50 border border-yellow-100">
            <span className="text-3xl">🏅</span>
            <div>
              <p className="text-sm font-bold text-yellow-900">Selesaikan wahana</p>
              <p className="text-xs text-yellow-700">dapatkan badge koleksi eksklusif</p>
            </div>
          </div>

        </div>
      </div>

      <ParkScene />

      <div className="bg-slate-900 px-12 py-5 flex justify-between items-center mt-10">
        <div className="text-sm font-bold text-white">
          little<em className="not-italic text-park-berry">step</em>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">Micro-learning untuk anak usia 4-10 tahun</span>
          <Link
            href="/register"
            className="bg-park-berry text-white rounded-lg px-5 py-2 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>

    </div>
  );
}
