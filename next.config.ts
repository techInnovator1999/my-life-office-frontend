import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production optimizations */
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  
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
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Environment variables - validated at build time */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1',
  },

  /* Output configuration */
  output: 'standalone', // For Docker deployments
  
  /* Compression */
  compress: true,

  /* TypeScript configuration */
  typescript: {
    // Don't fail build on TypeScript errors in production (set to false for strict checking)
    ignoreBuildErrors: false,
  },

  /* Headers for security */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },

  /* Experimental features */
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'lucide-react', '@radix-ui/react-label', '@radix-ui/react-slot'],
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
