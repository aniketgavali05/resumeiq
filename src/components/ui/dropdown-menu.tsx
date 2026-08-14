'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';

interface DropdownMenuContextValue { open: boolean; setOpen: (open: boolean) => void; }
const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);
function useDropdownMenu() {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error('DropdownMenu components must be used within DropdownMenu');
  return ctx;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <DropdownMenuContext.Provider value={{ open, setOpen }}><div className="relative inline-block">{children}</div></DropdownMenuContext.Provider>;
}

export function DropdownMenuTrigger({ children }: { children: React.ReactElement }) {
  const { open, setOpen } = useDropdownMenu();
  return <div onClick={() => setOpen(!open)}>{children}</div>;
}

export function DropdownMenuContent({ children, align = 'start' }: { children: React.ReactNode; align?: 'start' | 'end' }) {
  const { open, setOpen } = useDropdownMenu();
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      <div className={cn('absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-premium', align === 'end' ? 'right-0' : 'left-0')}>{children}</div>
    </>
  );
}

export function DropdownMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useDropdownMenu();
  return <div className={cn('flex cursor-pointer items-center rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-secondary', className)} onClick={() => setOpen(false)} {...props}>{children}</div>;
}
