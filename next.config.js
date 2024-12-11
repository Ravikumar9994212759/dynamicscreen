// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,  // Ensure URLs include trailing slashes
  distDir: '.next',     // Keep the default build folder unless necessary to change

  // Add custom headers for dynamic routes like /nested/[slug]
  async headers() {
    return [
      {
        source: '/nested/:slug*/',  // Dynamic path
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=59',  // Cache but revalidate in the background
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
