'use client';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import {
  TrendingUp,
  Clock,
  FileText,
  Target,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { PageHeader } from '@/components/page-header';

import {
  FadeIn,
  AnimatedNumber,
} from '@/components/motion';

import {
  useAnalytics,
  useDashboardStats,
} from '@/hooks';

import { chartTooltipStyle } from '@/constants';

import {
  StatCardSkeleton,
  ChartSkeleton,
} from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const {
    data: analytics,
    loading: analyticsLoading,
  } = useAnalytics();

  const {
    data: dashboardStats,
    loading: dashboardLoading,
  } = useDashboardStats();

  if (
    analyticsLoading ||
    dashboardLoading ||
    !analytics ||
    !dashboardStats
  ) {
    return (
      <>
        <PageHeader
          title="Analytics"
          description="Track your application performance and trends."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <StatCardSkeleton
                key={index}
              />
            )
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>

          <ChartSkeleton />
        </div>
      </>
    );
  }

  const topMatch =
    Number(
      dashboardStats.matchPercentage
    ) || 0;

  const totalApplications =
    analytics.applicationsOverTime.reduce(
      (sum, item) =>
        sum + item.count,
      0
    );

  const stats = [
    {
      icon: TrendingUp,
      label: 'Response Rate',
      value: analytics.responseRate,
      suffix: '%',
      color: 'text-chart-1',
    },
    {
      icon: Clock,
      label: 'Avg Response Time',
      value: analytics.avgResponseTime,
      suffix: 'd',
      color: 'text-chart-3',
    },
    {
      icon: FileText,
      label: 'Total Applications',
      value: totalApplications,
      color: 'text-chart-2',
    },
    {
      icon: Target,
      label: 'Top Match',
      value: topMatch,
      suffix: '%',
      color: 'text-chart-4',
    },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Track your application performance and trends."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(
          (stat, index) => (
            <FadeIn
              key={stat.label}
              delay={Math.min(
                index * 0.05,
                0.3
              )}
            >
              <Card className="rounded-2xl border-border/60 transition-all hover:shadow-soft">
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon
                      className={`h-5 w-5 ${stat.color}`}
                    />
                  </div>

                  <div className="mt-4">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      className="font-display text-2xl font-bold tabular-nums"
                    />

                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          )
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>
                Applications Over Time
              </CardTitle>

              <CardDescription>
                Weekly application volume
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <BarChart
                  data={
                    analytics.applicationsOverTime
                  }
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={
                      chartTooltipStyle
                    }
                    cursor={{
                      fill: 'hsl(var(--muted))',
                      opacity: 0.4,
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="hsl(var(--chart-1))"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn
          delay={Math.min(
            1 * 0.05,
            0.3
          )}
        >
          <Card className="h-full rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle>
                Status Distribution
              </CardTitle>

              <CardDescription>
                Application outcomes
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <PieChart>
                  <Pie
                    data={
                      analytics.statusBreakdown
                    }
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {analytics.statusBreakdown.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.fill}
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={
                      chartTooltipStyle
                    }
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize:
                        '0.8125rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn className="mt-6">
        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle>
              Top Companies
            </CardTitle>

            <CardDescription>
              Where you have applied the most
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={280}
            >
              <BarChart
                data={
                  analytics.topCompanies
                }
                layout="vertical"
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  dataKey="company"
                  type="category"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />

                <Tooltip
                  contentStyle={
                    chartTooltipStyle
                  }
                  cursor={{
                    fill: 'hsl(var(--muted))',
                    opacity: 0.4,
                  }}
                />

                <Bar
                  dataKey="applications"
                  fill="hsl(var(--chart-2))"
                  radius={[
                    0,
                    6,
                    6,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </FadeIn>
    </>
  );
}