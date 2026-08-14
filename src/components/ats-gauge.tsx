'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils';

export function ATSGauge({ score, className }: { score: number; className?: string }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference * 0.75;
  const color = clampedScore >= 80 ? 'hsl(var(--success))' : clampedScore >= 60 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))';
  return (
    <div className={cn('relative flex h-32 w-32 items-center justify-center', className)}>
      <svg className="h-full w-full -rotate-[135deg]" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${circumference * 0.75} ${circumference}`} />
        <motion.circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${circumference * 0.75} ${circumference}`} initial={{ strokeDashoffset: circumference }} whileInView={{ strokeDashoffset }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold tabular-nums">{clampedScore}</span>
        <span className="text-xs text-muted-foreground">ATS Score</span>
      </div>
    </div>
  );
}
