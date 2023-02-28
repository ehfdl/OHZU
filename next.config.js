/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "mblogthumb-phinf.pstatic.net"],
  },
};
const WithImages = require("next-images");

module.exports = WithImages();
module.exports = nextConfig;
module.exports = {
  images: {
    domains: ["firebasestorage.googleapis.com", "mblogthumb-phinf.pstatic.net"],
  },
};
