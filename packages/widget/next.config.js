/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arthuremma2.github.io",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https", // Make sure to specify the protocol
        hostname: "move-flow.github.io", // Add this line to include move-flow.github.io
      },
    ],
  },
};

module.exports = nextConfig;
