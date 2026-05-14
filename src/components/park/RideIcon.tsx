"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface RideIconProps {
  id: string;
  title: string;
  icon: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

export function RideIcon({ id, title, icon, status }: RideIconProps) {
  const isCompleted = status === "COMPLETED";
  const isInProgress = status === "IN_PROGRESS";

  return (
    <Link href={`/learn/${id}`} className="flex flex-col items-center gap-2 group">
      <div
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all group-hover:scale-110",
          isCompleted && "bg-park-sun border-4 border-white",
          isInProgress && "bg-white border-4 border-park-ocean",
          !isCompleted && !isInProgress && "bg-slate-200 opacity-80"
        )}
      >
        {icon}
      </div>

      <span className="text-sm font-bold text-slate-700 group-hover:text-park-ocean transition-colors text-center max-w-20">
        {title}
      </span>

      {isCompleted && (
        <span className="bg-park-grass text-white text-xs px-2 py-0.5 rounded-full font-bold">
          Selesai
        </span>
      )}
      {isInProgress && (
        <span className="bg-park-ocean text-white text-xs px-2 py-0.5 rounded-full font-bold">
          Lanjutkan
        </span>
      )}
    </Link>
  );
}
