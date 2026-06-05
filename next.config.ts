import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
