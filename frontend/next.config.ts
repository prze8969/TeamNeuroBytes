import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGithubPages ? '/TeamNeuroBytes' : '');

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: 'export' } : {}),
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
