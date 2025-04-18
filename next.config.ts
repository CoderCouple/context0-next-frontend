import type { NextConfig } from "next";

import mdx from "@next/mdx";
import createJiti from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));

// Import server-side env early
jiti("./src/env/server");

const baseConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  eslint: {
    ignoreDuringBuilds: false,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    mdxRs: true, // enables Rust-based MDX loader for App Router
  },
  images: {
    domains: [
      "images.unsplash.com", // remove all this once you have your own images`
      "ai-saas-template-aceternity.vercel.app", // also used in openGraph
      "i.pravatar.cc", // ✅ Add this line
    ],
  },
};

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
  },
});

const finalConfig = withMDX(baseConfig);

export default finalConfig;
