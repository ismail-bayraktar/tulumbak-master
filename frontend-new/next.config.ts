import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4001',
        pathname: '/assets/**',
      },
      // Alternative: Use 127.0.0.1 instead of localhost
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4001',
        pathname: '/assets/**',
      },
    ],
    // Development: Allow SVG files
    dangerouslyAllowSVG: true,
    /**
     * CRITICAL FIX for Next.js 16 Private IP Blocking
     *
     * Problem: Next.js 16 blocks localhost/127.0.0.1 as "private IP"
     * Error: "upstream image resolved to private ip"
     *
     * Solution: Disable image optimization in development
     * - Development: unoptimized = true (images load directly)
     * - Production: unoptimized = false (Next.js optimizes images)
     *
     * Note: In production, use proper domain (not localhost)
     */
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
