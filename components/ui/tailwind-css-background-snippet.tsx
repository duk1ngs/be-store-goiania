import { cn } from "@/lib/utils";

type HeroProps = {
  className?: string;
};

export const Hero = ({ className }: HeroProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-screen w-full overflow-hidden",
        className,
      )}
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#202020_0%,#0a0a0a_46%,#000_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-white/[0.035] blur-3xl" />
      </div>
    </div>
  );
};
