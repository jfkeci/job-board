import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@borg/types'],
};

export default nextConfig;
