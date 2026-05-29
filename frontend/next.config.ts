import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  async rewrites() {
    console.log('Using API URL:', apiUrl);
    return [{ source: '/:path*', destination: `${apiUrl}/:path*` }];
  }
};

export default nextConfig;