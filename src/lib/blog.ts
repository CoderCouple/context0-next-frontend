import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import { env } from "@/env/server";

const blogDirectory = path.join(process.cwd(), "data/blog");
const authorsDirectory = path.join(process.cwd(), "data/authors");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  author: string;
  featured?: boolean;
  draft?: boolean;
  readTime?: number;
  lastmod?: string;
  canonicalUrl?: string;
  images?: string[];
}

export interface Author {
  name: string;
  avatar: string;
  occupation: string;
  company?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export interface BlogPostWithContent extends BlogPost {
  content: any;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.(md|mdx)$/, "");
        const fullPath = path.join(blogDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        // Calculate reading time
        const readTime = calculateReadingTime(content);

        return {
          slug,
          readTime,
          ...data,
        } as BlogPost;
      })
  );

  // Filter out drafts in production
  const publishedPosts = allPostsData.filter((post) => {
    if (env.NODE_ENV === "development") {
      return true;
    }
    return !post.draft;
  });

  // Sort posts by date
  return publishedPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
  try {
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);
    let fileContents: string;
    
    try {
      fileContents = fs.readFileSync(fullPath, "utf8");
    } catch {
      // Try .md extension if .mdx doesn't exist
      const mdPath = path.join(blogDirectory, `${slug}.md`);
      fileContents = fs.readFileSync(mdPath, "utf8");
    }

    const { data, content } = matter(fileContents);
    
    // Simplified MDX compilation
    const { content: mdxContent } = await compileMDX({
      source: content,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [],
          rehypePlugins: [],
        },
      },
    });

    const readTime = calculateReadingTime(content);

    return {
      slug,
      content: mdxContent,
      readTime,
      ...data,
    } as BlogPostWithContent;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    console.error("Full error details:", error);
    return null;
  }
}

export async function getAuthor(authorSlug: string): Promise<Author | null> {
  try {
    if (!fs.existsSync(authorsDirectory)) {
      return null;
    }

    const fullPath = path.join(authorsDirectory, `${authorSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return data as Author;
  } catch (error) {
    console.error(`Error reading author ${authorSlug}:`, error);
    return null;
  }
}

export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getAllCategories(posts: BlogPost[]): string[] {
  const categories = new Set<string>();
  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  return Array.from(categories).sort();
}

export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter((post) => post.tags?.includes(tag));
}

export function getPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  return posts.filter((post) => post.category === category);
}

export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.featured);
}

// Calculate reading time based on word count
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Legacy exports for backwards compatibility
export interface BlogWithSlug extends BlogPost {}
export const getAllBlogs = getAllPosts;
