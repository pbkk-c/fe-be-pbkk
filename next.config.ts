// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/xenotimes",
  assetPrefix: "/xenotimes",
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true,
    domains: [
      "senopati.its.ac.id",
      "abcnews.go.com",
      "cdn.cnn.com",
      "assets.bbc.com",
      "upload.wikimedia.org",
      "images.unsplash.com",
      "static01.nyt.com",
      "placekitten.com",
      "picsum.photos",
    ],
  },
};

module.exports = nextConfig;
