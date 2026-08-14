'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

export function AnimatedNumber({ value, className, suffix, prefix, duration = 1.2 }: { value: number; className?: string; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });

  useEffect(() => { if (inView) mv.set(value); }, [inView, value, mv]);
  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) {
        const isDecimal = !Number.isInteger(value);
        const display = isDecimal ? latest.toFixed(1) : Math.round(latest);
        ref.current.textContent = `${prefix ?? ''}${display}${suffix ?? ''}`;
      }
    });
  }, [spring, suffix, prefix, value]);

  return <span ref={ref} className={cn('tabular-nums', className)}>{prefix}0{suffix}</span>;
}

export function FadeIn({ children, delay = 0, y = 16, className, once = true }: { children: React.ReactNode; delay?: number; y?: number; className?: string; once?: boolean }) {
  return <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once, margin: '-60px' }} transition={{ duration: 0.5, delay, ease: EASE }} className={className}>{children}</motion.div>;
}

export function Stagger({ children, className, stagger = 0.08 }: { children: React.ReactNode; className?: string; stagger?: number }) {
  return <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }} className={className}>{children}</motion.div>;
}

export function StaggerItem({ children, className, y = 16 }: { children: React.ReactNode; className?: string; y?: number }) {
  return <motion.div variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }} className={className}>{children}</motion.div>;
}

export function AnimatedProgress({ value, className, indicatorClassName, delay = 0.2 }: { value: number; className?: string; indicatorClassName?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}>
      <motion.div className={cn('h-full rounded-full bg-primary', indicatorClassName)} initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : { width: 0 }} transition={{ duration: 1, delay, ease: EASE }} />
    </div>
  );
}
