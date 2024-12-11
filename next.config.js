// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,  // Ensure URLs include trailing slashes
  distDir: '.next',     // Default build folder

  // Custom headers for dynamic routes like /nested/[slug]
  async headers() {
    return [
      {
        source: '/nested/:slug*/',  // Dynamic path pattern
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
