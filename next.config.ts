import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/checkout',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [new URL('https://fakestoreapi.com/img/**')],
  },
}

export default nextConfig
