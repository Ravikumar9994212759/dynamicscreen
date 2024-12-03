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
  trailingSlash: true, 
  output: 'standalone',
  distDir: 'build',    
};

module.exports = nextConfig;
