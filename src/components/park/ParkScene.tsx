export function ParkScene() {
  return (
    <div className="mx-6">
      <div className="relative max-w-xl mx-auto rounded-2xl overflow-hidden" style={{ height: 240, background: "#dbeafe" }}>
        <div className="absolute top-0 left-0 right-0" style={{ height: 130, background: "#bfdbfe" }} />
        <div className="absolute left-0 right-0" style={{ top: 80, height: 80, background: "#dbeafe" }} />

        <div className="absolute" style={{ top: 14, left: 28 }}>
          <div className="absolute bg-white rounded-full" style={{ width: 44, height: 18, top: 7, left: 0 }} />
          <div className="absolute bg-white rounded-full" style={{ width: 28, height: 28, top: 0, left: 10 }} />
          <div className="absolute bg-white rounded-full" style={{ width: 22, height: 20, top: 5, left: 28 }} />
        </div>
        <div className="absolute" style={{ top: 10, right: 56 }}>
          <div className="absolute bg-white rounded-full" style={{ width: 54, height: 20, top: 9, left: 0 }} />
          <div className="absolute bg-white rounded-full" style={{ width: 32, height: 32, top: 0, left: 12 }} />
          <div className="absolute bg-white rounded-full" style={{ width: 24, height: 22, top: 6, left: 34 }} />
        </div>
        <div className="absolute" style={{ top: 26, right: 168 }}>
          <div className="absolute bg-white rounded-full" style={{ width: 32, height: 14, top: 5, left: 0 }} />
          <div className="absolute bg-white rounded-full" style={{ width: 20, height: 20, top: 0, left: 8 }} />
          <div className="absolute bg-white rounded-full" style={{ width: 16, height: 15, top: 4, left: 20 }} />
        </div>

        <div className="absolute rounded-full" style={{ width: 250, height: 105, background: "#bbf7d0", bottom: 38, left: -40 }} />
        <div className="absolute rounded-full" style={{ width: 200, height: 85, background: "#bbf7d0", bottom: 38, right: -24 }} />

        <div className="absolute flex flex-col items-center" style={{ left: 28, bottom: 60 }}>
          <div style={{ width: 32, height: 40, background: "#16a34a", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
          <div style={{ width: 7, height: 13, background: "#a16207", borderRadius: 2 }} />
        </div>
        <div className="absolute flex flex-col items-center" style={{ left: 62, bottom: 60 }}>
          <div style={{ width: 22, height: 29, background: "#15803d", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
          <div style={{ width: 5, height: 9, background: "#a16207", borderRadius: 2 }} />
        </div>

        <div className="absolute flex flex-col items-center" style={{ right: 28, bottom: 60 }}>
          <div style={{ width: 30, height: 38, background: "#16a34a", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
          <div style={{ width: 6, height: 12, background: "#a16207", borderRadius: 2 }} />
        </div>
        <div className="absolute flex flex-col items-center" style={{ right: 62, bottom: 60 }}>
          <div style={{ width: 20, height: 26, background: "#15803d", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }} />
          <div style={{ width: 5, height: 8, background: "#a16207", borderRadius: 2 }} />
        </div>

        <div className="absolute flex flex-col items-center" style={{ left: 112, bottom: 60 }}>
          <span style={{ fontSize: 26, lineHeight: 1 }}>🎠</span>
          <div style={{ width: 4, height: 14, background: "#94a3b8", borderRadius: 2 }} />
          <div style={{ width: 34, height: 7, background: "#fcd34d", borderRadius: 4 }} />
        </div>
        <div className="absolute flex flex-col items-center" style={{ right: 112, bottom: 60 }}>
          <span style={{ fontSize: 26, lineHeight: 1 }}>🎡</span>
          <div style={{ width: 4, height: 14, background: "#94a3b8", borderRadius: 2 }} />
          <div style={{ width: 34, height: 7, background: "#fcd34d", borderRadius: 4 }} />
        </div>

        <div className="absolute flex flex-col items-center" style={{ bottom: 38, left: "50%", transform: "translateX(-50%)" }}>
          <div
            className="flex items-center justify-center relative"
            style={{ width: 100, height: 60, background: "#fffbeb", border: "2.5px solid #fcd34d", borderRadius: "999px 999px 0 0" }}
          >
            <div
              className="absolute font-bold"
              style={{ top: 12, left: "50%", transform: "translateX(-50%)", background: "#fbbf24", borderRadius: 4, padding: "2px 7px", fontSize: 8.5, color: "#78350f", whiteSpace: "nowrap" }}
            >
              LittleStep Park
            </div>
            <div style={{ width: 66, height: 40, background: "#dbeafe", borderRadius: "999px 999px 0 0" }} />
          </div>
        </div>

        <div className="absolute flex flex-col items-center" style={{ left: "calc(50% - 70px)", bottom: 38 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: 5, height: 44, background: "#e5e7eb", borderRadius: 3 }} />
        </div>
        <div className="absolute flex flex-col items-center" style={{ right: "calc(50% - 70px)", bottom: 38 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
          <div style={{ width: 5, height: 44, background: "#e5e7eb", borderRadius: 3 }} />
        </div>

        <div className="absolute" style={{ bottom: 0, left: "50%", transform: "translateX(-50%)", width: 44, height: 40, background: "#fde68a", borderRadius: "4px 4px 0 0" }} />

        <div className="absolute bottom-0 left-0 right-0" style={{ height: 60, background: "#86efac" }} />
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 38, background: "#4ade80" }} />
      </div>
    </div>
  );
}
