module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,  // Ensure URLs include trailing slashes
  distDir: '.next',     // Default build folder
  async headers() {
    return [
      {
        source: '/nested/:slug*/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0,must-revalidate',
          },
        ],
      },
    ];
  },
};
