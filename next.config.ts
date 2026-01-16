import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production optimizations */
  reactStrictMode: true,
  
  /* Image optimization */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  /* Environment variables */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1',
  },

  /* Output configuration */
  output: 'standalone', // For Docker deployments
  
  /* Compression */
  compress: true,

  /* Experimental features */
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'lucide-react'],
  },

  /* Turbopack configuration */
  turbopack: {},

  /* Webpack configuration */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
