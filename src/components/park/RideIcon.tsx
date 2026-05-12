"use client";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

interface RideIconProps {
    id: string;
    title: string;
    icon: string;
    top: string;
    left: string;
}

export function RideIcon ({ id, title, icon, top, left }: RideIconProps) {
    const { completedModules } = useUserStore();
    const isCompleted = completedModules.includes(id);

    return (
        <Link href={`/learn/${id}`} className="absolute transform-translate-x-1/2 -translate-y-1/2 group" style={{top, left}}>
            <div className="flex flex-col items-center">
                <div className="mb-2 bg-white px-3 py-1 rounded-full shadow-lg text-sm font-bold text-park-ocean border-2 border-park-sky opacity-0 group-hover:opacity-1 transition-opacity">
                    {title}
                </div>
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all group-hover:scale-110"
                    , isCompleted ? "bg-park-sun border-4 border-white" : "bg-slate-200 grayscale opacity-80"
                )}>
                    {icon}
                </div>
                {isCompleted && (
                    <div className="mt-1 bg-park-grass text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                        Completed
                    </div>
                )}
            </div>

        </Link>
    )
}