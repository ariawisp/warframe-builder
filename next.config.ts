import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  images: {
    loader: 'custom',
    loaderFile: './src/util/imageLoader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/WFCD/warframe-items/master/data/img/**'
      }
    ]
  }
}

export default nextConfig
