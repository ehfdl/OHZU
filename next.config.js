// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

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

module.exports = withSentryConfig(
  module.exports,
  { silent: true },
  { hideSourcemaps: true },
);
