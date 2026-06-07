/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  // Set basePath only in production for GitHub Pages project-page deployment.
  // Remove this once the repo is renamed to AadithS13.github.io.
  basePath: isProd ? "/AadithS.github.io" : "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
