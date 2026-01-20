import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ['www.lpu.in', 'includepages.lpu.in'],
  },
  // Add the rewrites section below
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://projectsapi.lpu.in/:path*',
      },
    ];
  },
};

export default nextConfig;