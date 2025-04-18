// app/(landing_page)/blog/how-companies-are-working-without-ai/layout.tsx
import type { Metadata } from "next";

import { BlogLayout } from "@/components/blog-layout";

import { blog } from "./blog";

export const metadata: Metadata = {
  title: blog.title,
  description: blog.description,
  openGraph: {
    images: [
      {
        url: blog.image,
        alt: blog.title,
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BlogLayout blog={blog}>{children}</BlogLayout>;
}
