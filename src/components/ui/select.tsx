
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils';

interface SelectContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean;
}

const SelectContext =
  React.createContext<SelectContextValue | null>(null);

function useSelect() {
  const ctx = React.useContext(SelectContext);

  if (!ctx) {
    throw new Error(
      'Select components must be used within Select'
    );
  }

  return ctx;
}

interface SelectProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export function Select({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  disabled = false,
}: SelectProps) {
  const [internalValue, setInternalValue] =
    useState(defaultValue);

  const [open, setOpen] =
    useState(false);

  const isControlled =
    controlledValue !== undefined;

  const value = isControlled
    ? controlledValue
    : internalValue;

  const setValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  return (
    <SelectContext.Provider
      value={{
        value,
        setValue,
        open,
        setOpen,
        disabled,
      }}
    >
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SelectTrigger({
  children,
  className,
  id,
}: SelectTriggerProps) {
  const {
    open,
    setOpen,
    disabled,
  } = useSelect();

  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3.5 py-2 text-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={() => {
        if (!disabled) {
          setOpen(!open);
        }
      }}
    >
      {children}

      <svg
        className="h-4 w-4 opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export function SelectValue({
  placeholder,
}: {
  placeholder?: string;
}) {
  const { value } = useSelect();

  return (
    <span className="truncate">
      {value ?? placeholder}
    </span>
  );
}

export function SelectContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    open,
    setOpen,
    disabled,
  } = useSelect();

  if (!open || disabled) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => setOpen(false)}
      />

      <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-premium">
        {children}
      </div>
    </>
  );
}

export function SelectItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  const {
    setValue,
    setOpen,
    disabled,
  } = useSelect();

  return (
    <div
      role="option"
      aria-selected={false}
      className={cn(
        'flex rounded-lg px-2.5 py-2 text-sm outline-none transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:bg-secondary'
      )}
      onClick={() => {
        if (disabled) {
          return;
        }

        setValue(value);
        setOpen(false);
      }}
    >
      {children}
    </div>
  );
}

