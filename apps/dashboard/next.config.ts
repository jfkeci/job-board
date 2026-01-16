import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@borg/types', '@borg/ui'],
};

export default nextConfig;
