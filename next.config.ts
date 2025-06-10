import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.themealdb.com'],
  },
}

export default nextConfig;
