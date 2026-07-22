import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages(プロジェクトページ)への静的デプロイ用
  output: "export",
  basePath: "/kinetic-instrument",
  images: { unoptimized: true },
};

export default nextConfig;
