"use client";

import { cn } from "@/lib/utils";

function ButtonGroup({ className, ...props }) {
  return <div role="group" className={cn("inline-flex items-stretch", className)} {...props} />;
}

export { ButtonGroup };
