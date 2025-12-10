import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Temporarily
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily
  },
  images: {
    domains: [
      'localhost',

      // Arabhardware
      'arabhardware.net',
      'arabhardware.com',

      // Unsplash
      'images.unsplash.com',
      'plus.unsplash.com',

      // Pexels
      'images.pexels.com',

      // Pixabay
      'cdn.pixabay.com',

      // Freepik
      'img.freepik.com',

      // Pinterest
      'i.pinimg.com',

      // Wikimedia Commons
      'upload.wikimedia.org',

      // Openverse
      'ccsearch.creativecommons.org',

      // Flickr
      'live.staticflickr.com',

      // Rawpixel
      'img.rawpixel.com',

      // Canva
      'static.canva.com',

      // StockSnap.io
      'stocksnap.io',

      // Reshot
      'cdn.reshot.com'
    ],
  },
};

export default nextConfig;
