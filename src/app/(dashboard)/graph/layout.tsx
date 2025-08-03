export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-2xl font-semibold">Memory Graph</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize your memories and their connections in an interactive knowledge graph
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}