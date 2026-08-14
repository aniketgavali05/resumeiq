'use client';

import { motion } from "framer-motion";

interface ProgressBarProps {

    title: string;

    value: number;

}

export default function ProgressBar({

    title,
    value

}: ProgressBarProps) {

    const getColor = () => {

        if (value >= 90)
            return "bg-green-500";

        if (value >= 75)
            return "bg-blue-500";

        if (value >= 60)
            return "bg-yellow-500";

        return "bg-red-500";
    };

    return (

        <div className="space-y-2">

            <div className="flex items-center justify-between">

                <span className="font-medium">

                    {title}

                </span>

                <span className="text-sm font-semibold text-muted-foreground">

                    {value}%

                </span>

            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">

                <motion.div

                    initial={{ width: 0 }}

                    animate={{

                        width: `${value}%`

                    }}

                    transition={{

                        duration: 1.2

                    }}

                    className={`h-full rounded-full ${getColor()}`}

                />

            </div>

        </div>

    );

}