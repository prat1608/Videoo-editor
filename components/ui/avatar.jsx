"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef(function Avatar({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn("relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
});

const AvatarImage = React.forwardRef(function AvatarImage({ className, ...props }, ref) {
  return <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />;
});

const AvatarFallback = React.forwardRef(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--theme-icon-selected)]",
        className
      )}
      {...props}
    />
  );
});

function AvatarBadge({ className, ...props }) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute bottom-0 right-0 z-[1] h-2.5 w-2.5 rounded-full border-2 border-[var(--theme-background-z0,#1b1b1c)] bg-green-500",
        className
      )}
      {...props}
    />
  );
}

const AvatarGroup = React.forwardRef(function AvatarGroup({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="avatar-group"
      className={cn("inline-flex items-center justify-end [&>*+*]:-ml-2", className)}
      {...props}
    />
  );
});

const AvatarGroupCount = React.forwardRef(function AvatarGroupCount({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="avatar-group-count"
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--theme-background-z0,#1b1b1c)] bg-[var(--theme-background-z1,#2a2a2d)] text-[10px] font-semibold text-[var(--text)]",
        className
      )}
      {...props}
    />
  );
});

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
