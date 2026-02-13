import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: [
      'via.placeholder.com',
      'source.unsplash.com',
      'picsum.photos',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ]
  },
};

export default nextConfig;
