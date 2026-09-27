/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Allow cross-origin requests to Pioneer Platform backend during dev
  async rewrites() {
    return [];
  },
};

export default nextConfig;
