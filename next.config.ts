import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa');

const nextConfig: NextConfig = {
  // Enable typed routes
  typedRoutes: true,
  
  // Enable static export for Firebase Hosting
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // PWA configuration for production
  ...(process.env.NODE_ENV === 'production' && {
    ...withPWA({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: false,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/firestore\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'firestore-cache',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
          },
        },
        {
          urlPattern: /^https:\/\/firebase\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'firebase-cache',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 24 * 60 * 60, // 24 hours
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            },
          },
        },
      ],
    }),
  }),

  // Image configuration
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Performance optimizations
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
