import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@job-board/types'],
};

export default nextConfig;
