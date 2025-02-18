import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['yourdomain.com'],
    path: '/_next/image',
    loader: 'default',
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  staticPageGenerationTimeout: 120,
  transpilePackages: ['next-mdx-remote'],
}

export default bundleAnalyzer(nextConfig)
