'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  Loader2
} from 'lucide-react';

import ResumeService from "@/services/resumeService";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { FadeIn } from '@/components/motion';
import { cn } from '@/utils';

export default function UploadResumePage() {

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);

    const [jobDescription, setJobDescription] = useState("");

    const [loading, setLoading] = useState(false);

    const [dragging, setDragging] = useState(false);

    const handleFile = (selected: File | null) => {

        if (!selected) return;

        setFile(selected);
    };

   async function analyzeResume() {

    if (!file) {
        alert("Please select a resume.");
        return;
    }

    if (!jobDescription.trim()) {
        alert("Please enter Job Description.");
        return;
    }

    try {

        setLoading(true);

        const result = await ResumeService.uploadResume(
            file,
            jobDescription
        );

        const resume = {

            id: result.id,

            fileName: result.originalFileName,

            role: "Uploaded Resume",

            status: "analyzed",

            isFavorite: false,

            atsScore: result.score,

            scoreLevel: result.scoreLevel,

            skillScore: result.skillScore,
            keywordScore: result.keywordScore,
            experienceScore: result.experienceScore,
            educationScore: result.educationScore,
            projectScore: result.projectScore,
            certificationScore: result.certificationScore,
            sectionScore: result.sectionScore,
            formattingScore: result.formattingScore,

            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,

            strengths: result.strengths,
            weaknesses: result.weaknesses,
            suggestions: result.suggestions

        };

        localStorage.setItem(
            "resume-analysis",
            JSON.stringify(resume)
        );

        const history =
            JSON.parse(localStorage.getItem("resume-history") || "[]");

        history.unshift({
            ...resume,
            analyzedAt: new Date().toLocaleString()
        });

        localStorage.setItem(
            "resume-history",
            JSON.stringify(history)
        );

        router.push(`/dashboard/resumes/${resume.id}/analysis`);

    } catch (error) {

        console.error(error);

        alert("Resume upload failed.");

    } finally {

        setLoading(false);

    }
}
    return (

        <>

            <PageHeader
                title="Upload Resume"
                description="Upload Resume for ATS Analysis"
            />

            <FadeIn>

                <Card className="mx-auto max-w-3xl">

                    <CardHeader>

                        <CardTitle>
                            Upload Resume
                        </CardTitle>

                        <CardDescription>
                            Upload PDF/DOCX and paste Job Description
                        </CardDescription>

                    </CardHeader>

                    <CardContent className="space-y-6">

                        <div

                            onDragOver={(e) => {

                                e.preventDefault();

                                setDragging(true);

                            }}

                            onDragLeave={() => setDragging(false)}

                            onDrop={(e) => {

                                e.preventDefault();

                                setDragging(false);

                                handleFile(
                                    e.dataTransfer.files[0]
                                );

                            }}

                            onClick={() =>
                                inputRef.current?.click()
                            }

                            className={cn(

                                "cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all",

                                dragging
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary"

                            )}

                        >

                            <UploadCloud className="mx-auto mb-4 h-10 w-10 text-primary"/>

                            {

                                file ?

                                    <>

                                        <FileText className="mx-auto mb-2 h-8 w-8 text-green-500"/>

                                        <p className="font-medium">
                                            {file.name}
                                        </p>

                                    </>

                                    :

                                    <>

                                        <p className="font-medium">
                                            Click or Drop Resume
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            PDF / DOCX
                                        </p>

                                    </>

                            }

                            <input

                                ref={inputRef}

                                type="file"

                                className="hidden"

                                accept=".pdf,.doc,.docx"

                                onChange={(e)=>

                                    handleFile(

                                        e.target.files?.[0] ?? null

                                    )

                                }

                            />

                        </div>

                        {/* UPDATED TEXTAREA */}

                        <textarea

                            rows={10}

                            value={jobDescription}

                            onChange={(e)=>

                                setJobDescription(

                                    e.target.value

                                )

                            }

                            placeholder="Paste Job Description Here..."

                            className="
                                w-full
                                rounded-xl
                                border
                                border-border
                                bg-slate-900
                                text-white
                                placeholder:text-gray-400
                                p-4
                                resize-none
                                focus:outline-none
                                focus:ring-2
                                focus:ring-primary
                            "

                        />

                        <Button

                            className="w-full"

                            disabled={loading}

                            onClick={analyzeResume}

                        >

                            {

                                loading ?

                                    <>

                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>

                                        Analyzing Resume...

                                    </>

                                    :

                                    "Analyze Resume"

                            }

                        </Button>

                    </CardContent>

                </Card>

            </FadeIn>

        </>

    );

}