import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShinyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

type ElementWithClassName = ReactElement<{ className?: string; children?: ReactNode }>;

export function ShinyButton({ asChild = false, children, className, ...props }: ShinyButtonProps) {
  if (asChild && isValidElement(children)) {
    const child = children as ElementWithClassName;
    return cloneElement(child, {
      className: cn("shiny-button", child.props.className, className),
      children: <span className="shiny-button-content">{child.props.children}</span>,
    });
  }

  return (
    <button className={cn("shiny-button", className)} {...props}>
      <span className="shiny-button-content">{children}</span>
    </button>
  );
}
