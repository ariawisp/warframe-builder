import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
