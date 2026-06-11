import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include HTML email templates in Vercel serverless bundles (readFileSync paths).
  outputFileTracingIncludes: {
    "/api/**/*": ["./email-templates/**/*"],
    "/portal/**/*": ["./email-templates/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/callenge-question",
        destination: "/challenge",
        permanent: true,
      },
      {
        source: "/result/:total",
        destination: "/results",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
