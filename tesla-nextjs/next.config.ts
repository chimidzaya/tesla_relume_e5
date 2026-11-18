import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components унтраалттай. Загваруудын мэдээлэл Supabase-ээс ирдэг бөгөөд
  // хуудсууд ISR-ээр (revalidate = 60) статикаар үүсч, 60 секунд тутам шинэчлэгдэнэ.
  images: {
    // Admin-аас хуулсан зургууд Supabase Storage-ийн `model-images` bucket-д хадгалагдана.
    remotePatterns: [new URL("https://emnshrpreieiuzrqvbhj.supabase.co/storage/v1/object/public/model-images/**")],
  },
  experimental: {
    serverActions: {
      // Admin маягтаар 4MB хүртэлх зураг хуулахад (анхдагч хязгаар 1MB).
      bodySizeLimit: "5mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
