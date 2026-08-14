'use client';

import { motion } from "framer-motion";

interface ATSGaugeProps {
    score: number;
    level: string;
}

export default function ATSGauge({

    score,
    level

}: ATSGaugeProps) {

    const radius = 95;

    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset =
        circumference -
        (score / 100) * circumference;

    function getColor() {

        if (score >= 90)
            return "#22c55e";

        if (score >= 75)
            return "#3b82f6";

        if (score >= 60)
            return "#f59e0b";

        return "#ef4444";
    }

    return (

        <div className="flex flex-col items-center">

            <div className="relative">

                <svg
                    width="250"
                    height="250"
                >

                    <defs>

                        <filter id="glow">

                            <feGaussianBlur
                                stdDeviation="5"
                                result="blur"
                            />

                            <feMerge>

                                <feMergeNode in="blur"/>

                                <feMergeNode in="SourceGraphic"/>

                            </feMerge>

                        </filter>

                    </defs>

                    <circle
                        cx="125"
                        cy="125"
                        r={radius}
                        stroke="#2a2a2a"
                        strokeWidth="16"
                        fill="none"
                    />

                    <motion.circle

                        cx="125"
                        cy="125"
                        r={radius}

                        stroke={getColor()}

                        strokeWidth="16"

                        fill="none"

                        strokeLinecap="round"

                        filter="url(#glow)"

                        strokeDasharray={circumference}

                        initial={{

                            strokeDashoffset: circumference

                        }}

                        animate={{

                            strokeDashoffset

                        }}

                        transition={{

                            duration: 2

                        }}

                        transform="rotate(-90 125 125)"

                    />

                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                    <motion.h1

                        initial={{ scale: 0 }}

                        animate={{ scale: 1 }}

                        transition={{

                            duration: .8

                        }}

                        className="text-6xl font-bold"

                    >

                        {score}

                    </motion.h1>

                    <p className="mt-2 text-lg text-muted-foreground">

                        ATS Score

                    </p>

                    <span

                        className="mt-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary"

                    >

                        {level}

                    </span>

                </div>

            </div>

        </div>

    );

}