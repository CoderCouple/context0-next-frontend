"use client";

import { use } from "react";
import MemoryPageClient from "./_components/memory-page-client";

export default function MemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; search?: string }>;
}) {
  const params = use(searchParams);
  const view = params.view || "list";
  const searchQuery = params.search || "";

  return (
    <MemoryPageClient 
      view={view}
      searchQuery={searchQuery}
    />
  );
}
