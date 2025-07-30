import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{post.summary}</p>
          
          <div className="prose prose-lg max-w-none">
            <p>This is a simplified blog post page for debugging.</p>
            <p><strong>Slug:</strong> {slug}</p>
            <p><strong>Title:</strong> {post.title}</p>
            <p><strong>Date:</strong> {post.date}</p>
            <p><strong>Category:</strong> {post.category}</p>
            <p><strong>Tags:</strong> {post.tags.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}