'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils';

type AuroraVariant = 'subtle' | 'bold';

const variantStyles: Record<AuroraVariant, string> = { subtle: 'opacity-[0.15]', bold: 'opacity-[0.25]' };

export function AuroraBackground({ children, className, variant = 'subtle' }: { children?: React.ReactNode; className?: string; variant?: AuroraVariant }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <div className={cn('pointer-events-none absolute inset-0 -z-10', variantStyles[variant])} aria-hidden="true">
        <motion.div className="absolute -top-1/2 left-[-10%] h-[60%] w-[50%] rounded-full blur-[100px]" style={{ background: 'hsl(var(--aurora-1))' }} animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute top-[-20%] right-[-10%] h-[55%] w-[45%] rounded-full blur-[100px]" style={{ background: 'hsl(var(--aurora-2))' }} animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-[-30%] left-[30%] h-[50%] w-[40%] rounded-full blur-[100px]" style={{ background: 'hsl(var(--aurora-3))' }} animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      </div>
      {children}
    </div>
  );
}
