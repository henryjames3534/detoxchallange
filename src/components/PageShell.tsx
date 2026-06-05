import { Header } from "./Header";
import { Footer } from "./Footer";
import { WaveDivider } from "./WaveDivider";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  showWave?: boolean;
  wide?: boolean;
}

export function PageShell({
  children,
  showWave = true,
  wide = false,
}: PageShellProps) {
  return (
    <div className="page-bg flex min-h-screen min-h-[100dvh] flex-col">
      <Header />
      <main className="flex flex-1 justify-center px-3 py-8 sm:px-6 sm:py-12 md:px-8 lg:py-16">
        <div
          className={cn(
            "w-full min-w-0",
            wide ? "max-w-5xl" : "max-w-3xl",
          )}
        >
          {children}
        </div>
      </main>
      {showWave && <WaveDivider />}
      <Footer />
    </div>
  );
}
