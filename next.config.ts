import type { NextConfig } from "next";

import mdx from "@next/mdx";
import createJiti from "jiti";
import { fileURLToPath } from "node:url";
import rehypePrism from "rehype-prism-plus";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/env/server"); // env validation

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
    rehypePlugins: [rehypePrism],
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  eslint: {
    ignoreDuringBuilds: false,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    mdxRs: false, // ❌ Must be false to use rehype safely
  },
  images: {
    domains: [
      "images.unsplash.com",
      "ai-saas-template-aceternity.vercel.app",
      "i.pravatar.cc",
      "img.clerk.com",
      "images.clerk.dev",
    ],
  },
};

export default withMDX(nextConfig);
