import { create } from "zustand";
import { Quiz, SubmitResponse } from "../types/types";

interface QuizState {
    quizzes: Quiz[];
    currentIndex: number;
    submissions: SubmitResponse[];

    setQuizzes: (quizzes: Quiz[]) => void;
    addSubmission: (result: SubmitResponse) => void;
    nextQuiz: () => void;
    reset: () => void; 
}

export const useQuizStore = create<QuizState>() (
    (set) => ({
        quizzes: [],
        currentIndex: 0,
        submissions: [],

        setQuizzes: (quizzes) => set({ quizzes, currentIndex: 0, submissions: [] }),

        addSubmission: (result) => set((state) => ({ submissions: [...state.submissions, result] })),

        nextQuiz: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),

        reset: () => set({ quizzes: [], currentIndex: 0, submissions: [] }),
    })
);