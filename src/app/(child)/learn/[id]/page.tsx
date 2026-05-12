"use client";

import { useParams, useRouter } from "next/navigation";
import { mockContents } from "@/data/mock/contents";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface LearningPageProps {
    params: Promise<{
        id: string;
    }>;
}
export default function LearningPage() {
    const { id } = useParams();
    const router = useRouter();
    const content = mockContents.find((content) => content.id === id);
    if (!content) {
        return <div>Content not found</div>;
    }
    return (
        <div className="min-h-screen bg-white p-6 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-park-ocean text-center mb-6">{content.title}</h1>
                <div className="space-y-6">
                    {content.lessons.map((lesson) => (
                        <Card key={lesson.id} className="p-4 rouded-park border-park-sky shadow-none">
                            <div className="aspect-video bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-6xl">
                                {/* <Image>{lesson.image}</Image> */}
                            </div>
                            <p className="text-2xl text-center font-medium text-slate-700">{lesson.text}</p> 
                        </Card>
                    ))}
                </div>
                <Button className="w-full h-16 mt-8 text-xl rounded-full bg-park-sun text-slate-800 hover:bg-yellow-400 font-bold shadow-lg"
                onClick={() => router.push(`/quiz/${content.id}`)}>start quiz</Button>
            </div>
        </div>
    )
}
