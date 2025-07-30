import { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, ArrowRight, Tag, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllPosts, getAllTags, getAllCategories, getFeaturedPosts, type BlogPost } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Context0 - Workflow Automation Insights",
  description: "Discover the latest tips, tutorials, and insights about workflow automation, productivity, and Context0 features.",
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const featuredPosts = getFeaturedPosts(allPosts);
  const regularPosts = allPosts.filter(post => !post.featured);
  const categories = getAllCategories(allPosts);
  const tags = getAllTags(allPosts);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background pt-24">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Context0 Blog
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover the latest insights, tutorials, and updates about workflow automation, 
              productivity tips, and Context0 platform features.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 flex max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                />
              </div>
              <Button className="ml-2">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-2xl font-bold">Featured Posts</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-2xl font-bold">All Posts</h2>
            
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm">All</Button>
              {categories.map((category) => (
                <Button key={category} variant="ghost" size="sm">
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {allPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Check back soon for the latest updates and insights.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Tags */}
      {tags.length > 0 && (
        <section className="py-16 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest automation tips, product updates, and industry insights.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <Badge variant="secondary" className="mb-2">
            {post.category}
          </Badge>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-foreground transition-colors">
            {post.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-2">
            {post.summary}
          </p>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium">C</span>
            </div>
            <span>Context0 Team</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(parseISO(post.date), "MMM d, yyyy")}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            )}
          </div>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Read More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20" />
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{post.category}</Badge>
          <div className="flex gap-1">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {post.summary}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium">C</span>
            </div>
            <span>Context0 Team</span>
          </div>
          {post.readTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} min</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {format(parseISO(post.date), "MMM d, yyyy")}
          </span>
          <Link href={`/blog/${post.slug}`}>
            <Button size="sm">
              Read More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}