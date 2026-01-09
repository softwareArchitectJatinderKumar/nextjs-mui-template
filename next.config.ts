import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
    domains: ['www.lpu.in', 'includepages.lpu.in'],
  },
};

export default nextConfig;
