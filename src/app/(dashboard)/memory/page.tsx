import { ListMemoriesAction } from "@/actions/memory/list-memories-action";
import MemoryPageClient from "./_components/memory-page-client";

export default async function MemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; search?: string }>;
}) {
  try {
    const params = await searchParams;
    const view = params.view || "list";
    const searchQuery = params.search || "";

    // Fetch memories data on the server
    const memories = await ListMemoriesAction();
    console.log("MemoryPage: Fetched memories count:", memories.length);
    
    return (
      <MemoryPageClient 
        initialMemories={memories}
        view={view}
        searchQuery={searchQuery}
      />
    );
  } catch (error) {
    console.error("MemoryPage: Error loading page", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Error loading memories</h1>
        <p className="mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
}
