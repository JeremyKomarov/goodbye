import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The OG images read this font from disk at runtime.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/**"],
    "/r/[slug]/opengraph-image": ["./assets/**"],
  },
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
