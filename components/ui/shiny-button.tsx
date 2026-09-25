import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type ShinyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

type ElementWithClassName = ReactElement<{ className?: string }>;

export function ShinyButton({ asChild = false, children, className, ...props }: ShinyButtonProps) {
  if (asChild && isValidElement(children)) {
    const child = children as ElementWithClassName;
    return cloneElement(child, {
      className: cn("shiny-button", child.props.className, className),
    });
  }

  return (
    <button className={cn("shiny-button", className)} {...props}>
      {children}
    </button>
  );
}
