import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/events',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
