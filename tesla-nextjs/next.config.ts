import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Сайтын бүх хуудас статик тул Cache Components шаардлагагүй.
  // Унтраасан үед app/models/[slug]/page.tsx-ийн `dynamicParams = false` ажиллаж, байхгүй загварт 404 буцаана.
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
