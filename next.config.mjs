import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:5000/api/auth/:path*",
      },
      {
        source: "/api/bank/:path*",
        destination: "http://localhost:5000/api/bank/:path*",
      },
      {
        source: "/api/transactions/:path*",
        destination: "http://localhost:5000/api/transactions/:path*",
      },
      {
        source: "/api/transfer",
        destination: "http://localhost:5000/api/transfer",
      },
    ];
  },
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "jsm-x9",
    project: "javascript-nextjs",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);