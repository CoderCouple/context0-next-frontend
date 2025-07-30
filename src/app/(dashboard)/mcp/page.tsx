"use client";

import AddMCPServersDialog from "./_components/add-mcp-server-dialog";

function page() {
  return (
    <div className="m-6 flex h-full flex-1 flex-col">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">MCP Servers</h1>
          <p className="text-muted-foreground">Manage your MCP servers</p>
        </div>
        <AddMCPServersDialog />
      </div>
    </div>
  );
}

export default page;
