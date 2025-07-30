import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found | Context0 Blog",
    };
  }

  return {
    title: `${post.title} | Context0 Blog`,
    description: post.summary,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Simple function to get post content without MDX compilation
async function getPostContent(slug: string) {
  try {
    const blogDirectory = path.join(process.cwd(), "data/blog");
    const fullPath = path.join(blogDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    
    return {
      frontmatter: data,
      content: content
    };
  } catch (error) {
    console.error("Error reading post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const postContent = await getPostContent(slug);
  
  // Convert markdown content to simple HTML (basic conversion)
  const htmlContent = `${postContent?.content
    .replace(/^# (.+)/gm, "<h1 class=\"text-3xl font-bold mt-8 mb-4\">$1</h1>")
    .replace(/^## (.+)/gm, "<h2 class=\"text-2xl font-semibold mt-6 mb-3\">$1</h2>")
    .replace(/^### (.+)/gm, "<h3 class=\"text-xl font-medium mt-4 mb-2\">$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^\- (.+)/gm, "<li class=\"ml-4\">• $1</li>")
    .replace(/\n\n/g, "</p><p class=\"mb-4\">")
    .replace(/^(?!<[hli])/gm, "<p class=\"mb-4\">")}</p>`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-muted/30 pt-24">
        <div className="container mx-auto px-4 py-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{post.category}</Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground ml-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(parseISO(post.date), "MMMM d, yyyy")}
                </span>
                {post.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime} min read
                  </span>
                )}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight mb-4 lg:text-5xl">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {post.summary}
            </p>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium">C</span>
              </div>
              <div>
                <p className="font-medium">Context0 Team</p>
                <p className="text-sm text-muted-foreground">Product Team</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 border-b" />

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
              className="space-y-4"
            />
          </article>
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">
              Transform your workflow automation with Context0. Create your first workflow today.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/workflow">Create Workflow</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/onboarding">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}