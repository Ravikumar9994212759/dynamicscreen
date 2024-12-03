/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true, 
  // basePath: '/dynamic', // Uncomment if you're deploying to a sub-path
  // output: 'standalone',  // Comment out if not needed
  distDir: '.next',       // Keep the default build folder unless necessary to change
};

module.exports = nextConfig;
