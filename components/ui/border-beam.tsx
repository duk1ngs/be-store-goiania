import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BorderBeamStyle = CSSProperties & {
  "--beam-duration"?: string;
  "--beam-size"?: string;
};

interface BorderBeamProps extends HTMLAttributes<HTMLSpanElement> {
  duration?: number;
  size?: number;
}

export function BorderBeam({ className, duration = 4.8, size = 34, style, ...props }: BorderBeamProps) {
  const beamStyle: BorderBeamStyle = {
    "--beam-duration": `${duration}s`,
    "--beam-size": `${size}%`,
    ...style,
  };

  return <span aria-hidden="true" className={cn("border-beam", className)} style={beamStyle} {...props} />;
}
