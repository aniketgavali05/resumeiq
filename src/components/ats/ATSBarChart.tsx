'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface Props {

    data: {
        name: string;
        score: number;
    }[];

}

export default function ATSBarChart({ data }: Props) {

    return (

        <div className="h-96 w-full">

            <ResponsiveContainer width="100%" height="100%">

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis domain={[0,100]} />

                    <Tooltip />

                    <Bar
                        dataKey="score"
                        radius={[8,8,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}