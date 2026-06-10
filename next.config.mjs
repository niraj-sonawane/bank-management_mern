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
        destination: "https://bank-management-mern-hbeb.onrender.com/api/auth/:path*",
      },
      {
        source: "/api/bank/:path*",
        destination: "https://bank-management-mern-hbeb.onrender.com/api/bank/:path*",
      },
      {
        source: "/api/transactions/:path*",
        destination: "https://bank-management-mern-hbeb.onrender.com/api/transactions/:path*",
      },
      {
        source: "/api/transfer",
        destination: "https://bank-management-mern-hbeb.onrender.com/api/transfer",
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