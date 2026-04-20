import * as React from "react";
import { cn } from "@/lib/utils";

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "flat" | "deep";
  hover?: boolean;
  as?: React.ElementType;
};

export function Panel({
  className,
  variant = "default",
  hover = false,
  as: Tag = "div",
  ...props
}: PanelProps) {
  const base =
    variant === "deep" ? "panel-deep" : variant === "flat" ? "panel-flat" : "panel";
  return (
    <Tag
      className={cn(base, hover && variant !== "deep" && "panel-hover", className)}
      {...props}
    />
  );
}
