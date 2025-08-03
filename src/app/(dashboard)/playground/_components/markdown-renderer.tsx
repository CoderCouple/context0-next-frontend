import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headings
        h1: ({ children }) => <h1 className="text-xl font-bold mb-4 mt-6">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-semibold mb-3 mt-5">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-4">{children}</h3>,
        h4: ({ children }) => <h4 className="text-sm font-semibold mb-2 mt-3">{children}</h4>,
        
        // Paragraphs and text
        p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        
        // Lists
        ul: ({ children }) => <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        
        // Code
        code: ({ inline, children }: any) => {
          if (inline) {
            return <code className="bg-orange-200/50 dark:bg-orange-900/30 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
          }
          return (
            <pre className="bg-orange-200/30 dark:bg-orange-900/20 p-3 rounded-md overflow-x-auto mb-3">
              <code className="text-sm font-mono">{children}</code>
            </pre>
          );
        },
        
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-orange-400 dark:border-orange-600 pl-4 italic my-3">
            {children}
          </blockquote>
        ),
        
        // Horizontal rule
        hr: () => <hr className="my-4 border-muted" />,
        
        // Links
        a: ({ href, children }) => (
          <a 
            href={href} 
            className="text-primary underline hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        
        // Tables (if using remark-gfm)
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full divide-y divide-border">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-orange-200/30 dark:bg-orange-900/20">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => (
          <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => <td className="px-3 py-2 text-sm">{children}</td>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}