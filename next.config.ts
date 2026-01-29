import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,
  
  async headers() {
    const isProduction = process.env.VERCEL_ENV === 'production';
    
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Chỉ cho phép indexing trên production
          ...(isProduction ? [] : [
            { key: "X-Robots-Tag", value: "noindex, nofollow" }
          ]),
        ],
      },
      // Cho phép indexing các trang public trên production
      ...(isProduction ? [
        {
          source: "/((?!admin|api).*)",
          headers: [
            { key: "X-Robots-Tag", value: "index, follow" },
          ],
        },
      ] : []),
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
