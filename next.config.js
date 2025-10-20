/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add basePath if your app is not served from the root
  // basePath: '/smart-farm-web',
  // Enable static exports for SPA
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Configure image optimization
  images: {
    unoptimized: true,
  },
  // Add environment variables that should be available at build time
  env: {
    PUBLIC_URL: process.env.PUBLIC_URL || '',
  },
  // Custom webpack configuration
  webpack: (config) => {
    // Add any custom webpack configurations here
    return config;
  },
};

module.exports = nextConfig;
