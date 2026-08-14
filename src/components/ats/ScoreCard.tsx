'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface ScoreCardProps {

    title: string;

    score: number;

}

export default function ScoreCard({

    title,
    score

}: ScoreCardProps) {

    function getColor() {

        if (score >= 90)
            return "bg-green-500";

        if (score >= 75)
            return "bg-blue-500";

        if (score >= 60)
            return "bg-yellow-500";

        return "bg-red-500";

    }

    function getLevel() {

        if (score >= 90)
            return "Excellent";

        if (score >= 75)
            return "Good";

        if (score >= 60)
            return "Average";

        return "Needs Improvement";

    }

    return (

        <motion.div

            whileHover={{

                y: -6,
                scale: 1.03

            }}

            transition={{

                duration: .25

            }}

        >

            <Card className="rounded-2xl border bg-card/70 backdrop-blur-md shadow-lg p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            {title}

                        </p>

                        <h2 className="mt-2 text-4xl font-bold">

                            {score}%

                        </h2>

                    </div>

                    <div

                        className={`h-5 w-5 rounded-full ${getColor()}`}

                    />

                </div>

                <div className="mt-6">

                    <div className="h-3 rounded-full bg-muted overflow-hidden">

                        <motion.div

                            className={`h-3 ${getColor()}`}

                            initial={{ width: 0 }}

                            animate={{

                                width: `${score}%`

                            }}

                            transition={{

                                duration: 1

                            }}

                        />

                    </div>

                </div>

                <p className="mt-4 text-sm font-medium text-primary">

                    {getLevel()}

                </p>

            </Card>

        </motion.div>

    );

}