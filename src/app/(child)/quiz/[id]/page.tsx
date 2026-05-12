"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockContents } from "@/data/mock/contents";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const { addPoints, completeModules, completedModules } = useUserStore();
    const content = mockContents.find((content) => content.id === params.id);
    const quiz = content?.quizzes[0];
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    if (!quiz) {
        return <div>Quiz not found....</div>;
    }

    const handleCheckAnswer = (option: string) => {
        if (hasSubmitted) return;
        setSelectedOption(option);
        const correct = option === quiz.answer;
        setIsCorrect(correct);
        setHasSubmitted(true);

        if (correct) {
            if(!completedModules.includes(params.id as string)) {
                
                addPoints(10);
                completeModules(params.id as string);
            }
        }
    }
    return (
        <div className="min-h-screen bg-park-sky p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl rounded-park shadow-2xl border-none bg-white">
                <h2 className="text-2xl font-bold text-slate-700 text-center mb-6">{quiz.question}</h2>
                <div className="grid gap-4">
                    {quiz.options.map((option) => (
                        <button key={option} disabled={hasSubmitted} onClick={() => handleCheckAnswer(option)} className={cn(
                            "w-full p-4 text-xl font-bold rounded-2xl border-4 transition-all",
                            !hasSubmitted && "border-slate-100 hover:border-park-ocean bg-slate-50",
                            hasSubmitted && option === quiz.answer && "border-park-grass bg-green-50 text-green-700",
                            hasSubmitted && option === selectedOption && option !==quiz.answer && "border-park-berry bg-red-50 text-red-700",
                            hasSubmitted && option !== selectedOption && option !==quiz.answer && "opacity-50 border-slate-100"
                        )}
                        >
                            {option}
                        </button>
                        ))}
                        
                </div>
                {hasSubmitted && (
                    <div className="mt-8 text-center animated-bounce">
                        {isCorrect ? (
                            <p className="text-2xl font-bold text-park-grass">Correct! (+10 Stars)</p>
                        ) : (
                            <p className="text-2xl font-bold text-park-berry">Incorrect</p>
                        )
                        }
                        <Button className="mt-6 bg-park-ocean rounded-full px-8 py-6 text-xl" onClick={() => router.push("/park")} >Back to map</Button>
                    </div>
                )}
            </div>
        </div>
    )
}