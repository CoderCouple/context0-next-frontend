"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Home, RefreshCcw } from "lucide-react";

// Replace with your JSON or SVG

export default function ErrorFallback({
  title = "Workflow not found",
  message = "It might have been deleted or never existed.",
  showBack = true,
  retryFn,
}: {
  title?: string;
  message?: string;
  showBack?: boolean;
  retryFn?: () => void;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-sm space-y-5 text-center">
        {/* ✨ Lottie or Animated SVG */}
        <div className="mx-auto h-32 w-32">
          <DotLottieReact
            src="/lottie/error-broken-ladder.json"
            loop
            autoplay
          />
        </div>

        {/* 💬 Message */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {/* 🧭 Action Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={retryFn || (() => window.location.reload())}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>

          {showBack && (
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </a>
          )}
        </div>

        {/* 🐞 Advanced Toggle (optional) */}
        {/* <details className="mt-2 text-xs text-muted-foreground">
          <summary>Details</summary>
          <pre>{JSON.stringify(message, null, 2)}</pre>
        </details> */}
      </div>
    </div>
  );
}
