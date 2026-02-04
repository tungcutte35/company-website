import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================
  // 🖼️ IMAGE OPTIMIZATION
  // ============================================
  images: {
    // Fix configured quality warning
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    qualities: [75, 85], 
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ============================================
  // 📦 BUNDLE OPTIMIZATION
  // ============================================
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false, // Updated to false for Performance
  
  // Remove console.* in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  turbopack: {}, // Compatibility for Next.js 16

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'antd',
      'lodash',
      'framer-motion',
      'clsx', 
      'tailwind-merge',
      'gsap',  // Added for Performance optimization
    ],
    // turbo: {
    //   rules: {
    //     '*.svg': {
    //       loaders: ['@svgr/webpack'],
    //       as: '*.js',
    //     },
    //   },
    // },
  },

  async headers() {
    // NOTE: Temporarily removing noindex for Lighthouse testing
    // Uncomment the isProduction check when deploying to production
    // const isProduction = process.env.VERCEL_ENV === 'production';
    
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // X-Robots-Tag temporarily removed for Lighthouse testing
        ],
      },
      // Static asset caching for performance
      {
        source: "/(.*)\\.(js|css|woff|woff2|ttf|otf|ico|png|jpg|jpeg|gif|svg|webp|avif)$",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Allow indexing for all public pages (testing mode)
      {
        source: "/((?!admin|api).*)",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
      // Chặn indexing admin và API
      {
        source: "/(admin|api)(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
