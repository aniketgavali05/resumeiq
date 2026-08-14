'use client';

import React, { useState } from 'react';
import { cn } from '@/utils';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext =
  React.createContext<TabsContextValue | null>(null);

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  children,
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const isControlled = controlledValue !== undefined;

  const value = isControlled
    ? controlledValue
    : internalValue;

  const setValue = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }

    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);

  if (!ctx) {
    throw new Error(
      'TabsTrigger must be used within Tabs',
    );
  }

  const active = ctx.value === value;

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'bg-background text-foreground shadow-soft'
          : 'hover:text-foreground',
        className,
      )}
      onClick={() => ctx.setValue(value)}
      aria-selected={active}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);

  if (!ctx) {
    throw new Error(
      'TabsContent must be used within Tabs',
    );
  }

  if (ctx.value !== value) {
    return null;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}