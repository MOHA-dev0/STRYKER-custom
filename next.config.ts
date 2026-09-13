import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // الـ root layout يقع تحت مقطع ديناميكي ([lang])، وهي الحالة التي يوصي فيها
  // Next باستخدام global-not-found بدل not-found لصفحة 404 موحّدة.
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
