// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // basePath: '/dynamic',
  swcMinify: true,
  trailingSlash: true, // Ensures static HTML generation works for all routes
  output: 'export',    // Export to static HTML files
  distDir: 'build',    // Output the build to the 'build' directory
};

module.exports = nextConfig;
