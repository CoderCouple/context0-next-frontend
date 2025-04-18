import type { Metadata } from "next";

import { BlogLayout } from "@/components/blog-layout";

import { blog } from "./blog";

export const metadata: Metadata = {
  title: blog.title,
  description: blog.description,
  openGraph: {
    images: [blog.image],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BlogLayout blog={blog}>{children}</BlogLayout>;
}
