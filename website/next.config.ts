import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BACKEND_API_URL || "http://localhost:5000/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: process.env.BACKEND_UPLOADS_URL || "http://localhost:5000/uploads/:path*",
      },
      {
        source: "/socket.io/:path*",
        destination: process.env.BACKEND_SOCKET_URL || "http://localhost:5000/socket.io/:path*",
      },
    ];
  },
};

export default nextConfig;
