"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Module, ModuleProgress } from "@/types/types";


const PARK_SLOTS = [
  { x: 52, y: 15.6 },
  { x: 71.5, y: 22.3 },
  { x: 74, y: 48 },
  { x: 68, y: 67 },
  { x: 50, y: 74 },
  { x: 34, y: 63 },
  { x: 25, y: 48 },
  { x: 35, y: 33 },
] as const;


const PARK_MAP_SRC = "/assets/ParkMap.webp";

interface ParkLayoutProps {
  modules: Module[];
  getStatus: (moduleId: string) => ModuleProgress["status"];
}

export function ParkLayout({ modules, getStatus }: ParkLayoutProps) {
  return (
    <div
      className="park-wrap relative w-full mx-auto overflow-hidden rounded-2xl"
      style={{
        background: "#E0F2FE",
        aspectRatio: "4 / 3",
      }}
    >
      <img
        src={PARK_MAP_SRC}
        alt="Learning Park Map"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ mixBlendMode: "multiply" }}
        draggable={false}
      />

      {modules.map((mod, i) => {
        const slot = PARK_SLOTS[i % PARK_SLOTS.length];
        const status = getStatus(mod.id);
        const isCompleted  = status === "COMPLETED";
        const isInProgress = status === "IN_PROGRESS";

        const displayIcon = isCompleted ? "⭐" : (mod.icon ?? "🎡");

        return (
          <Link
            key={mod.id}
            href={`/learn/${mod.id}`}
            className="absolute flex flex-col items-center gap-1 group"
            style={{
              left: `${slot.x}%`,
              top:  `${slot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {(isCompleted || isInProgress) && (
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 52,
                  height: 52,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -20%)",
                  background: isCompleted ? "#fde047" : "#388DF8",
                  filter: "blur(10px)",
                  opacity: 0.5,
                }}
              />
            )}

            <span
              className={cn(
                "relative z-10 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap",
                "transition-transform duration-150 group-hover:-translate-y-0.5",
                isCompleted  && "bg-yellow-100 text-yellow-800",
                isInProgress && "bg-[#388DF8] text-white",
                !isCompleted && !isInProgress && "bg-white/95 text-slate-600",
              )}
            >
              {mod.title}
            </span>

            <div
              className={cn(
                "relative z-10 w-12 h-12 rounded-full flex items-center justify-center",
                "text-xl border-[3px] shadow-lg",
                "transition-transform duration-150 group-hover:scale-110 group-active:scale-95",
                isCompleted  && "bg-yellow-100 border-yellow-400",
                isInProgress && "bg-white border-[#388DF8]",
                !isCompleted && !isInProgress && "bg-white/90 border-slate-300",
              )}
            >
              {displayIcon}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
