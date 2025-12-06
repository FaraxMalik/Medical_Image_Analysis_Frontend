/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['huggingface.co'],
  },
  async rewrites() {
    // Only add rewrites if API URL is configured
    if (process.env.NEXT_PUBLIC_CT_SCAN_API) {
      return [
        {
          source: '/api/ct-scan/:path*',
          destination: `${process.env.NEXT_PUBLIC_CT_SCAN_API}/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
