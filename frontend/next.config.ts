import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGithubPages ? '/TeamNeuroBytes' : '');

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: 'export' } : {}),
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: isGithubPages ? true : false,
};

export default withNextIntl(nextConfig);
