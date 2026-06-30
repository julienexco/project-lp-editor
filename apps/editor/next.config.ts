import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lp-studio/blocks', '@lp-studio/tokens', '@lp-studio/types', '@lp-studio/registry'],
}

export default nextConfig
