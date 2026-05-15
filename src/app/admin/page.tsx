"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { modulesApi, lessonsApi, adminApi } from "@/lib/api";
import { useUserStore } from "@/store/useUserStore";
import type { Module, Lesson, Quiz } from "@/types/types";

type Tab = "modules" | "lessons" | "quizzes";

const BLANK_MOD  = { title: "", description: "", icon: "" };
const BLANK_LES  = { title: "", content: "", orderNumber: 1 };
const BLANK_QUIZ = {
  question: "", explanation: "", orderNumber: 1, points: 10,
  options: ["", "", "", ""], correctIndex: 0,
};

export default function AdminPage() {
  const router = useRouter();
  const user        = useUserStore((s) => s.user);
  const accessToken = useUserStore((s) => s.accessToken);
  const hasHydrated = useUserStore((s) => s._hasHydrated);
  const logout      = useUserStore((s) => s.logout);

  const [tab, setTab] = useState<Tab>("modules");

  const [modules,  setModules]  = useState<Module[]>([]);
  const [lessons,  setLessons]  = useState<Lesson[]>([]);
  const [quizzes,  setQuizzes]  = useState<Quiz[]>([]);
  const [selModId, setSelModId] = useState("");
  const [selLesId, setSelLesId] = useState("");

  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [err,     setErr]       = useState<string | null>(null);

  const [modForm,  setModForm]  = useState(BLANK_MOD);
  const [lesForm,  setLesForm]  = useState(BLANK_LES);
  const [quizForm, setQuizForm] = useState(BLANK_QUIZ);
  const [editMod,  setEditMod]  = useState<Module | null>(null);
  const [editLes,  setEditLes]  = useState<Lesson | null>(null);
  const [showModForm,  setShowModForm]  = useState(false);
  const [showLesForm,  setShowLesForm]  = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken)          { router.push("/login"); return; }
    if (user?.role !== "ADMIN") { router.push("/login"); return; }
    modulesApi.getAll().then(setModules).catch(() => setErr("Gagal memuat modul")).finally(() => setLoading(false));
  }, [hasHydrated, accessToken, user, router]);

  useEffect(() => {
    if (!selModId) { setLessons([]); return; }
    modulesApi.getLessons(selModId).then((ls) => setLessons(ls.sort((a, b) => a.orderNumber - b.orderNumber)));
  }, [selModId]);

  useEffect(() => {
    if (!selLesId) { setQuizzes([]); return; }
    lessonsApi.getQuizzes(selLesId).then(setQuizzes).catch(() => setQuizzes([]));
  }, [selLesId]);

  const flash = (e: string) => { setErr(e); setTimeout(() => setErr(null), 4000); };

  const handleSaveMod = async () => {
    if (!modForm.title.trim()) return;
    setSaving(true);
    try {
      if (editMod) {
        const updated = await adminApi.updateModule(editMod.id, { title: modForm.title, description: modForm.description || undefined, icon: modForm.icon || undefined });
        setModules((prev) => prev.map((m) => (m.id === editMod.id ? updated : m)));
      } else {
        const created = await adminApi.createModule({ title: modForm.title, description: modForm.description || undefined, icon: modForm.icon || undefined });
        setModules((prev) => [...prev, created]);
      }
      setModForm(BLANK_MOD); setEditMod(null); setShowModForm(false);
    } catch (e) { flash(e instanceof Error ? e.message : "Gagal menyimpan modul"); }
    finally { setSaving(false); }
  };

  const handleDeleteMod = async (id: string) => {
    if (!confirm("Hapus modul ini? Semua pelajaran dan quiz di dalamnya akan ikut terhapus.")) return;
    try {
      await adminApi.deleteModule(id);
      setModules((prev) => prev.filter((m) => m.id !== id));
      if (selModId === id) { setSelModId(""); setLessons([]); }
    } catch (e) { flash(e instanceof Error ? e.message : "Gagal hapus modul"); }
  };

  const handleSaveLes = async () => {
    if (!lesForm.title.trim() || !selModId) return;
    setSaving(true);
    try {
      if (editLes) {
        const updated = await adminApi.updateLesson(editLes.id, { title: lesForm.title, content: lesForm.content, orderNumber: lesForm.orderNumber });
        setLessons((prev) => prev.map((l) => (l.id === editLes.id ? updated : l)));
      } else {
        const created = await adminApi.createLesson({ title: lesForm.title, content: lesForm.content, orderNumber: lesForm.orderNumber, moduleId: selModId });
        setLessons((prev) => [...prev, created].sort((a, b) => a.orderNumber - b.orderNumber));
      }
      setLesForm(BLANK_LES); setEditLes(null); setShowLesForm(false);
    } catch (e) { flash(e instanceof Error ? e.message : "Gagal menyimpan pelajaran"); }
    finally { setSaving(false); }
  };

  const handleDeleteLes = async (id: string) => {
    if (!confirm("Hapus pelajaran ini beserta semua quiz-nya?")) return;
    try {
      await adminApi.deleteLesson(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
      if (selLesId === id) { setSelLesId(""); setQuizzes([]); }
    } catch (e) { flash(e instanceof Error ? e.message : "Gagal hapus pelajaran"); }
  };

  const handleSaveQuiz = async () => {
    if (!quizForm.question.trim() || !selLesId) return;
    if (quizForm.options.some((o) => !o.trim())) { flash("Semua opsi harus diisi"); return; }
    setSaving(true);
    try {
      const created = await adminApi.createQuiz({
        question: quizForm.question,
        explanation: quizForm.explanation || undefined,
        orderNumber: quizForm.orderNumber,
        points: quizForm.points,
        lessonId: selLesId,
        options: quizForm.options.map((text, i) => ({ optionText: text, isCorrect: i === quizForm.correctIndex })),
      });
      setQuizzes((prev) => [...prev, created]);
      setQuizForm(BLANK_QUIZ); setShowQuizForm(false);
    } catch (e) { flash(e instanceof Error ? e.message : "Gagal menyimpan quiz"); }
    finally { setSaving(false); }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Hapus quiz ini?")) return;
    try {
      await adminApi.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (e) { flash(e instanceof Error ? e.message : "Gagal hapus quiz"); }
  };

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-park-ocean focus:ring-2 focus:ring-park-ocean/20 transition-all";
  const btnPrimary = "px-4 py-2 bg-park-ocean text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40";
  const btnDanger  = "px-3 py-1.5 text-xs font-bold text-park-berry hover:bg-red-50 rounded-lg transition-colors";
  const btnGhost   = "px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors";

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500 text-sm">Memuat admin...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Admin Panel</p>
          <p className="text-base font-bold text-slate-800">LittleStep CMS</p>
        </div>
        <button onClick={() => { logout(); router.push("/login"); }} className="text-xs text-slate-400 font-semibold hover:text-park-berry transition-colors">
          Keluar
        </button>
      </div>

      {err && (
        <div className="mx-6 mt-4 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-park-berry font-semibold">
          {err}
        </div>
      )}

      <div className="px-6 pt-4 flex gap-2">
        {(["modules", "lessons", "quizzes"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === t ? "bg-park-ocean text-white" : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {t === "modules" ? "Modul" : t === "lessons" ? "Pelajaran" : "Quiz"}
          </button>
        ))}
      </div>

      <div className="px-6 py-4 max-w-3xl">

        {tab === "modules" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-700">{modules.length} Modul</p>
              <button className={btnPrimary} onClick={() => { setEditMod(null); setModForm(BLANK_MOD); setShowModForm(true); }}>
                + Tambah Modul
              </button>
            </div>

            {showModForm && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 space-y-3">
                <p className="text-xs font-bold text-slate-600">{editMod ? "Edit Modul" : "Modul Baru"}</p>
                <input className={inputCls} placeholder="Judul modul *" value={modForm.title} onChange={(e) => setModForm({ ...modForm, title: e.target.value })} />
                <input className={inputCls} placeholder="Deskripsi (opsional)" value={modForm.description} onChange={(e) => setModForm({ ...modForm, description: e.target.value })} />
                <input className={inputCls} placeholder="Icon emoji (misal: 🔢)" value={modForm.icon} onChange={(e) => setModForm({ ...modForm, icon: e.target.value })} />
                <div className="flex gap-2">
                  <button className={btnPrimary} onClick={handleSaveMod} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</button>
                  <button className={btnGhost} onClick={() => { setShowModForm(false); setEditMod(null); }}>Batal</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {modules.map((mod) => (
                <div key={mod.id} className="bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {mod.icon
                      ? /\.|\/|^http/.test(mod.icon)
                        ? <img src={mod.icon} alt={mod.title} className="w-8 h-8 object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        : <span className="text-2xl leading-none">{mod.icon}</span>
                      : <BookOpen size={20} className="text-slate-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{mod.title}</p>
                    {mod.description && <p className="text-xs text-slate-400 truncate">{mod.description}</p>}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className={btnGhost} onClick={() => { setEditMod(mod); setModForm({ title: mod.title, description: mod.description ?? "", icon: mod.icon ?? "" }); setShowModForm(true); }}>Edit</button>
                    <button className={btnDanger} onClick={() => handleDeleteMod(mod.id)}>Hapus</button>
                  </div>
                </div>
              ))}
              {modules.length === 0 && <p className="text-center text-slate-400 text-sm py-8">Belum ada modul.</p>}
            </div>
          </div>
        )}

        {tab === "lessons" && (
          <div>
            <select
              className={`${inputCls} mb-4`}
              value={selModId}
              onChange={(e) => { setSelModId(e.target.value); setEditLes(null); setShowLesForm(false); }}
            >
              <option value="">-- Pilih Modul --</option>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>

            {selModId && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-slate-700">{lessons.length} Pelajaran</p>
                  <button className={btnPrimary} onClick={() => { setEditLes(null); setLesForm({ ...BLANK_LES, orderNumber: lessons.length + 1 }); setShowLesForm(true); }}>
                    + Tambah Pelajaran
                  </button>
                </div>

                {showLesForm && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 space-y-3">
                    <p className="text-xs font-bold text-slate-600">{editLes ? "Edit Pelajaran" : "Pelajaran Baru"}</p>
                    <input className={inputCls} placeholder="Judul pelajaran *" value={lesForm.title} onChange={(e) => setLesForm({ ...lesForm, title: e.target.value })} />
                    <textarea className={`${inputCls} min-h-[120px] resize-y`} placeholder="Konten / materi pelajaran *" value={lesForm.content} onChange={(e) => setLesForm({ ...lesForm, content: e.target.value })} />
                    <input className={inputCls} type="number" min={1} placeholder="Urutan (orderNumber)" value={lesForm.orderNumber} onChange={(e) => setLesForm({ ...lesForm, orderNumber: Number(e.target.value) })} />
                    <div className="flex gap-2">
                      <button className={btnPrimary} onClick={handleSaveLes} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</button>
                      <button className={btnGhost} onClick={() => { setShowLesForm(false); setEditLes(null); }}>Batal</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {lessons.map((les) => (
                    <div key={les.id} className="bg-white border border-slate-100 rounded-2xl px-4 py-3">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-slate-400 mt-0.5 w-5 flex-shrink-0">{les.orderNumber}.</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800">{les.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{les.content}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button className={btnGhost} onClick={() => { setEditLes(les); setLesForm({ title: les.title, content: les.content, orderNumber: les.orderNumber }); setShowLesForm(true); }}>Edit</button>
                          <button className={btnDanger} onClick={() => handleDeleteLes(les.id)}>Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {lessons.length === 0 && <p className="text-center text-slate-400 text-sm py-8">Belum ada pelajaran.</p>}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "quizzes" && (
          <div>
            <select className={`${inputCls} mb-3`} value={selModId} onChange={(e) => { setSelModId(e.target.value); setSelLesId(""); }}>
              <option value="">-- Pilih Modul --</option>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>

            {selModId && (
              <select className={`${inputCls} mb-4`} value={selLesId} onChange={(e) => { setSelLesId(e.target.value); setShowQuizForm(false); }}>
                <option value="">-- Pilih Pelajaran --</option>
                {lessons.map((l) => <option key={l.id} value={l.id}>{l.orderNumber}. {l.title}</option>)}
              </select>
            )}

            {selLesId && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-slate-700">{quizzes.length} Quiz</p>
                  <button className={btnPrimary} onClick={() => { setQuizForm({ ...BLANK_QUIZ, orderNumber: quizzes.length + 1 }); setShowQuizForm(true); }}>
                    + Tambah Quiz
                  </button>
                </div>

                {showQuizForm && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 space-y-3">
                    <p className="text-xs font-bold text-slate-600">Quiz Baru</p>
                    <textarea className={`${inputCls} min-h-[80px] resize-y`} placeholder="Pertanyaan *" value={quizForm.question} onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })} />
                    <input className={inputCls} placeholder="Penjelasan jawaban (opsional)" value={quizForm.explanation} onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })} />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-500 font-semibold">Urutan</label>
                        <input className={inputCls} type="number" min={1} value={quizForm.orderNumber} onChange={(e) => setQuizForm({ ...quizForm, orderNumber: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-semibold">Poin</label>
                        <input className={inputCls} type="number" min={1} value={quizForm.points} onChange={(e) => setQuizForm({ ...quizForm, points: Number(e.target.value) })} />
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-600">Opsi Jawaban <span className="font-normal text-slate-400">(pilih radio = jawaban benar)</span></p>
                    {quizForm.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correct"
                          checked={quizForm.correctIndex === i}
                          onChange={() => setQuizForm({ ...quizForm, correctIndex: i })}
                          className="accent-park-ocean flex-shrink-0"
                        />
                        <input
                          className={inputCls}
                          placeholder={`Opsi ${i + 1} *`}
                          value={opt}
                          onChange={(e) => {
                            const opts = [...quizForm.options];
                            opts[i] = e.target.value;
                            setQuizForm({ ...quizForm, options: opts });
                          }}
                        />
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <button className={btnPrimary} onClick={handleSaveQuiz} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</button>
                      <button className={btnGhost} onClick={() => setShowQuizForm(false)}>Batal</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {quizzes.map((q) => (
                    <div key={q.id} className="bg-white border border-slate-100 rounded-2xl px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-400 mb-0.5">Soal {q.orderNumber} · {q.points} poin · {q.options.length} opsi</p>
                          <p className="text-sm font-semibold text-slate-800">{q.question}</p>
                          {q.explanation && <p className="text-xs text-slate-400 mt-1 italic">"{q.explanation}"</p>}
                        </div>
                        <button className={btnDanger} onClick={() => handleDeleteQuiz(q.id)}>Hapus</button>
                      </div>
                    </div>
                  ))}
                  {quizzes.length === 0 && <p className="text-center text-slate-400 text-sm py-8">Belum ada quiz.</p>}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
