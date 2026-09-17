import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // الـ root layout يقع تحت مقطع ديناميكي ([lang])، وهي الحالة التي يوصي فيها
  // Next باستخدام global-not-found بدل not-found لصفحة 404 موحّدة.
  experimental: {
    globalNotFound: true,
  },
  images: {
    /*
     * AVIF أولاً وWebP احتياطاً: صور الفعاليات في `public/photo` ملتقطة
     * بالهاتف، وإعادة ترميزها تقصّ حجمها إلى ما دون نصفه عند الجودة نفسها.
     * الترتيب مهم — Next يأخذ أول صيغة يقبلها ترويسة `Accept`.
     */
    formats: ["image/avif", "image/webp"],
    /*
     * قائمة الجودات المسموح بها. 75 هو الافتراضي لكل صور الموقع، و50 للخلفية
     * المموّهة في معرض الفعاليات وحدها — لا يُطلب من Next غيرهما.
     */
    qualities: [50, 75],
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
