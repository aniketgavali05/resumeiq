'use client';

import {

    ResponsiveContainer,

    RadarChart,

    PolarGrid,

    PolarAngleAxis,

    Radar

} from "recharts";

interface Props {

    data: {

        subject: string;

        score: number;

    }[];

}

export default function ATSRadarChart({

    data

}: Props) {

    return (

        <div className="h-96 w-full">

            <ResponsiveContainer>

                <RadarChart data={data}>

                    <PolarGrid />

                    <PolarAngleAxis dataKey="subject" />

                    <Radar

                        dataKey="score"

                        fillOpacity={0.5}

                    />

                </RadarChart>

            </ResponsiveContainer>

        </div>

    );

}