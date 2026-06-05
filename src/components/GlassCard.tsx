import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card w-full min-w-0 rounded-2xl border border-sky-200/60 p-4 shadow-lg shadow-sky-900/5 sm:p-6 md:p-8 lg:p-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
