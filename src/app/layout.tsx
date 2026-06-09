import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "AcuActiv Detox Challenge | Medical Detox Assessment",
  description:
    "Complete the professional detox symptom questionnaire by Dr. Shlomi Gavish DOM, AP. Assess toxic burden across 8 body systems.",
  keywords: [
    "detox",
    "AcuActiv",
    "toxic burden",
    "medical detox",
    "symptom assessment",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full overflow-x-hidden pb-12 font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
