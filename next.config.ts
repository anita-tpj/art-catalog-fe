
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "creativeatlas.co",
          },
        ],
        destination: "https://artcatalog.creativeatlas.co/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
