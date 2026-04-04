import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./prisma/dev.db'],
      '/api/*': ['./prisma/dev.db'],
      '/companies': ['./prisma/dev.db'],
      '/companies/*': ['./prisma/dev.db'],
      '/sectors': ['./prisma/dev.db'],
      '/sectors/*': ['./prisma/dev.db'],
      '/rankings': ['./prisma/dev.db'],
      '/reports': ['./prisma/dev.db'],
      '/risk-insights': ['./prisma/dev.db'],
      '/compare': ['./prisma/dev.db'],
      '/admin': ['./prisma/dev.db'],
      '/admin/*': ['./prisma/dev.db'],
    },
  },
};

export default nextConfig;
