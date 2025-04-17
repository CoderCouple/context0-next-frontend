"use client";

import React, { Suspense } from "react";

import Logo from "@/components/logo";

function LoadingFallback() {
  // Reserve the space that the children will occupy
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center">
      Loading...
    </div>
  );
}

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-orange-100 to-orange-500">
      <Logo />
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </div>
  );
}

export default layout;
