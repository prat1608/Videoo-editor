"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[12px] border border-[var(--border)] bg-[var(--theme-background-z1)] px-3 text-sm text-[var(--text)] shadow-none outline-none transition-colors placeholder:text-[var(--text-dim)] focus-visible:border-white/12 focus-visible:ring-2 focus-visible:ring-white/10 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

export { Input };
