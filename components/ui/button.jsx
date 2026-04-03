"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-medium transition-all duration-200 outline-none ring-offset-transparent focus-visible:ring-2 focus-visible:ring-white/12 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-[rgba(104,109,182,0.38)] bg-[var(--primary)] text-[#fafafa] hover:bg-[var(--primary-hover)]",
        secondary:
          "border border-[var(--border)] bg-[var(--theme-background-z1)] text-[var(--text)] hover:bg-[var(--theme-icon-bg)]",
        ghost:
          "border border-transparent bg-transparent text-[var(--theme-icon-unselected)] hover:border-[var(--border)] hover:bg-[var(--theme-icon-bg)] hover:text-[var(--theme-icon-hover)]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--theme-icon-bg)]",
        surface:
          "border border-[var(--border)] bg-[var(--panel-strong)] text-[var(--text)] hover:bg-[var(--theme-icon-bg)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-[10px] px-3",
        lg: "h-11 rounded-[14px] px-5",
        icon: "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
