/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static exports for SPA
  output: 'export',
  // Add trailing slash to all paths
  trailingSlash: true,
  // Disable image optimization
  images: {
    unoptimized: true,
    disableStaticImages: true
  },
  // No environment variables needed
  // Remove basePath to use root path
  assetPrefix: '.',
  // Custom webpack configuration
  webpack: (config, { isServer }) => {
    // Add file-loader for JSON files
    config.module.rules.push({
      test: /\.(json)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[name][ext]',
      },
    });
    
    // Important: return the modified config
    return config;
    // Add any custom webpack configurations here
    return config;
  },
};

module.exports = nextConfig;
