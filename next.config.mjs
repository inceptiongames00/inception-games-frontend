/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  turbopack: {
    // Ensure an absolute path is used to avoid invalid config warnings
    root: path.resolve(process.cwd()),
  },
  images: {
    domains: ["images.unsplash.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      }
    ],
    unoptimized: true
  },
};

export default nextConfig;
