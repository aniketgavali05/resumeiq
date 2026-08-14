'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { FadeIn, AnimatedProgress } from '@/components/motion';
import { useSkillGaps } from '@/hooks';
import { chartTooltipStyle } from '@/constants';
import { ChartSkeleton, CardSkeleton } from '@/components/ui/skeleton';

export default function SkillsPage() {
  const { data: skills, loading } = useSkillGaps();

  if (loading || !skills) {
    return (
      <>
        <PageHeader title="Skills" description="Identify gaps and leverage your strengths." />
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartSkeleton />
          <CardSkeleton />
        </div>
      </>
    );
  }

  const chartData = skills.map((s) => ({
    skill: s.skill,
    current: s.currentLevel,
    required: s.requiredLevel,
  }));

  const gaps = skills.filter((s) => s.currentLevel < s.requiredLevel);
  const strengths = skills.filter((s) => s.currentLevel >= s.requiredLevel);

  return (
    <>
      <PageHeader title="Skills" description="Identify gaps and leverage your strengths." />

      <FadeIn>
        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle>Current vs Required Levels</CardTitle>
            <CardDescription>Your skill levels compared to job requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
                <Bar dataKey="current" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="required" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <FadeIn>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>Skill Gaps</CardTitle>
              <CardDescription>Skills that need improvement</CardDescription>
            </CardHeader>
            <CardContent>
              {gaps.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No skill gaps detected. Great job!</p>
              ) : (
                <div className="space-y-4">
                  {gaps.map((s, i) => (
                    <div key={s.skill}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-sm font-medium">{s.skill}</span>
                        <Badge variant="warning">{s.currentLevel}/{s.requiredLevel}</Badge>
                      </div>
                      <AnimatedProgress value={s.currentLevel} indicatorClassName="bg-warning" delay={Math.min(i * 0.05, 0.3)} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={Math.min(1 * 0.05, 0.3)}>
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>Strengths</CardTitle>
              <CardDescription>Skills at or above required level</CardDescription>
            </CardHeader>
            <CardContent>
              {strengths.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No strengths identified yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {strengths.map((s) => (
                    <div key={s.skill} className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-3 py-2">
                      <span className="text-sm font-medium">{s.skill}</span>
                      <Badge variant="success">{s.currentLevel}%</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </>
  );
}
