import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@job-board/types", "@job-board/ui"],
};

export default nextConfig;
