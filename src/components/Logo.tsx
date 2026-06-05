import Link from "next/link";
import headerLogo from "@/assets/acuactiv-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  linkToHome?: boolean;
}

export function Logo({ className, linkToHome = true }: LogoProps) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- static import gets a content-hashed URL on each build
    <img
      src={headerLogo.src}
      alt="AcuActiv"
      width={headerLogo.width}
      height={headerLogo.height}
      className={cn("h-9 w-auto sm:h-11 md:h-12", className)}
      decoding="async"
    />
  );

  if (!linkToHome) return img;

  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      {img}
    </Link>
  );
}
