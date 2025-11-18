// components/ui/Card.jsx
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef(function Card(
  { as: Component = "div", className, children, ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn(
        "rounded-3xl border border-slate-100 bg-white p-5 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Card;